import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  InputAdornment,
  TextField,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';

import { useDispatch, useSelector } from '../../../redux/store';

import { getLembur, createLembur, resetLembur } from '../../../redux/slices/lembur';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries, roles } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

InputLemburForm.propTypes = {
  isEdit: PropTypes.bool,
  currentLembur: PropTypes.object,
  menu: PropTypes.string,
};

const jenisLemburOptions = [
  { id: 1, code: 'lemburharilibur', label: 'Lembur Hari Libur' },
  { id: 2, code: 'lemburharikerja', label: 'Lembur Hari Kerja' },
];

const pegawaiList = [
  { nip: 22060001, nama_lengkap: 'Dirut' },
  { nip: 22060002, nama_lengkap: 'Staf Absensi dan Lembur 1' },
  { nip: 22060003, nama_lengkap: 'Manajer 1 HRD' },
  { nip: 22060004, nama_lengkap: 'Manajer 2 HRD' },
];

export default function InputLemburForm({ currentData, menu, action }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const LemburSchema = Yup.object().shape({
    nip: Yup.string().required('Pegawai wajib dipilih'),
    waktu_masuk_lembur: Yup.date().required('Waktu masuk lembur wajib diisi'),
    waktu_keluar_lembur: Yup.date().required('Waktu keluar lembur wajib diisi'),
    jenis_lembur: Yup.string().required('Jenis lembur wajib dipilih'),
    keterangan_lembur: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      id_lembur: currentData?.id_lembur || '',
      nip: currentData?.nip || '',
      nama_lengkap: currentData?.nama_lengkap || '',
      waktu_masuk_lembur: currentData?.waktu_masuk_lembur || new Date(),
      waktu_keluar_lembur: currentData?.waktu_keluar_lembur || new Date(),
      jenis_lembur: currentData?.jenis_lembur || '',
      nama_jenis_lembur: currentData?.nama_jenis_lembur || '',
      keterangan_lembur: currentData?.keterangan_lembur || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(LemburSchema),
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

  useEffect(() => {
    if (currentData) {
      reset(defaultValues);
    }
    if (!currentData) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData, menu]);

  let msg = '';
  const failedMessage = 'Gagal menambah data';

  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const onSubmit = async () => {
 
    const dataLembur = {
      nip: values?.nip || '',
      waktu_masuk_lembur: values?.waktu_masuk_lembur || '',
      waktu_keluar_lembur: values?.waktu_keluar_lembur || '',
      keterangan_lembur: values?.keterangan_lembur || '',
      jenis_lembur: values?.jenis_lembur || '',
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('ACTION', action);
    if (action === 'create') {
      dispatch(createLembur(dataLembur))
        .then((create) => {
          console.log(create);
          reset();
          dispatch(resetLembur());
          navigate(PATH_DASHBOARD.lembur.list);
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
    dispatch(resetLembur());
    if (currentData) {
      window.localStorage.removeItem('currentLembur');
    }
    window.localStorage.removeItem('action');
    await getLembur();
    navigate(PATH_DASHBOARD.lembur.list);
  };

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const file = acceptedFiles[0];

  //     if (file) {
  //       setValue(
  //         'avatarUrl',
  //         Object.assign(file, {
  //           preview: URL.createObjectURL(file),
  //         })
  //       );
  //     }
  //   },
  //   [setValue]
  // );

  const isDateError = isBefore(new Date(values.waktu_keluar_lembur), new Date(values.waktu_masuk_lembur));

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
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              {action === 'create' ? (
                <RHFSelect name="nip" label="Nama Pegawai" placeholder="Nama Pegawai">
                  <option value="" />
                  {pegawaiList?.map((option) => (
                    <option key={option.nip} value={option.nip}>
                      {option.nama_lengkap} / {option.nip}
                    </option>
                  ))}
                </RHFSelect>
              ) : (
                <RHFTextField name="nama_lengkap" label="Nama Pegawai" disabled />
              )}
            </Box>
            <Box sx={{ p: 1 }} />
            {action === 'create' ? (
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Controller
                  name="waktu_masuk_lembur"
                  control={control}
                  render={({ field }) => (
                    <MobileDateTimePicker
                      {...field}
                      label="Waktu Masuk"
                      inputFormat="dd/MM/yyyy hh:mm a"
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  )}
                />

                <Controller
                  name="waktu_keluar_lembur"
                  control={control}
                  render={({ field }) => (
                    <MobileDateTimePicker
                      {...field}
                      label="Waktu Keluar"
                      inputFormat="dd/MM/yyyy hh:mm a"
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
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFTextField name="waktu_masuk_lembur" label="Waktu Masuk Lembur" disabled />
                <RHFTextField name="waktu_keluar_lembur" label="Waktu Keluar Lembur" disabled />
              </Box>
            )}
            <Box sx={{ p: 1 }} />
            {action === 'create' ? (
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
                }}
              >
                <RHFTextField name="keterangan_lembur" label="Keterangan" multiline rows={4} />

                <RHFSelect name="jenis_lembur" label="Jenis Lembur" placeholder="Jenis Lembur">
                  <option value="" />
                  {jenisLemburOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
                }}
              >
                <RHFTextField name="keterangan_lembur" label="Keterangan Lembur" disabled />
                <RHFTextField name="nama_jenis_lebur" label="Jenis Lembur" disabled />
              </Box>
            )}

            <Box>
              <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                <Button variant="contained" color="inherit" onClick={handleBack}>
                  Kembali
                </Button>
                {action === 'create' && (
                  <LoadingButton variant="contained" onClick={handleOpenConfirm}>
                    Simpan
                  </LoadingButton>
                )}
              </Stack>
            </Box>
          </Card>

          <DialogAnimate open={open} onClose={handleCloseModal}>
            <DialogTitle>{failedMessage}</DialogTitle>
            <DialogContent>
              <DialogContentText>{message}</DialogContentText>
            </DialogContent>
          </DialogAnimate>

          <DialogAnimate open={confirmOpen} onClose={handleCloseModal}>
            <DialogTitle>Konfirmasi</DialogTitle>
            <DialogContent>
              <DialogContentText>Data yang sudah disimpan tidak dapat diubah, apakah anda yakin?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirm} variant="contained" color="error">
                Kembali
              </Button>
              <LoadingButton type="submit" variant="contained" onClick={onSubmit}>
                {'Simpan'}
              </LoadingButton>
            </DialogActions>
          </DialogAnimate>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
