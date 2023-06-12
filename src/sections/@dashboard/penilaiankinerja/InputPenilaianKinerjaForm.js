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
  DialogActions,
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import { useDispatch, useSelector } from '../../../redux/store';

import {
  getPenilaianKinerja,
  createPenilaianKinerja,
  getBawahan,
  resetPenilaianKinerja,
} from '../../../redux/slices/penilaianKinerja';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
// components
import LoadingScreen from '../../../components/LoadingScreen';
import { DialogAnimate } from '../../../components/animate';
import {
  FormProvider,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFRadioGroup,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

InputPenilaianKinerjaForm.propTypes = {
  action: PropTypes.string,
  currentData: PropTypes.object,
  menu: PropTypes.string,
};

const nilai = ['Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];

export default function InputPenilaianKinerjaForm({ currentData, menu, action }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // const [bawahan, setBawahan] = useState(JSON.parse(window.localStorage.getItem('bawahanList')));
  // const [bagian, setBagian] = useState(JSON.parse(window.localStorage.getItem('bagianBawahanList')));
  // const [jabatan, setJabatan] = useState(JSON.parse(window.localStorage.getItem('jabatanBawahanList')));
  const [struktur, setStruktur] = useState([]);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const { bawahan } = useSelector((state) => state.penilaianKinerja);
  let bagian = [];
  let jabatan = [];
  let pegawai = [];
  try {
    bagian = bawahan?.bagian;
    jabatan = bawahan?.jabatan;
    pegawai = bawahan?.data;
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getBawahan());
    } catch (e) {
      console.log('ERROR', e);
    }
    setLoading(false);
  }, [dispatch]);

  const NewUserSchema = Yup.object().shape({
    id_bagian: Yup.string().required('Bagian wajib dipilih'),
    id_jabatan: Yup.string().required('Jabatan wajib dipilih'),
    nip: Yup.string().required('Nama wajib Dipilih'),
    waktu_penilaian: Yup.date().required('Waktu Penilaian wajib diisi'),
    efektifitas: Yup.string().required('Penilaian Efektifitas dan Efisiensi Kerja wajib diisi'),
    kecepatan: Yup.string().required('Penilaian Kecepatan waktu dalam menyelesaikan tugas wajib diisi'),
    target: Yup.string().required('Penilaian Kemampuan mencapai target/standar perusahaan wajib diisi'),
    tertib_adm: Yup.string().required('Penilaian Tertib Administrasi wajib diisi'),
    inisiatif: Yup.string().required('Penilaian Inisiatif wajib diisi'),
    kerjasama: Yup.string().required('Penilaian Kerjasama dan koordinasi antar bagian wajib diisi'),
    perilaku: Yup.string().required('Penilaian Perilaku wajib diisi'),
    kedisiplinan: Yup.string().required('Penilaian Kedisiplinan wajib diisi'),
    tanggung_jawab: Yup.string().required('Penilaian Tanggung Jawab wajib diisi'),
    ketaatan: Yup.string().required('Penilaian wajib diisi'),
    prestasi: Yup.string(),
    indisipliner: Yup.string(),
    saran: Yup.string().required('Saran wajib diisi'),
    bonus: Yup.number(),
    pemotongan: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      id_bagian: currentData?.id_bagian || '',
      id_jabatan: currentData?.id_jabatan || '',
      nip: currentData?.nip || '',
      waktu_penilaian: currentData?.waktu_penilaian || new Date(),
      efektifitas: currentData?.efektifitas || '',
      kecepatan: currentData?.kecepatan || '',
      target: currentData?.target || '',
      tertib_adm: currentData?.tertib_adm || '',
      inisiatif: currentData?.inisiatif || '',
      kerjasama: currentData?.kerjasama || '',
      perilaku: currentData?.perilaku || '',
      kedisiplinan: currentData?.kedisiplinan || '',
      tanggung_jawab: currentData?.tanggung_jawab || '',
      ketaatan: currentData?.ketaatan || '',
      prestasi: currentData?.prestasi || '',
      indisipliner: currentData?.indisipliner || '',
      saran: currentData?.saran || '',
      bonus: currentData?.bonus || 0,
      pemotongan: currentData?.pemotongan || 0,
      nama_lengkap: currentData?.nama_lengkap || '',
      nama_bagian: currentData?.nama_bagian || '',
      nama_jabatan: currentData?.nama_jabatan || '',
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
  }, [currentData, menu]);

  // let pegawaiOption = [];
  let strukturOption = [];

  const idBagian = values.id_bagian;

  console.log(idBagian);

  useEffect(() => {
    if (action === 'create') {
      setStruktur([]);
      setPegawaiList([]);
      try {
        strukturOption = jabatan?.filter((x) => parseInt(x.id_bagian, 10) === parseInt(idBagian, 10));
        console.log(strukturOption);
        // setValue('id_bagian', idBagian);
        setStruktur(strukturOption);
      } catch (error) {
        console.error(error);
      }
    }
  }, [idBagian]);

  let pegawaiOption = [];

  const idJabatan = values.id_jabatan;

  useEffect(() => {
    if (action === 'create') {
      setPegawaiList([]);
      try {
        pegawaiOption = pegawai?.filter((x) => parseInt(x.id_jabatan, 10) === parseInt(idJabatan, 10));
        console.log(pegawaiOption);
        setPegawaiList(pegawaiOption);
      } catch (error) {
        console.error(error);
      }
    }
  }, [idJabatan]);

  let msg = '';
  const failedMessage = 'Gagal menambah data';

  const onSubmit = async () => {
    console.log('jalan');
    console.log(values);
    const dataPenilaianKinerja = {
      id_bagian: values?.id_bagian || '',
      id_jabatan: values?.id_jabatan || '',
      nip: values?.nip || '',
      waktu_penilaian: values?.waktu_penilaian || '',
      efektifitas: values?.efektifitas || '',
      kecepatan: values?.kecepatan || '',
      target: values?.target || '',
      tertib_adm: values?.tertib_adm || '',
      inisiatif: values?.inisiatif || '',
      kerjasama: values?.kerjasama || '',
      perilaku: values?.perilaku || '',
      kedisiplinan: values?.kedisiplinan || '',
      tanggung_jawab: values?.tanggung_jawab || '',
      ketaatan: values?.ketaatan || '',
      prestasi: values?.prestasi || '',
      indisipliner: values?.indisipliner || '',
      saran: values?.saran || '',
      bonus: values?.bonus || 0,
      pemotongan: values?.pemotongan || 0,
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('ACTION', action);
    if (action === 'create') {
      dispatch(createPenilaianKinerja(dataPenilaianKinerja))
        .then((create) => {
          if (create.payload.success) {
            console.log(create);
            reset();
            dispatch(resetPenilaianKinerja());
            handleCloseConfirm();
            navigate(PATH_DASHBOARD.penilaianKinerja.list);
          } else {
            msg = create.payload.message;
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
    }
  };

  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const handleCloseModal = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setOpen(false);
    handleCloseConfirm();
  };

  const handleBack = async () => {
    reset();
    dispatch(resetPenilaianKinerja());
    if (currentData) {
      window.localStorage.removeItem('currentPenilaianKinerja');
    }
    window.localStorage.removeItem('action');
    await getPenilaianKinerja();
    navigate(PATH_DASHBOARD.penilaianKinerja.list);
  };

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            {/* <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
              }}
            >
              <RHFTextField name="namaLengkap" label="Nama Lengkap" disabled />
              <RHFTextField name="email" label="Email" disabled />
              <RHFTextField name="nip" label="NIP" disabled />
            </Box>
            <Box sx={{ p: 1 }} /> */}
            {action === 'create' ? (
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFSelect name="id_bagian" label="Bagian" placeholder="Bagian">
                  <option value="" />
                  {bagian?.map((option) => (
                    <option key={option.id_bagian} value={option.id_bagian}>
                      {option.nama_bagian}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect name="id_jabatan" label="Jabatan" placeholder="Jabatan">
                  <option value="" />
                  {struktur?.map((option) => (
                    <option key={option.id_jabatan} value={option.id_jabatan}>
                      {option.nama_jabatan}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect name="nip" label="Nama Pegawai" placeholder="Nama Pegawai">
                  <option value="" />
                  {pegawaiList?.map((option) => (
                    <option key={option.nip} value={option.nip}>
                      {option.nama_lengkap}
                    </option>
                  ))}
                </RHFSelect>
                <RHFTextField name="nip" label="NIP" disabled />
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
                <RHFTextField name="nama_bagian" label="Bagian" disabled />
                <RHFTextField name="nama_jabatan" label="Jabatan" disabled />
                <RHFTextField name="nama_lengkap" label="Nama Pegawai" disabled />
                <RHFTextField name="nip" label="NIP" disabled />
              </Box>
            )}
            <Box sx={{ p: 1 }} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
              }}
            >
              {action === 'create' ? (
                <Controller
                  name="waktu_penilaian"
                  control={control}
                  disabled={action === 'view'}
                  render={({ field }) => (
                    <MobileDatePicker
                      {...field}
                      label="Waktu Penilaian"
                      inputFormat="dd/MM/yyyy"
                      views={['day', 'month', 'year']}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  )}
                />
              ) : (
                <RHFTextField name="waktu_penilaian" label="Periode Penilaian" disabled />
              )}
              <Typography variant="h5">A. Teknis Pekerjaan</Typography>
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
              <Typography variant="subtitle1">1. Efektifitas dan Efisiensi Kerja</Typography>
              {action === 'create' ? (
                <RHFRadioGroup
                  name="efektifitas"
                  options={nilai}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                />
              ) : (
                <RHFTextField
                  name="efektifitas"
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                  disabled
                />
              )}
              <Typography variant="subtitle1">2. Kecepatan waktu dalam menyelesaikan tugas</Typography>
              {action === 'create' ? (
                <RHFRadioGroup
                  name="kecepatan"
                  options={nilai}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                />
              ) : (
                <RHFTextField
                  name="kecepatan"
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                  disabled
                />
              )}
              <Typography variant="subtitle1">3. Kemampuan mencapai target/standar perusahaan</Typography>
              {action === 'create' ? (
                <RHFRadioGroup
                  name="target"
                  options={nilai}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                />
              ) : (
                <RHFTextField
                  name="target"
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                  disabled
                />
              )}
            </Box>
            <Box sx={{ p: 1 }} />
            <Typography variant="h5">B. Non-Teknis</Typography>
            <Box sx={{ p: 1 }} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Typography variant="subtitle1">1. Tertib Administrasi</Typography>
              {action === 'create' ? (
                <RHFRadioGroup
                  name="tertib_adm"
                  options={nilai}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                />
              ) : (
                <RHFTextField
                  name="tertib_adm"
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                  disabled
                />
              )}
              <Typography variant="subtitle1">2. Inisiatif</Typography>
              {action === 'create' ? (
                <RHFRadioGroup
                  name="inisiatif"
                  options={nilai}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                />
              ) : (
                <RHFTextField
                  name="inisiatif"
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                  disabled
                />
              )}
              <Typography variant="subtitle1">3. Kerjasama dan koordinasi antar bagian</Typography>
              {action === 'create' ? (
                <RHFRadioGroup
                  name="kerjasama"
                  options={nilai}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                />
              ) : (
                <RHFTextField
                  name="kerjasama"
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                  disabled
                />
              )}
            </Box>
            <Box sx={{ p: 1 }} />
            <Typography variant="h5">C. Kepribadian</Typography>
            <Box sx={{ p: 1 }} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Typography variant="subtitle1">1. Perilaku</Typography>
              {action === 'create' ? (
                <RHFRadioGroup
                  name="perilaku"
                  options={nilai}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                />
              ) : (
                <RHFTextField
                  name="perilaku"
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                  disabled
                />
              )}
              <Typography variant="subtitle1">2. Kedisiplinan</Typography>
              {action === 'create' ? (
                <RHFRadioGroup
                  name="kedisiplinan"
                  options={nilai}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                />
              ) : (
                <RHFTextField
                  name="kedisiplinan"
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                  disabled
                />
              )}
              <Typography variant="subtitle1">3. Tanggung jawab dan loyalitas</Typography>
              {action === 'create' ? (
                <RHFRadioGroup
                  name="tanggung_jawab"
                  options={nilai}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                />
              ) : (
                <RHFTextField
                  name="tanggung_jawab"
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                  disabled
                />
              )}
              <Typography variant="subtitle1">4. Ketaatan terhadap instruksi kerja atasan</Typography>
              {action === 'create' ? (
                <RHFRadioGroup
                  name="ketaatan"
                  options={nilai}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                />
              ) : (
                <RHFTextField
                  name="ketaatan"
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 3 },
                  }}
                  disabled
                />
              )}
              <Box sx={{ p: 1 }} />
              <Box sx={{ p: 1 }} />
              <Typography variant="subtitle1">Prestasi lain yang perlu dicatat</Typography>
              <RHFTextField
                name="prestasi"
                label="Prestasi lain yang perlu dictatat"
                multiline
                rows={4}
                disabled={action === 'view'}
              />

              <Typography variant="subtitle1">Indisipliner yang perlu dicatat</Typography>
              <RHFTextField
                name="indisipliner"
                label="Indisipliner yang perlu dicatat"
                multiline
                rows={4}
                disabled={action === 'view'}
              />

              <Typography variant="subtitle1">Saran dan Perbaikan</Typography>
              <RHFTextField name="saran" label="Saran dan Perbaikan" multiline rows={4} disabled={action === 'view'} />
            </Box>
            <Box sx={{ p: 1 }} />
            <Typography variant="h5">Bonus/Pengurangan</Typography>
            <Box sx={{ p: 1 }} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Typography variant="subtitle1">Bonus</Typography>

              <RHFTextField
                disabled={action === 'view'}
                name="bonus"
                label="Bonus"
                placeholder="0.00"
                value={getValues('bonus') === 0 ? 0 : getValues('bonus')}
                onChange={(event) => setValue('bonus', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />
              <Typography variant="subtitle1">Pengurangan</Typography>

              <RHFTextField
                disabled={action === 'view'}
                name="pemotongan"
                label="Pemotongan"
                placeholder="0.00"
                value={getValues('pemotongan') === 0 ? 0 : getValues('pemotongan')}
                onChange={(event) => setValue('pemotongan', Number(event.target.value))}
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
                {action === 'create' && (
                  <LoadingButton variant="contained" onClick={handleOpenConfirm}>
                    {'Simpan'}
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
