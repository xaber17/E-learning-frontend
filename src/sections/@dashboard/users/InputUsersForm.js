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
import { getKelas } from '../../../redux/slices/kelas';
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
  { id: 1, code: true, label: 'Aktif' },
  { id: 2, code: false, label: 'Non-Aktif' },
];

const roleOptions = [
  { id: 1, code: 'admin', label: 'Admin' },
  { id: 2, code: 'guru', label: 'Guru' },
  { id: 3, code: 'siswa', label: 'Siswa' },
];

const kelasOptions = [
  { kelas_id: 0, nama_kelas: 'Admin(Bukan Kelas)', deskripsi: 'Admin' },
  { kelas_id: 1, nama_kelas: 'Kelas A', deskripsi: 'Deskripsi Kelas A' },
  { kelas_id: 2, nama_kelas: 'Kelas B', deskripsi: 'Deskripsi Kelas B' },
  { kelas_id: 3, nama_kelas: 'Kelas C', deskripsi: 'Deskripsi Kelas C' },
  { kelas_id: 4, nama_kelas: 'Kelas D', deskripsi: 'Deskripsi Kelas D' },
];

export default function InputUsersForm({ currentData, menu, action }) {
  console.log('INPUT USER FORM', currentData);
  console.log('ACTION', action);
  console.log('MENU', menu);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');

  const { kelas } = useSelector((state) => state.kelas);
  let kelasList = [];
  try {
    kelasList = kelas?.data?.result;
  } catch (e) {
    console.log(e);
  }
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getKelas());
    } catch (e) {
      console.log('ERROR', e);
    }
    setLoading(false);
  }, [dispatch]);

  console.log('kelas list', kelasList);

  const NewUserSchema = Yup.object().shape({
    nomor_induk: Yup.string().required('Nomor Induk wajib diisi'),
    nama_user: Yup.string().required('Nama Lengkap wajib diisi'),
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
    kelas_id: Yup.string().required('Kelas wajib dipilih'),
    role: Yup.string().when('akun', {
      is: false,
      then: Yup.string().required('Role wajib dipilih'),
    }),
    status: Yup.string().when('akun', {
      is: false,
      then: Yup.string().required('Status wajib dipilih'),
    }),
    username: Yup.string().required('Username wajib diisi'),
    // akun: Yup.boolean(),
    // nama_user: Yup.string().when('akun', { is: false, then: Yup.string().required('Nama Lengkap wajib diisi') }),
    // username: Yup.string().when('akun', {
    //   is: false,
    //   then: Yup.string().required('username wajib diisi'),
    // }),

    // role: Yup.string().when('akun', {
    //   is: false,
    //   then: Yup.string().required('Role wajib dipilih'),
    // }),
    // is_admin: Yup.string().when('akun', {
    //   is: false,
    //   then: Yup.string().required('Admin wajib dipilih'),
    // }),
    // kelas_id: Yup.string().when('akun', {
    //   is: false,
    //   then: Yup.string().required('Jabatan wajib dipilih'),
    // }),
    // status: Yup.string().when('akun', {
    //   is: false,
    //   then: Yup.string().required('Status wajib dipilih'),
    // }),
    // id_bagian: Yup.string().when('akun', {
    //   is: false,
    //   then: Yup.string().required('Bagian wajib dipilih'),
    // }),
  });

  const defaultValues = useMemo(
    () => ({
      nama_user: currentData?.nama_user || '',
      nomor_induk: currentData?.nomor_induk || '',
      username: currentData?.username || '',
      role: currentData?.role || '',
      password: '',
      password_confirmation: '',
      status: currentData?.status || false,
      kelas_id: currentData?.kelas_id || '',
      user_id: currentData?.user_id || '',
      changePassword: currentData?.changePassword,
      // akun: currentData?.akun || false,
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

  if (action === 'update' && menu === 'Akun' && values.nama_user === '') {
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
      kelas_id: data.kelas_id,
      nama_user: data.nama_user,
      password: data.password,
      role: data.role,
      status: data.status,
      nomor_induk: data.nomor_induk,
    };

    const updateUserAll = {
      username: data.username,
      kelas_id: data.kelas_id,
      nama_user: data.nama_user,
      password: data.password,
      role: data.role,
      status: data.status,
      nomor_induk: data.nomor_induk,
    };

    const updateUserNoPassword = {
      username: data.username,
      kelas_id: data.kelas_id,
      nama_user: data.nama_user,
      role: data.role,
      status: data.status,
      nomor_induk: data.nomor_induk,
    };

    const updateAkun = {
      username: data.username,
      kelas_id: data.kelas_id,
      nomor_induk: data.nomor_induk,
      nama_user: data.nama_user,
      password: data.password,
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
        dispatch(updateUser(data.user_id, updateAkun))
          .then((update) => {
            console.log(update);
            reset();
            dispatch(resetUser());
            enqueueSnackbar('Berhasil Mengubah Data');
            window.location.reload();
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
          dispatch(updateUser(data.user_id, updateUserAll))
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
          dispatch(updateUser(data.user_id, updateUserNoPassword))
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
    setTimeout(() => {
      return <LoadingScreen />;
    }, 1000);
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
              <RHFTextField name="nama_user" label="Nama Lengkap" />
              <RHFTextField name="username" label="Username" />
              <RHFTextField name="nomor_induk" label="No. Induk" />
              <RHFSelect name="kelas_id" label="Kelas" placeholder="Kelas">
                <option value="" />
                {kelasList.map((option) => (
                  <option key={option.kelas_id} value={option.kelas_id}>
                    {option.kelas_name}
                  </option>
                ))}
              </RHFSelect>

              {currentData !== null && menu !== 'Akun' ? (
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
              {menu !== 'Akun' && (
                <>
                  <RHFSelect name="role" label="Tipe User" placeholder="Tipe User">
                    <option value="" />
                    {roleOptions.map((option) => (
                      <option key={option.id} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>

                  <RHFSelect name="status" label="Status" placeholder="Status">
                    <option value="" />
                    {statusUser.map((option) => (
                      <option key={option.id} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </>
              )}

              {/* {menu === 'Akun' && (
                <>
                  <RHFTextField name="password" label="Kata Sandi" type="password" />
                  <RHFTextField name="password_confirmation" label="Ketik Ulang Kata Sandi" type="password" />
                </>
              )} */}

              {/* {menu === 'Users Form' && (
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
                  <RHFSelect name="status" label="Status User" placeholder="Status User">
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
                    <RHFSelect name="kelas_id" label="Jabatan" placeholder="Jabatan">
                      <option value="" />
                      {jabatanOption?.map((option) => (
                        <option key={option.kelas_id} value={option.kelas_id}>
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
              )} */}
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
