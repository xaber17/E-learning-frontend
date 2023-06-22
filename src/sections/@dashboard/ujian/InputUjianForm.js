import PropTypes from 'prop-types';
import * as Yup from 'yup';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker, LoadingButton, LocalizationProvider, MobileDateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
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
  Modal,
  TextField,
  DialogActions,
  Dialog,
  List,
  ListItem,
  IconButton,
  ListItemText,
  FormLabel,
  RadioGroup,
  Radio,
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
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFUploadMultiFile,
} from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import InputSoalForm from './InputSoalForm';

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

  const { user } = useAuth();
  console.log("INi User: ", user)
  const { kelas } = useSelector((state) => state.kelas);
  let kelasList = [];
  try {
    kelasList = kelas?.data?.result;
  } catch (e) {
    console.log(e);
  }

  const NewUjianSchema = Yup.object().shape({
    soal_name: Yup.string().required('Nama Ujian wajib diisi'),
    tipe_soal: Yup.string().required('Tipe Soal wajib diisi'),
    deadline: Yup.date().required('Deadline wajib diisi'),
    pdf: Yup.array()
  });

  const defaultValues = useMemo(
    () => ({
      soal_id: currentData?.soal_id || '',
      soal_name: currentData?.soal_name || '',
      tipe_soal: currentData?.tipe_soal || '',
      user_id: currentData?.user_id || '',
      kelas_id: currentData?.kelas_id || '',
      deadline: new Date(currentData?.deadline) || '',
      nilai: currentData?.nilai || 0,
      pdf: currentData?.pdf || [],
      jawaban_id: currentData?.jawaban_id || '',
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
  const pdf = values.pdf.length >= 1;

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
    // console.log(data);
    // try {
    const newUjian = {
      soal_name: data?.soal_name,
      soal_id: data?.soal_id,
      file_id: data?.file_id,
      tipe_soal: data?.tipe_soal,
      user_id: data?.user_id,
      kelas_id: data?.kelas_id,
      deadline: data?.deadline,
      file: data?.pdf[0] || [],
      nilai: data?.nilai || 0,
    };

    const updateUjianData = {
      soal_name: data.soal_name,
      file_id: data.file_id,
      tipe_soal: data.tipe_soal,
      user_id: data.user_id,
      kelas_id: data.kelas_id,
      nilai: data?.nilai || 0,
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

  // ----------------------------------------------------------------------

  const hiddenForUjian = menu !== 'Ujian Form' ? { display: 'none' } : {};
  const hiddenForHasil = menu !== 'Hasil Form' ? { display: 'none' } : {};
  const hiddenForSiswa = menu !== 'Ujian Siswa Form' ? { display: 'none' } : {};

  const jenisOptions = [
    { id: 1, code: 'Ujian', label: 'Ujian' },
    { id: 2, code: 'Kuis', label: 'Kuis' },
  ];

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'pdf',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('pdf', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.pdf?.filter((_file) => _file !== file);
    setValue('pdf', filteredItems);
  };
  const isDateError = isBefore(new Date(values.deadline), new Date());

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Input Ujian Form */}
          <Card sx={{ p: 3 }} style={hiddenForUjian}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="soal_name" label="Nama Ujian" />

              <RHFSelect name="tipe_soal" label="Tipe" placeholder="Tipe">
                <option value="" />
                {jenisOptions.map((option) => (
                  <option key={option.id} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect name="kelas_id" label="Kelas" placeholder="Kelas">
                <option value="" />
                {kelasList.map((option) => (
                  <option key={option.kelas_id} value={option.kelas_id}>
                    {option.kelas_name}
                  </option>
                ))}
              </RHFSelect>
              <Controller
                name="deadline"
                control={control}
                render={({ field }) => (
                  <MobileDateTimePicker
                    {...field}
                    label="Deadline"
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!isDateError}
                        helperText={isDateError && 'End date must be later than start date'}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <h4>Soal</h4>
              <RHFUploadMultiFile
                name="pdf"
                showPreview
                accept="application/pdf"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
              />
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

          {/* Input Hasil Form */}
          <Card sx={{ p: 3 }} style={hiddenForHasil}>
            <Box sx={{ mb: 2 }}>
              <h3>Nama Siswa : {currentData?.siswa_name}</h3>
              <h3>Soal : Kuis Dadakan</h3>
            </Box>
            <Box>
              <h4>Jawaban Siswa</h4>
              <div>
              <object
                data={'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf'}
                type="application/pdf"
                width="900"
                height="678"
              >

                <iframe
                  src={'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf'}
                  width="500"
                  height="678"
                  title='asdas'
                />

              </object>
              </div>
              <RHFTextField name="nilai" label="Beri Nilai" />
            </Box>

            <Box>
              <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                {hiddenForHasil ? (
                  <Button variant="contained" color="inherit" onClick={handleBack}>
                    Kembali
                  </Button>
                ) : (
                  <Box />
                )}
                <LoadingButton type='submit' variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
                  Simpan Data
                </LoadingButton>
              </Stack>
            </Box>
          </Card>

          {/* Input Ujian Siswa */}
          <Card sx={{ p: 3 }} style={hiddenForSiswa}>
            <Box sx={{ mb: 2 }}>
              <h3>Nama : {user.nama_user}</h3>
              <h3>Soal : {currentData?.soal_name}</h3>
            </Box>
            <Box>
              <h3>File Soal</h3>
              <div>
              <object
                data={'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf'}
                type="application/pdf"
                width="900"
                height="678"
              >

                <iframe
                  src={'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf'}
                  width="500"
                  height="678"
                  title='asdas'
                />

              </object>
              </div>
              <h3>Upload Jawaban</h3>
              <RHFUploadMultiFile 
                  name="pdf"
                  showPreview
                  accept="application/pdf"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
            </Box>

            <Box>
              <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                {hiddenForSiswa ? (
                  <Button variant="contained" color="inherit" onClick={handleBack}>
                    Kembali
                  </Button>
                ) : (
                  <Box />
                )}
                <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
                  Simpan Data
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
