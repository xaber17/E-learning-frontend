import PropTypes from 'prop-types';
import * as Yup from 'yup';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
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
} from '@mui/material';

// utils
import { fData } from '../../../utils/formatNumber';

import { useDispatch, useSelector } from '../../../redux/store';

import { createHasil, getHasil, resetHasil, updateHasil } from '../../../redux/slices/hasil';
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries, roles } from '../../../_mock';
// components
import Label from '../../../components/Label';
import LoadingScreen from '../../../components/LoadingScreen';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import InputSoalForm from './InputSoalForm';

// ----------------------------------------------------------------------

InputHasilForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
  menu: PropTypes.string,
};

export default function InputHasilForm({ currentData, menu, action }) {
  console.log('INPUT UJIAN FORM', currentData);
  console.log('ACTION', action);
  console.log('MENU', menu);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');

  const NewHasilSchema = Yup.object().shape({
    soal_name: Yup.string().required('Nama Hasil wajib diisi'),
    tipe_soal: Yup.string().required('Tipe Soal wajib diisi'),
  });

  const defaultValues = useMemo(
    () => ({
      soal_name: currentData?.soal_name || '',
      file_id: currentData?.file_id || '',
      tipe_soal: currentData?.tipe_soal || '',
      user_id: currentData?.user_id || '',
      kelas_id: currentData?.kelas_id || '',
      deadline: currentData?.deadline || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(NewHasilSchema),
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
    const newHasil = {
      soal_name: data.soal_name,
      file_id: data.file_id,
      tipe_soal: data.tipe_soal,
      user_id: data.user_id,
      kelas_id: data.kelas_id,
      deadline: data.deadline,
    };

    const updateHasilAll = {
      soal_name: data.soal_name,
      file_id: data.file_id,
      tipe_soal: data.tipe_soal,
      user_id: data.user_id,
      kelas_id: data.kelas_id,
    };

    const updateHasilData = {
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
      console.log('NEW Hasil', newHasil);
      dispatch(createHasil(newHasil))
        .then((create) => {
          console.log(create);
          reset();
          dispatch(resetHasil());
          navigate(PATH_DASHBOARD.hasil.list);
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
      dispatch(updateHasil(data.soal_id, updateHasilData))
        .then((update) => {
          console.log(update);
          reset();
          dispatch(resetHasil());
          navigate(PATH_DASHBOARD.hasil.list);
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
    dispatch(resetHasil());
    if (currentData) {
      window.localStorage.removeItem('currentHasil');
    }
    window.localStorage.removeItem('action');
    await getHasil();
    navigate(PATH_DASHBOARD.hasil.list);
  };

  if (loading) {
    setTimeout(() => {
      return <LoadingScreen />;
    }, 1000);
  }

  // ----------------------------------------------------------------------
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleOpenDatePicker = () => {
    setOpenDatePicker(true);
  };

  const handleCloseDatePicker = () => {
    setOpenDatePicker(false);
  };

  // ----------------------------------------------------------------------
  const [openModal, setOpenModal] = React.useState(false);

  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };
  // ----------------------------------------------------------------------

  const jenisOptions = [
    { id: 1, code: 'pilihanGanda', label: 'Pilihan Ganda' },
    { id: 2, code: 'esai', label: 'Esai' },
    { id: 3, code: 'gandaEsai', label: 'Pilihan Ganda dan Esai' },
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <h3>Nama : Getar Nuansa</h3>
            </Box>
            <Box>
              <h5>Pilihan Ganda</h5>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {[1, 2, 3].map((value) => (
                  <ListItem
                    key={value}
                    disableGutters
                    // secondaryAction={
                    //   <Button aria-label="edit" onClick={<InputSoalForm />}>
                    //     Edit
                    //   </Button>
                    // }
                  >
                    <ListItemText primary={`${value}. Pertanyaan ${value}`} />
                  </ListItem>
                ))}
              </List>
              <h5>Esai</h5>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {[1, 2, 3].map((value) => (
                  <ListItem
                    key={value}
                    disableGutters
                    // secondaryAction={
                    //   <Button aria-label="edit" onClick={<InputSoalForm />}>
                    //     Edit
                    //   </Button>
                    // }
                  >
                    <ListItemText primary={`${value}. Pertanyaan ${value}`} />
                  </ListItem>
                ))}
              </List>

              <RHFTextField name="nilai" label="Nilai Esai Keseluruhan" />
            </Box>
            {/* <Box sx={{ mt: 2 }}>
              <h4>Soal</h4>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {[1, 2, 3].map((value) => (
                  <ListItem
                    key={value}
                    disableGutters
                    // secondaryAction={
                    //   <Button aria-label="edit" onClick={<InputSoalForm />}>
                    //     Edit
                    //   </Button>
                    // }
                  >
                    <ListItemText primary={`${value}. Pertanyaan ${value}`} />
                  </ListItem>
                ))}
              </List>
            </Box> */}

            <Box>
              <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                {menu === 'Hasil Form' ? (
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
