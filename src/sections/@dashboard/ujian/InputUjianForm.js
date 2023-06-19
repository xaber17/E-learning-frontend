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
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
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
      deadline: currentData?.deadline || '',
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
      deadline: data.deadline,
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

  // --------------------------------------------------------------------------------
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
    { id: 1, code: 'ujian', label: 'Ujian' },
    { id: 2, code: 'kuis', label: 'Kuis' },
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Input Ujian Form */}
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
              }}
            >
              <RHFTextField name="soal_name" label="Nama Ujian" disabled={menu !== 'Ujian Form'} />

              <RHFSelect name="tipe" label="Tipe" placeholder="Tipe">
                <option value="" />
                {jenisOptions.map((option) => (
                  <option key={option.id} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  name="deadline"
                  label="Deadline"
                  value={selectedDate}
                  onChange={handleDateChange}
                  open={openDatePicker}
                  onClose={handleCloseDatePicker}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              {/* <RHFTextField name="bobot" label="Bobot" /> */}
            </Box>
            <Box sx={{ mt: 2 }}>
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
              {/* <Button variant="outlined" onClick={handleClickOpen}>
                + Soal
              </Button>
              <Dialog open={openModal} onClose={handleClose}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleClose}>Subscribe</Button>
                </DialogActions>
              </Dialog> */}

              <Button variant="outlined" onClick={handleClickOpen}>
                + Soal
              </Button>
              <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Soal #1</DialogTitle>
                <DialogContent>
                  <Box sx={{ mt: 2 }}>
                    <FormLabel id="jenis">Jenis Soal</FormLabel>
                    <RadioGroup aria-label="jenis" name="jenis">
                      <FormControlLabel value="pilihanGanda" control={<Radio />} label="Pilihan Ganda" />
                      <FormControlLabel value="esai" control={<Radio />} label="Esai" />
                    </RadioGroup>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <RHFTextField name="pertanyaan" label="Tulis Pertanyaan" />
                  </Box>
                  <Grid container spacing={2} sx={{ mt: 1 }} alignItems="center">
                    <Grid item xs={9}>
                      <TextField name="jawaban_1" label="Tulisan Jawaban 1" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={3}>
                      <FormLabel id="jawaban">Jawaban yang Benar?</FormLabel>
                      <RadioGroup aria-label="jawaban" name="jawaban" row>
                        <FormControlLabel value="ya" control={<Radio />} label="Ya" />
                        <FormControlLabel value="tidak" control={<Radio />} label="Tidak" />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={9}>
                      <TextField name="jawaban_2" label="Tulisan Jawaban 2" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={3}>
                      <FormLabel id="jawaban">Jawaban yang Benar?</FormLabel>
                      <RadioGroup aria-label="jawaban" name="jawaban" row>
                        <FormControlLabel value="ya" control={<Radio />} label="Ya" />
                        <FormControlLabel value="tidak" control={<Radio />} label="Tidak" />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={9}>
                      <TextField name="jawaban_3" label="Tulisan Jawaban 3" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={3}>
                      <FormLabel id="jawaban">Jawaban yang Benar?</FormLabel>
                      <RadioGroup aria-label="jawaban" name="jawaban" row>
                        <FormControlLabel value="ya" control={<Radio />} label="Ya" />
                        <FormControlLabel value="tidak" control={<Radio />} label="Tidak" />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={9}>
                      <TextField name="jawaban_4" label="Tulisan Jawaban 4" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={3}>
                      <FormLabel id="jawaban">Jawaban yang Benar?</FormLabel>
                      <RadioGroup aria-label="jawaban" name="jawaban" row>
                        <FormControlLabel value="ya" control={<Radio />} label="Ya" />
                        <FormControlLabel value="tidak" control={<Radio />} label="Tidak" />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Kembali</Button>
                  <Button onClick={handleClose}>Simpan</Button>
                </DialogActions>
              </Dialog>
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
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <h3>Nama : Getar Nuansa</h3>
            </Box>
            <Box>
              <h4>Pilihan Ganda</h4>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {[1, 2, 3].map((value) => (
                  <Box
                    key={value}
                    disableGutters
                    // secondaryAction={
                    //   <Button aria-label="edit" onClick={<InputSoalForm />}>
                    //     Edit
                    //   </Button>
                    // }
                  >
                    <ListItemText
                      primary={`${value}. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ${value}`}
                    />
                    <Grid sx={{ pl: 2, mb: 2 }}>
                      <ListItemText>
                        <h5>
                          Jawaban: <span>A</span>
                        </h5>
                      </ListItemText>
                    </Grid>
                  </Box>
                ))}
              </List>
              <h4>Esai</h4>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {[1, 2, 3].map((value) => (
                  <Box key={value} disableGutters>
                    <ListItemText
                      primary={`${value}. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ${value}`}
                    />
                    <Grid sx={{ pl: 2, mb: 2 }}>
                      <ListItemText>
                        <h4>Jawaban:</h4>
                        <h4>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                          been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                          galley of type and scrambled it to make a type specimen book. It has survived not only five
                          centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It
                          was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                          passages, and more recently with desktop publishing software like Aldus PageMaker including
                          versions of Lorem Ipsum.
                        </h4>
                      </ListItemText>
                    </Grid>
                  </Box>
                ))}
              </List>

              <RHFTextField name="nilai" label="Nilai Esai Keseluruhan" />
            </Box>

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
