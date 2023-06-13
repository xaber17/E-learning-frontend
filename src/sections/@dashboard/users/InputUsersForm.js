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
import { getMasterBagianActive } from '../../../redux/slices/masterBagian';
import { getMasterJabatanActive } from '../../../redux/slices/masterJabatan';
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
  roleOptions = roles.filter((x) => x.code !== 'admin');
} catch (e) {
  console.log(e);
}

export default function InputUsersForm({ currentData, menu, action }) {
  console.log('INPUT USER FORM', currentData);
  console.log('ACTION', action);
  console.log('MENU', menu);

  const navigate = useNavigate();
  const [jabatanOption, setJabatanOption] = useState([]);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { masterJabatan } = useSelector((state) => state.masterJabatan);
  let masterJabatanList = [];
  try {
    masterJabatanList = masterJabatan?.data;
  } catch (e) {
    console.log(e);
  }

  const { masterBagian } = useSelector((state) => state.masterBagian);
  let masterBagianList = [];
  try {
    masterBagianList = masterBagian?.data;
  } catch (e) {
    console.log(e);
  }
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getMasterBagianActive());
    } catch (e) {
      console.log('ERROR', e);
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getMasterJabatanActive());
    } catch (e) {
      console.log('ERROR', e);
    }
    setLoading(false);
  }, [dispatch]);

  const [strukturKepegawaian, setJabatan] = useState([]);
  const [message, setMessage] = useState('');

  const NewUserSchema = Yup.object().shape({
    akun: Yup.boolean(),
    nama_lengkap: Yup.string().when('akun', { is: false, then: Yup.string().required('Nama Lengkap wajib diisi') }),
    email: Yup.string().when('akun', {
      is: false,
      then: Yup.string().required('Email wajib diisi').email(),
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
    is_admin: Yup.string().when('akun', {
      is: false,
      then: Yup.string().required('Admin wajib dipilih'),
    }),
    id_jabatan: Yup.string().when('akun', {
      is: false,
      then: Yup.string().required('Jabatan wajib dipilih'),
    }),
    status_user: Yup.string().when('akun', {
      is: false,
      then: Yup.string().required('Status wajib dipilih'),
    }),
    id_bagian: Yup.string().when('akun', {
      is: false,
      then: Yup.string().required('Bagian wajib dipilih'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      nama_lengkap: currentData?.nama_lengkap || '',
      email: currentData?.email || '',
      role: currentData?.role || '',
      password: '',
      password_confirmation: '',
      status_user: currentData?.status_user || '',
      is_admin: currentData?.is_admin || '',
      id_jabatan: currentData?.id_jabatan || '',
      id_bagian: currentData?.id_bagian || '',
      id_user: currentData?.id_user || '',
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

  if (action === 'update' && menu === 'Akun' && values.nama_lengkap === '') {
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

  const idBagian = values.id_bagian;

  let strukturOption = [];

  useEffect(() => {
    try {
      setJabatanOption([]);
      console.log(masterJabatanList);
      strukturOption = masterJabatanList?.filter((x) => parseInt(x.id_bagian, 10) === parseInt(idBagian, 10));
      console.log(strukturOption);
      setJabatanOption(strukturOption);
    } catch (e) {
      console.log('error', e);
    }
  }, [idBagian]);

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
      email: data.email,
      id_jabatan: parseInt(data.id_jabatan, 10),
      is_admin: data.is_admin,
      nama_lengkap: data.nama_lengkap,
      password: data.password,
      password_confirmation: data.password_confirmation,
      role: data.role,
      status_user: data.status_user,
    };

    const updateUserAll = {
      id_bagian: data.id_bagian,
      email: data.email,
      id_jabatan: data.id_jabatan,
      is_admin: data.is_admin,
      nama_lengkap: data.nama_lengkap,
      password: data.password,
      password_confirmation: data.password_confirmation,
      role: data.role,
      status_user: data.status_user,
    };

    const updateUserNoPassword = {
      id_bagian: data.id_bagian,
      email: data.email,
      id_jabatan: data.id_jabatan,
      is_admin: data.is_admin,
      nama_lengkap: data.nama_lengkap,
      role: data.role,
      status_user: data.status_user,
    };

    const updateAkun = {
      email: currentData?.email,
      id_jabatan: currentData?.id_jabatan,
      is_admin: currentData?.is_admin,
      nama_lengkap: currentData?.nama_lengkap,
      role: currentData?.role,
      status_user: currentData?.status_user,
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
        dispatch(updateUser(data.id_user, updateAkun))
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
          dispatch(updateUser(data.id_user, updateUserAll))
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
          dispatch(updateUser(data.id_user, updateUserNoPassword))
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
              <RHFTextField name="nama_lengkap" label="Nama Lengkap" disabled={menu === 'Akun'} />
              <RHFTextField name="email" label="Email" disabled={menu === 'Akun'} />

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
                  <RHFSelect name="is_admin" label="Admin" placeholder="Admin">
                    <option value="" />
                    {isAdmin.map((option) => (
                      <option key={option.id} value={option.id.toString()}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect name="status_user" label="Status User" placeholder="Status User">
                    <option value="" />
                    {statusUser.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>

                  <RHFSelect name="id_bagian" label="Bagian" placeholder="Bagian">
                    <option value="" />
                    {masterBagianList?.map((option) => (
                      <option key={option.id_bagian} value={option.id_bagian}>
                        {option.nama_bagian}
                      </option>
                    ))}
                  </RHFSelect>
                  {idBagian && (
                    <RHFSelect name="id_jabatan" label="Jabatan" placeholder="Jabatan">
                      <option value="" />
                      {jabatanOption?.map((option) => (
                        <option key={option.id_jabatan} value={option.id_jabatan}>
                          {option.nama_jabatan}
                        </option>
                      ))}
                    </RHFSelect>
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
