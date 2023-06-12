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
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';

import { useDispatch, useSelector } from '../../../redux/store';

import {
  getAbsensi,
  createAbsensi,
  updateAbsensi,
  resetAbsensi,
} from '../../../redux/slices/absensi';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries, roles } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

InputAbsensiForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAbsensi: PropTypes.object,
  menu: PropTypes.string,
};

const statusAbsensiOptions = [
  { id: 1, code: 'hadir', label: 'Hadir' },
  { id: 2, code: 'cuti', label: 'Cuti' },
  { id: 3, code: 'izin', label: 'Izin' },
  { id: 4, code: 'sakit', label: 'Sakit' },
];

export default function InputAbsensiForm({ currentData, menu, action }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const AbsensiSchema = Yup.object().shape({
    waktu_masuk: Yup.date().required('Waktu Masuk wajib diisi'),
    waktu_keluar: Yup.date().required('Waktu Keluar wajib diisi'),
    status_absensi: Yup.string().required('Status Absensi wajib dipilih'),
    keterangan_absensi: Yup.string()
  });

  const defaultValues = useMemo(
    () => ({
      id_absensi: currentData?.id_absensi || '',
      waktu_masuk: currentData?.waktu_masuk || new Date(),
      waktu_keluar: currentData?.waktu_keluar || new Date(),
      status_absensi: currentData?.status_absensi || '',
      keterangan_absensi: currentData?.keterangan_absensi || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(AbsensiSchema),
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

  const onSubmit = async (data) => {
    console.log('data submit',data)
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   reset();
    //   enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
    //   navigate(PATH_DASHBOARD.user.list);
    // } catch (error) {
    //   console.error(error);
    // }
    const dataAbsensi = {
      waktu_masuk: data.waktu_masuk,
      waktu_keluar: data.waktu_keluar,
      keterangan_absensi: data.keterangan_absensi,
      status_absensi: data.status_absensi,
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("ACTION",action)
    if (action === 'create') {
      dispatch(createAbsensi(dataAbsensi))
        .then((create) => {
          console.log(create);
          reset();
          dispatch(resetAbsensi());
          navigate(PATH_DASHBOARD.absensi.list);
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
      dispatch(updateAbsensi(data.id_absensi,dataAbsensi))
        .then((update) => {
          console.log(update);
          reset();
          dispatch(resetAbsensi());
          navigate(PATH_DASHBOARD.absensi.list);
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
    dispatch(resetAbsensi());
    if (currentData) {
      window.localStorage.removeItem('currentAbsensi');
    }
    window.localStorage.removeItem('action')
    await getAbsensi();
    navigate(PATH_DASHBOARD.absensi.list);
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

  const isDateError = isBefore(new Date(values.waktu_keluar), new Date(values.waktu_masuk));

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
              <Controller
                name="waktu_masuk"
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
                name="waktu_keluar"
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
            <Box sx={{ p: 1 }} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
              }}
            >
              <RHFTextField name="keterangan_absensi" label="Keterangan" multiline rows={4} />

              <RHFSelect name="status_absensi" label="Status Kehadiran" placeholder="Status PTKP">
                <option value="" />
                {statusAbsensiOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Box>
              <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                <Button variant="contained" color="inherit" onClick={handleBack}>
                  Kembali
                </Button>
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
