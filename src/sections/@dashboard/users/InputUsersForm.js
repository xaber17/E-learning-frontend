import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';

import { useDispatch, useSelector } from '../../../redux/store';

import { createUser, getUsers, resetUser, updateUser } from '../../../redux/slices/users';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries, roles } from '../../../_mock';
// components
import Label from '../../../components/Label';
import LoadingScreen from '../../../components/LoadingScreen';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

InputUsersForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
  menu: PropTypes.string,
};

const statusUser = [
  { id: 1, code: 'aktif', label: 'Aktif' },
  { id: 2, code: 'non_aktif', label: 'Tidak Aktif' },
];

const isAdmin = [
  { id: 1, label: 'Ya' },
  { id: 2, label: 'Tidak' },
];

let roleOptions = [];

try {
  roleOptions = roles;
} catch (e) {
  console.log(e);
}

export default function InputUsersForm({ currentData, menu, action }) {
  console.log('INPUT USER FORM', currentData);
  console.log('ACTION', action);
  console.log('MENU', menu);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');

  const NewUserSchema = Yup.object().shape({
    akun: Yup.boolean(),
    namaLengkap: Yup.string().when('akun', { is: false, then: Yup.string().required('Nama Lengkap wajib diisi') }),
    username: Yup.string().when('akun', {
      is: false,
      then: Yup.string().required('Username wajib diisi'),
    }),
    changePassword: Yup.boolean(),
    password: Yup.string().when('changePassword', {
      is: true,
      then: Yup.string().required('Kata Sandi wajib diisi'),
    }),
    password_confirmation: Yup.string().when('changePassword', {
      is: true,
      then: Yup.string()
        .required('Ketik Ulang Kata Sandi wajib diisi')
        .oneOf([Yup.ref('password'), null], 'Kata sandi tidak sama'),
    }),
    role: Yup.string().when('akun', {
      is: false,
      then: Yup.string().required('Role wajib dipilih'),
    }),

    kelas: Yup.string().when('akun', {
      is: false,
      then: Yup.string().required('Kelas Wajib Diisi'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      namaLengkap: currentData?.namaLengkap || '',
      username: currentData?.username || '',
      role: currentData?.role || '',
      password: '',
      password_confirmation: '',
      status_user: currentData?.status_user || '',
      kelas: currentData?.kelas || '',
      noInduk: currentData?.noInduk || '',
      changePassword: currentData?.changePassword,
      akun: currentData?.akun || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  console.log('VALUE INPUT', values);

  if (action === 'update' && menu === 'Akun' && values.namaLengkap === '') {
    window.location.reload();
  }
  console.log('CURRENTDATA', currentData);

  useEffect(() => {
    if (currentData) {
      reset(defaultValues);
    }
    if (!currentData) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData, menu]);

  const err = useSelector((state) => state.error);
  let msg = '';
  let failedMessage = '';
  if (action === 'create') {
    failedMessage = 'Gagal menambah data';
  } else if (action === 'update') {
    failedMessage = 'Gagal mengubah data';
  }

  const onSubmit = async (data) => {
    console.log('jalan');
    console.log(data);
    // try {
    const newUser = {
      username: data.username,
      namaLengkap: data.namaLengkap,
      password: data.password,
      password_confirmation: data.password_confirmation,
      role: data.role,
    };

    const updateUserAll = {
      kelas: data.kelas,
      username: data.username,
      namaLengkap: data.namaLengkap,
      password: data.password,
      password_confirmation: data.password_confirmation,
      role: data.role,
    };

    const updateUserNoPassword = {
      kelas: data.kelas,
      username: data.username,
      namaLengkap: data.namaLengkap,
      role: data.role,
    };

    const updateAkun = {
      username: currentData?.username,
      kelas: currentData?.kelas,
      namaLengkap: currentData?.namaLengkap,
      role: currentData?.role,
      password: data.password,
      password_confirmation: data.password_confirmation,
    };
    console.log('pushed button');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (action === 'create') {
      console.log('NEW USER', newUser);
      dispatch(createUser(newUser))
        .then((create) => {
          console.log(create);
          reset();
          dispatch(resetUser());
          navigate(PATH_DASHBOARD.users.list);
        })
        .catch((e) => {
          console.log('ERROR', e);
          const error = e;
          Object.keys(error).forEach((key) => {
            console.log(error[key][0]); // 👉️ "Tom", "Chile"
            const errMessage = error[key][0];

            msg = msg.concat(errMessage);
          });

          console.log('ERROR MESSAGE', msg);

          setMessage(msg);
          setOpen(true);
          handleCloseModal();
        });
    } else if (action === 'update') {
      console.log('jalan update');
      if (menu === 'Akun') {
        console.log('jalan update akun true');
        dispatch(updateUser(data.noInduk, updateAkun))
          .then((update) => {
            console.log(update);
            reset();
            dispatch(resetUser());
            enqueueSnackbar('Berhasil Mengubah Data');
          })
          .catch((e) => {
            console.log('ERROR', e);
            const error = e;
            Object.keys(error).forEach((key) => {
              console.log(error[key][0]); // 👉️ "Tom", "Chile"
              const errMessage = error[key][0];

              msg = msg.concat(errMessage);
            });

            console.log('ERROR MESSAGE', msg);

            setMessage(msg);
            setOpen(true);
            handleCloseModal();
          });
      } else if (menu === 'Users Form') {
        if (data.changePassword) {
          console.log('jalan change password true');
          dispatch(updateUser(data.noInduk, updateUserAll))
            .then((update) => {
              console.log(update);
              reset();
              dispatch(resetUser());
              navigate(PATH_DASHBOARD.users.list);
            })
            .catch((e) => {
              console.log('ERROR', e);
              const error = e;
              Object.keys(error).forEach((key) => {
                console.log(error[key][0]); // 👉️ "Tom", "Chile"
                const errMessage = error[key][0];

                msg = msg.concat(errMessage);
              });

              console.log('ERROR MESSAGE', msg);

              setMessage(msg);
              setOpen(true);
              handleCloseModal();
            });
        } else {
          console.log('jalan change password false');
          dispatch(updateUser(data.noInduk, updateUserNoPassword))
            .then((update) => {
              console.log(update);
              reset();
              dispatch(resetUser());
              navigate(PATH_DASHBOARD.users.list);
            })
            .catch((e) => {
              console.log('ERROR', e);
              const error = e;
              Object.keys(error).forEach((key) => {
                console.log(error[key][0]); // 👉️ "Tom", "Chile"
                const errMessage = error[key][0];

                msg = msg.concat(errMessage);
              });

              console.log('ERROR MESSAGE', msg);

              setMessage(msg);
              setOpen(true);
              handleCloseModal();
            });
        }
      }
    }
  };

  const handleCloseModal = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  const handleBack = async () => {
    reset();
    dispatch(resetUser());
    if (currentData) {
      window.localStorage.removeItem('currentUser');
    }
    window.localStorage.removeItem('action');
    await getUsers();
    navigate(PATH_DASHBOARD.users.list);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="namaLengkap" label="Nama Lengkap" disabled={menu === 'Akun'} />
              <RHFTextField name="userName" label="Username" disabled={menu === 'Akun'} />
              <RHFTextField name="kelas" label="Kelas" disabled={menu === 'Akun'} />

              {menu === 'Akun' && (
                <>
                  <RHFTextField name="password" label="Kata Sandi" type="password" />
                  <RHFTextField name="password_confirmation" label="Ketik Ulang Kata Sandi" type="password" />
                </>
              )}

              {menu === 'Users Form' && (
                <>
                  {currentData !== null ? (
                    <>
                      <RHFSwitch name="changePassword" label="Ubah kata sandi?" />
                      <Box />
                      {values.changePassword === true && (
                        <>
                          <RHFTextField
                            name="password"
                            label="Kata Sandi"
                            type="password"
                            disabled={!values.changePassword}
                          />
                          <RHFTextField
                            name="password_confirmation"
                            label="Ketik Ulang Kata Sandi"
                            type="password"
                            disabled={!values.changePassword}
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <RHFTextField name="password" label="Kata Sandi" type="password" />
                      <RHFTextField name="password_confirmation" label="Ketik Ulang Kata Sandi" type="password" />
                    </>
                  )}

                  <RHFSelect name="role" label="Role" placeholder="Role">
                    <option value="" />
                    {roleOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </>
              )}
            </Box>

            <Box>
              <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                {menu === 'Users Form' ? (
                  <Button variant="contained" color="inherit" onClick={handleBack}>
                    Kembali
                  </Button>
                ) : (
                  <Box />
                )}
                <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
                  Simpan
                </LoadingButton>
              </Stack>
            </Box>
          </Card>
          <DialogAnimate open={open} onClose={handleCloseModal}>
            <DialogTitle>{failedMessage}</DialogTitle>
            <DialogContent>
              <DialogContentText>{message}</DialogContentText>
            </DialogContent>
          </DialogAnimate>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
