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

import {
  getGajiPokokTunjangan,
  updateGajiPokokTunjangan,
  resetGajiPokokTunjangan,
} from '../../../redux/slices/gajiPokokTunjangan';

import { getMasterTarifPtkpActive } from '../../../redux/slices/masterTarifPtkp';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries, roles } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { DialogAnimate } from '../../../components/animate';
import LoadingScreen from '../../../components/LoadingScreen';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

InputGajiPokokTunjanganForm.propTypes = {
  action: PropTypes.string,
  currentData: PropTypes.object,
};

const jenisTunjanganTranspor = [
  { id: 1, code: 'harian', label: 'Harian' },
  { id: 2, code: 'bulanan', label: 'Bulanan' },
];

const statusPegawai = [
  { id: 1, code: 'tetap', label: 'Pegawai Tetap' },
  { id: 2, code: 'tidak_tetap', label: 'Pegawai Tidak Tetap/Tenaga Kerja Lepas' },
];

const metodePajak = [
  { id: 1, code: 'nett', label: 'Nett' },
  { id: 2, code: 'gross', label: 'Gross' },
  { id: 3, code: 'grossup', label: 'Gross Up' },
];

export default function InputGajiPokokTunjanganForm({ currentData, action }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { masterTarifPtkp } = useSelector((state) => state.masterTarifPtkp);
  let masterTarifPtkpList = [];
  try {
    masterTarifPtkpList = masterTarifPtkp?.data;
  } catch (e) {
    console.log(e);
  }
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getMasterTarifPtkpActive());
    } catch (e) {
      console.log('ERROR', e);
    }
    setLoading(false);
  }, [dispatch]);
  const { enqueueSnackbar } = useSnackbar();
  const [tarifPtkpList, setTarifPtkpList] = useState([]);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const NewUserSchema = Yup.object().shape({
    jenis_pegawai: Yup.string().required('Jenis pegawai wajib dipilih'),
    metode_pajak: Yup.string().required('Metode pajak wajib dipilih'),
    gaji_pokok: Yup.number().required('Gaji pokok wajib diisi'),
    id_tarifptkp: Yup.string().required('Tarif PTKP wajib dipilih'),
    tunjangan_transpor_makan: Yup.number(),
    jenis_transpor_makan: Yup.string().when('tunjangan_transpor_makan', {
      is: true,
      then: Yup.string().required('Jenis Tunjangan Transportasi dan Makan wajib dipilih'),
    }),
    tunjangan_natura: Yup.number().required('Tunjangan Natura wajib diisi'),
    tunjangan_bpjs_jht: Yup.number().required('Tunjangan BPJS-TK Jaminan Hari Tua diisi'),
    tunjangan_bpjs_jp: Yup.number().required('Tunjangan BPJS-TK Jaminan Pensiun wajib diisi'),
    tunjangan_bpjs_jkk: Yup.number().required('Tunjangan BPJS-TK Jaminan Kecelakaan Kerja diisi'),
    tunjangan_bpjs_jkm: Yup.number().required('Tunjangan BPJS-TK Jaminan Kematian diisi'),
    tunjangan_bpjs_kes: Yup.number().required('Tunjangan BPJS Kesehatan diisi'),
    tunjangan_lain: Yup.number().required('Tunjangan Lain'),
  });

  const defaultValues = useMemo(
    () => ({
      status_perkawinan: currentData?.status_perkawinan || '',
      nama_status_perkawinan: currentData?.nama_status_perkawinan || '',
      jumlah_anak: currentData?.jumlah_anak || '',
      no_ktp: currentData?.no_ktp || '',
      no_npwp: currentData?.no_npwp || '',
      id_gajipokok_tunjangan: currentData?.id_gajipokok_tunjangan || '',
      nip: currentData?.nip || '',
      nama_lengkap: currentData?.nama_lengkap || '',
      nama_bagian: currentData?.nama_bagian || '',
      nama_jabatan: currentData?.nama_jabatan || '',
      kode_tarifptkp: currentData?.kode_tarifptkp || '',
      besaran: currentData?.besaran || '',
      jenis_pegawai: currentData?.jenis_pegawai || '',
      metode_pajak: currentData?.metode_pajak || '',
      gaji_pokok: currentData?.gaji_pokok || 0,
      id_tarifptkp: currentData?.id_tarifptkp || '',
      tunjangan_transpor_makan: currentData?.tunjangan_transpor_makan || 0,
      jenis_transpor_makan: currentData?.jenis_transpor_makan || '',
      tunjangan_natura: currentData?.tunjangan_natura || 0,
      tunjangan_bpjs_jht: currentData?.tunjangan_bpjs_jht || 0,
      tunjangan_bpjs_jp: currentData?.tunjangan_bpjs_jp || 0,
      tunjangan_bpjs_jkm: currentData?.tunjangan_bpjs_jkm || 0,
      tunjangan_bpjs_jkk: currentData?.tunjangan_bpjs_jkk || 0,
      tunjangan_bpjs_kes: currentData?.tunjangan_bpjs_kes || 0,
      tunjangan_lain: currentData?.tunjangan_lain || 0,
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
      const a = JSON.parse(window.localStorage.getItem('masterTarifPtkpList'));
      setTarifPtkpList(a);
    }
    if (!currentData) {
      reset(defaultValues);
      const a = JSON.parse(window.localStorage.getItem('masterTarifPtkpList'));
      setTarifPtkpList(a);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData]);

  let msg = '';
  const failedMessage = 'Gagal Mengubah Data';
  const onSubmit = async (data) => {
    console.log('jalan');
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('ACTION', action);

    dispatch(updateGajiPokokTunjangan(data.id_gajipokok_tunjangan, data))
      .then((update) => {
        console.log(update);
        if (update.payload.success) {
          reset();
          dispatch(resetGajiPokokTunjangan());
          navigate(PATH_DASHBOARD.gajiPokokTunjangan.list);
        } else {
          msg = 'Gagal mengubah data. Pegawai belum melengkapi Data Induk';
          setMessage(msg);
          setOpen(true);
          handleCloseModal();
        }
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

  const handleBack = async () => {
    reset();
    dispatch(resetGajiPokokTunjangan());
    if (currentData) {
      window.localStorage.removeItem('currentGajiPokokTunjangan');
    }
    window.localStorage.removeItem('action');
    await getGajiPokokTunjangan();
    navigate(PATH_DASHBOARD.gajiPokokTunjangan.list);
  };

  const currency = (val) => {
    const round = Math.round(val);
    const format = round.toString().split('').reverse().join('');
    const convert = format.match(/\d{1,3}/g);
    const rupiah = convert.join('.').split('').reverse().join('');
    const besaran = `Rp ${rupiah}`;

    return besaran;
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
              <RHFTextField name="nama_lengkap" label="Nama Pegawai" disabled />
              <RHFTextField name="nip" label="NIP" disabled />
              <RHFTextField name="nama_bagian" label="Bagian" disabled />
              <RHFTextField name="nama_jabatan" label="Jabatan" disabled />
              <RHFTextField name="no_npwp" label="No.NPWP" disabled />
              <RHFTextField name="no_ktp" label="No. KTP" disabled />
              <RHFTextField name="nama_status_perkawinan" label="Status Perkawinan" disabled />
              <RHFTextField name="jumlah_anak" label="Jumlah Anak" disabled />
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
              <RHFSelect name="jenis_pegawai" label="Jenis Pegawai" placeholder="Status Pegawai">
                <option value="" />
                {statusPegawai.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect name="metode_pajak" label="Metode Pajak" placeholder="Metode Pajak">
                <option value="" />
                {metodePajak.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField
                name="gaji_pokok"
                label="Gaji Pokok"
                placeholder="0.00"
                value={getValues('gaji_pokok') <= 0 ? 0 : getValues('gaji_pokok')}
                onChange={(event) => setValue('gaji_pokok', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />
              <RHFSelect name="id_tarifptkp" label="Tarif PTKP" placeholder="Tarif PTKP">
                <option value="" />
                {masterTarifPtkpList?.map((option) => (
                  <option key={option.id_tarifptkp} value={option.id_tarifptkp}>
                    {option.kode_tarifptkp} - {currency(option.besaran_tarifptkp)}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField
                name="tunjangan_transpor_makan"
                label="Tunjangan Transportasi dan Makan"
                placeholder="0.00"
                value={getValues('tunjangan_transpor_makan') <= 0 ? 0 : getValues('tunjangan_transpor_makan')}
                onChange={(event) => setValue('tunjangan_transpor_makan', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />
              {getValues('tunjangan_transpor_makan') > 0 && (
                <RHFSelect
                  name="jenis_transpor_makan"
                  label="Jenis Tunjangan Transportasi dan Makan"
                  placeholder="Jenis Tunjangan Transportasi dan Makan"
                >
                  <option value="" />
                  {jenisTunjanganTranspor.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
              )}
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
                name="tunjangan_bpjs_jht"
                label="Tunjangan BPJS-TK Jaminan Hari Tua"
                placeholder="0.00"
                value={getValues('tunjangan_bpjs_jht') <= 0 ? 0 : getValues('tunjangan_bpjs_jht')}
                onChange={(event) => setValue('tunjangan_bpjs_jht', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />
              <RHFTextField
                name="tunjangan_bpjs_jp"
                label="Tunjangan BPJS-TK Jaminan Pensiun"
                placeholder="0.00"
                value={getValues('tunjangan_bpjs_jp') <= 0 ? 0 : getValues('tunjangan_bpjs_jp')}
                onChange={(event) => setValue('tunjangan_bpjs_jp', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />
              <RHFTextField
                name="tunjangan_bpjs_jkm"
                label="Tunjangan BPJS-TK Jaminan Kematian"
                placeholder="0.00"
                value={getValues('tunjangan_bpjs_jkm') <= 0 ? 0 : getValues('tunjangan_bpjs_jkm')}
                onChange={(event) => setValue('tunjangan_bpjs_jkm', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />
              <RHFTextField
                name="tunjangan_bpjs_jkk"
                label="Tunjangan BPJS-TK Jaminan Kecelekaan Kerja"
                placeholder="0.00"
                value={getValues('tunjangan_bpjs_jkk') <= 0 ? 0 : getValues('tunjangan_bpjs_jkk')}
                onChange={(event) => setValue('tunjangan_bpjs_jkk', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />
              <RHFTextField
                name="tunjangan_bpjs_kes"
                label="Tunjangan BPJS Kesehatan"
                placeholder="0.00"
                value={getValues('tunjangan_bpjs_kes') <= 0 ? 0 : getValues('tunjangan_bpjs_kes')}
                onChange={(event) => setValue('tunjangan_bpjs_kes', Number(event.target.value))}
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
