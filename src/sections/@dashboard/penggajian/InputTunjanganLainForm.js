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

InputTunjanganLainForm.propTypes = {
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

export default function InputTunjanganLainForm({ currentData, menu, action }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const NewUserSchema = Yup.object().shape({
    tunjangan_lembur: Yup.number(),
    tunjangan_natura: Yup.number(),
    tunjangan_lain: Yup.number(),
    pinjaman: Yup.number(),
    ganti_rugi: Yup.number(),
    denda: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      bonus_bulan: currentData?.bonus_bulan || 0,
      tunjangan_lembur: currentData?.tunjangan_lembur || 0,
      tunjangan_natura: currentData?.tunjangan_natura || 0,
      tunjangan_lain: currentData?.tunjangan_lain || 0,
      pemotongan_bulan: currentData?.pemotongan_bulan || 0,
      pinjaman: currentData?.pinjaman || 0,
      ganti_rugi: currentData?.ganti_rugi || 0,
      denda: currentData?.denda || 0,
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
      bonus_bulan: data?.bonus_bulan || 0,
      tunjangan_lembur: data?.tunjangan_lembur || 0,
      tunjangan_natura: data?.tunjangan_natura || 0,
      tunjangan_lain: data?.tunjangan_lain || 0,
      pemotongan_bulan: data?.pemotongan_bulan || 0,
      pinjaman: data?.pinjaman || 0,
      ganti_rugi: data?.ganti_rugi || 0,
      denda: data?.denda || 0,
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
              <Typography variant="h5">Bonus</Typography>

              <RHFTextField
                name="bonus_bulan"
                label="Bonus"
                placeholder="0.00"
                value={getValues('bonus_bulan') <= 0 ? 0 : getValues('bonus_bulan')}
                onChange={(event) => setValue('bonus_bulan', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />

              <Typography variant="h5">Tunjangan Lain</Typography>

              <RHFTextField
                name="tunjangan_lembur"
                label="Tunjangan Lembur"
                placeholder="0.00"
                value={getValues('tunjangan_lembur') <= 0 ? 0 : getValues('tunjangan_lembur')}
                onChange={(event) => setValue('tunjangan_lembur', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />
              <RHFTextField
                name="tunjangan_natura"
                label="Tunjangan Natura"
                placeholder="0.00"
                value={getValues('tunjangan_natura') <= 0 ? 0 : getValues('tunjangan_natura')}
                onChange={(event) => setValue('tunjangan_natura', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />
              <RHFTextField
                name="tunjangan_lain"
                label="Tunjangan Lain"
                placeholder="0.00"
                value={getValues('tunjangan_lain') <= 0 ? 0 : getValues('tunjangan_lain')}
                onChange={(event) => setValue('tunjangan_lain', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />

              <Typography variant="h5">Pengurangan Lain</Typography>

              <RHFTextField
                name="pinjaman"
                label="Pinjaman"
                placeholder="0.00"
                value={getValues('pinjaman') <= 0 ? 0 : getValues('pinjaman')}
                onChange={(event) => setValue('pinjaman', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />
              <RHFTextField
                name="ganti_rugi"
                label="Ganti Rugi"
                placeholder="0.00"
                value={getValues('ganti_rugi') <= 0 ? 0 : getValues('ganti_rugi')}
                onChange={(event) => setValue('ganti_rugi', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />

              <RHFTextField
                name="denda"
                label="Denda"
                placeholder="0.00"
                value={getValues('denda') <= 0 ? 0 : getValues('denda')}
                onChange={(event) => setValue('denda', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />

              <RHFTextField
                name="pemotongan_bulan"
                label="Pengurangan Lain"
                placeholder="0.00"
                value={getValues('pemotongan_bulan') <= 0 ? 0 : getValues('pemotongan_bulan')}
                onChange={(event) => setValue('pemotongan_bulan', Number(event.target.value))}
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
