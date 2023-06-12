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
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import { useDispatch, useSelector } from '../../../redux/store';
import { updatePegawai, getDataInduk, resetPegawai } from '../../../redux/slices/pegawai';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { bank, agama, jenisKelamin, statusPerkawinan } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

InputDataIndukForm.propTypes = {
  action: PropTypes.string,
  currentData: PropTypes.object,
};

export default function InputDataIndukForm({ currentData, action }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  const NewUserSchema = Yup.object().shape({
    tempat_lahir: Yup.string().required('Tempat lahir wajib diisi'),
    tanggal_lahir: Yup.date().required('Tanggal lahir wajib diisi'),
    no_ktp: Yup.string().required('No. KTP wajib diisi'),
    jenis_kelamin: Yup.string().required('Jenis kelamin wajib dipilih'),
    agama: Yup.string().required('Agama wajib dipilih'),
    no_hp: Yup.string().required('No. HP wajib diisi'),
    no_telp: Yup.string().required('No. Telepon wajib diisi'),
    alamat: Yup.string().required('Alamat wajib diisi'),
    status_perkawinan: Yup.string().required('Status perkawinan wajib dipilih'),
    jumlah_anak: Yup.string().required('Jumlah anak wajib diisi'),
    bank: Yup.string().required('Bank wajib dipilih'),
    no_rek: Yup.string().required('No. Rekening wajib diisi'),
    no_npwp: Yup.string().required('No. NPWP wajib diisi'),
    no_bpjs_ket: Yup.string().required('No. BPJS Ketenagakerjaan wajib diisi'),
    no_bpjs_kes: Yup.string().required('No. BPJS Kesehatan wajib diisi'),
    riwayat_pendidikan: Yup.string().required('Riwayat Pendidikan wajib diisi'),
    riwayat_pekerjaan: Yup.string().required('Riwayat Pekerjaan wajib diisi'),
  });

  const defaultValues = useMemo(
    () => ({
      nama_lengkap: currentData?.nama_lengkap || '',
      nama_jabatan: currentData?.nama_jabatan || '',
      nama_bagian: currentData?.nama_bagian || '',
      email: currentData?.email || '',
      nip: currentData?.nip || '',
      id_user: currentData?.id_user || '',
      tempat_lahir: currentData?.tempat_lahir || '',
      tanggal_lahir: currentData?.tanggal_lahir || null,
      no_ktp: currentData?.no_ktp || '',
      jenis_kelamin: currentData?.jenis_kelamin || '',
      agama: currentData?.agama || '',
      no_hp: currentData?.no_hp || '',
      no_telp: currentData?.no_telp || '',
      alamat: currentData?.alamat || '',
      status_perkawinan: currentData?.status_perkawinan || '',
      jumlah_anak: currentData?.jumlah_anak || '',
      bank: currentData?.bank || '',
      no_rek: currentData?.no_rek || '',
      no_npwp: currentData?.no_npwp || '',
      no_bpjs_ket: currentData?.no_bpjs_ket || '',
      no_bpjs_kes: currentData?.no_bpjs_kes || '',
      riwayat_pendidikan: currentData?.riwayat_pendidikan || '',
      riwayat_pekerjaan: currentData?.riwayat_pekerjaan || '',
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
  const failedMessage = 'Gagal mengubah data';

  const onSubmit = async (data) => {
    console.log('SUBMIT DATA', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    dispatch(updatePegawai(data.nip, data))
      .then((update) => {
        console.log(update);
        window.localStorage.setItem('dataInduk', JSON.stringify(update));
        reset();
        dispatch(resetPegawai());
        dispatch(getDataInduk());
        enqueueSnackbar('Berhasil mengubah data');
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
              }}
            >
              <RHFTextField name="nama_lengkap" label="Nama Lengkap" disabled />
              <RHFTextField name="email" label="Email" disabled />
              <RHFTextField name="nip" label="NIP" disabled />
            </Box>
            <Box sx={{ p: 1 }} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="nama_bagian" label="Bagian" disabled />
              <RHFTextField name="nama_jabatan" label="Jabatan" disabled />
              <RHFTextField name="tempat_lahir" label="Tempat Lahir" />
              <Controller
                name="tanggal_lahir"
                control={control}
                render={({ field }) => (
                  <MobileDatePicker
                    {...field}
                    label="Tanggal Lahir"
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => <TextField {...params} fullWidth />}
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
              <RHFTextField name="no_ktp" label="No. KTP" />
            </Box>
            <Box sx={{ p: 1 }} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFSelect name="jenis_kelamin" label="Jenis Kelamin" placeholder="Jenis Kelamin">
                <option value="" />
                {jenisKelamin.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect name="agama" label="Agama" placeholder="Agama">
                <option value="" />
                {agama.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="no_hp" label="No. HP" />
              <RHFTextField name="no_telp" label="No. Telepon" />
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
              <RHFTextField name="alamat" label="Alamat" multiline rows={2} />
            </Box>
            <Box sx={{ p: 1 }} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFSelect name="status_perkawinan" label="Status Perkawinan" placeholder="Status Perkawinan">
                <option value="" />
                {statusPerkawinan.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="jumlah_anak" label="Jumlah Anak" />
              <RHFSelect name="bank" label="Bank" placeholder="Bank">
                <option value="" />
                {bank.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="no_rek" label="No. Rekening" />
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
              <RHFTextField name="no_npwp" label="No.NPWP" />
            </Box>
            <Box sx={{ p: 1 }} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="no_bpjs_ket" label="No.BPJS Ketenagakerjaan" />
              <RHFTextField name="no_bpjs_kes" label="No.BPJS Kesehatan" />
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
              <RHFTextField name="riwayat_pendidikan" label="Riwayat Pendidikan" multiline rows={4} />
              <RHFTextField name="riwayat_pekerjaan" label="Riwayat Pekerjaan" multiline rows={4} />
            </Box>
            <Box sx={{ p: 1 }} />
            <Box>
              <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                <Box />
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
