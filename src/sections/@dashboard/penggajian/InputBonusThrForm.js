import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, MobileDatePicker } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  TextField,
  Slider,
  InputAdornment,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';

import { useDispatch, useSelector } from '../../../redux/store';

import { getPenggajianDetail, updatePenggajianDetail, resetPenggajianDetail } from '../../../redux/slices/penggajian';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
// components
import Label from '../../../components/Label';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import LoadingScreen from '../../../components/LoadingScreen';

// ----------------------------------------------------------------------

InputBonusThrForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

const statusUser = [
  { id: 1, code: 'aktif', label: 'Aktif' },
  { id: 2, code: 'tidakAktif', label: 'Tidak Aktif' },
];

const statusPegawai = [
  { id: 1, code: 'tetap', label: 'Pegawai Tetap' },
  { id: 2, code: 'tidakTetap', label: 'Pegawai Tidak Tetap/Tenaga Kerja Lepas' },
];

const metodePajak = [
  { id: 1, code: 'nett', label: 'Nett' },
  { id: 2, code: 'gross', label: 'Gross' },
  { id: 3, code: 'grossup', label: 'Gross Up' },
];

const tarifPtkp = [
  {
    id: 1,
    kodePtkp: 'TK/0',
    besaranPtkp: 54000000,
    keteranganPtkp: 'Wajib Pajak Tidak Kawin Tanpa Tanggungan',
    statusPtkp: 'aktif',
  },
];

export default function InputBonusThrForm({ currentData, menu, action }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const NewUserSchema = Yup.object().shape({
    bonus_kinerja: Yup.number(),
    thr: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      bonus_kinerja: currentData?.bonus_kinerja || 0,
      thr: currentData?.thr || 0,
      id_penggajian_detail: currentData?.id_penggajian_detail || '',
      kode_penggajian: currentData?.kode_penggajian || '',
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
    getValues,
    handleSubmit,
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
  }, [currentData]);

  let msg = '';
  const failedMessage = 'Gagal Mengubah data';

  const onSubmit = async (data) => {
    console.log('data submit', data);
    const dataPenggajianDetail = {
      bonus_kinerja: data?.bonus_kinerja || 0,
      thr: data?.thr || 0,
      jenisUpdate: 'bonusThr',
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('ACTION', action);
    dispatch(updatePenggajianDetail(data.id_penggajian_detail, dataPenggajianDetail, data.kode_penggajian))
      .then((update) => {
        console.log(update);
        reset();
        dispatch(resetPenggajianDetail());
        navigate(PATH_DASHBOARD.penggajian.form);
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
  };

  const handleCloseModal = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  const handleBack = async () => {
    reset();
    dispatch(resetPenggajianDetail());
    if (currentData) {
      window.localStorage.removeItem('currentPenggajianDetail');
    }
    window.localStorage.setItem('action', 'update');
    await getPenggajianDetail(currentData.kode_penggajian);
    navigate(PATH_DASHBOARD.penggajian.form);
  };

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
                gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
              }}
            >
              <Typography variant="h5">Bonus/THR</Typography>

              <RHFTextField
                name="bonus_kinerja"
                label="Bonus Kinerja"
                placeholder="0.00"
                value={getValues('bonus_kinerja') <= 0 ? 0 : getValues('bonus_kinerja')}
                onChange={(event) => setValue('bonus_kinerja', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />

              <RHFTextField
                name="thr"
                label="THR"
                placeholder="0.00"
                value={getValues('thr') <= 0 ? 0 : getValues('thr')}
                onChange={(event) => setValue('thr', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />
            </Box>
            <Box sx={{ p: 1 }} />

            <Box>
              <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                <Button variant="contained" color="inherit" onClick={handleBack}>
                  Kembali
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {'Simpan'}
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
