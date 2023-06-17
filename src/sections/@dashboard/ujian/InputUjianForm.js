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

import { createUjian, getUjian, resetUjian, updateUjian } from '../../../redux/slices/ujian';
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries, roles } from '../../../_mock';
// components
import Label from '../../../components/Label';
import LoadingScreen from '../../../components/LoadingScreen';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

InputUjianForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
  menu: PropTypes.string,
};

export default function InputUjianForm({ currentData, menu, action }) {
  console.log('INPUT UJIAN FORM', currentData);
  console.log('ACTION', action);
  console.log('MENU', menu);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');

  const NewUjianSchema = Yup.object().shape({
    soal_name: Yup.string().required('Nama Ujian wajib diisi'),
    tipe_soal: Yup.string().required('Tipe Soal wajib diisi'),
  });

  const defaultValues = useMemo(
    () => ({
      soal_name: currentData?.soal_name || '',
      file_id: currentData?.file_id || '',
      tipe_soal: currentData?.tipe_soal || '',
      user_id: currentData?.user_id || '',
      kelas_id: currentData?.kelas_id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(NewUjianSchema),
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

  if (action === 'update' && menu === 'Akun' && values.soal_name === '') {
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
    const newUjian = {
      soal_name: data.soal_name,
      file_id: data.file_id,
      tipe_soal: data.tipe_soal,
      user_id: data.user_id,
      kelas_id: data.kelas_id,
    };

    const updateUjianAll = {
      soal_name: data.soal_name,
      file_id: data.file_id,
      tipe_soal: data.tipe_soal,
      user_id: data.user_id,
      kelas_id: data.kelas_id,
    };

    const updateUjianData = {
      soal_name: data.soal_name,
      file_id: data.file_id,
      tipe_soal: data.tipe_soal,
      user_id: data.user_id,
      kelas_id: data.kelas_id,
    };
    console.log('pushed button');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Action: ', action);
    if (action === 'create') {
      console.log('NEW Ujian', newUjian);
      dispatch(createUjian(newUjian))
        .then((create) => {
          console.log(create);
          reset();
          dispatch(resetUjian());
          navigate(PATH_DASHBOARD.ujian.list);
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
      dispatch(updateUjian(data.soal_id, updateUjianData))
        .then((update) => {
          console.log(update);
          reset();
          dispatch(resetUjian());
          navigate(PATH_DASHBOARD.ujian.list);
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
  };

  const handleCloseModal = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  const handleBack = async () => {
    reset();
    dispatch(resetUjian());
    if (currentData) {
      window.localStorage.removeItem('currentUjian');
    }
    window.localStorage.removeItem('action');
    await getUjian();
    navigate(PATH_DASHBOARD.ujian.list);
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
              <RHFTextField name="Soal_name" label="Nama Ujian" />
              <RHFTextField name="deskripsi" label="Deskripsi" />
            </Box>

            <Box>
              <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                {menu === 'Ujian Form' ? (
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
