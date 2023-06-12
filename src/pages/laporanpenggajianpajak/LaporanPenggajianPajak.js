import * as Yup from 'yup';
import { useState, useMemo, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { LoadingButton, MobileDatePicker } from '@mui/lab';
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Grid,
  Box,
  Stack,
  TextField,
  Paper,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useDispatch, useSelector } from '../../redux/store';
import { getMasterBagianActive } from '../../redux/slices/masterBagian';
import { getMasterJabatanActive } from '../../redux/slices/masterJabatan';
import { getLaporan, getPegawaiByJabatan } from '../../redux/slices/laporan';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { DialogAnimate } from '../../components/animate';
import LoadingScreen from '../../components/LoadingScreen';
import { FormProvider, RHFSelect, RHFTextField } from '../../components/hook-form';

import LaporanPegawaiPerTahun from './LaporanPegawaiPerTahun';
import LaporanAllPerBulan from './LaporanAllPerBulan';
import LaporanAllPerTahun from './LaporanAllPerTahun';
import LaporanPegawaiPerTahunPdf from './LaporanPegawaiPerTahunPdf';
import LaporanAllPerBulanPdf from './LaporanAllPerBulanPdf';
import LaporanAllPerTahunPdf from './LaporanAllPerTahunPdf';
// ----------------------------------------------------------------------

const statusBagian = [
  { id: 1, code: 'aktif', label: 'Aktif' },
  { id: 2, code: 'tidakAktif', label: 'Tidak Aktif' },
];

const jenisLaporan = [
  { id: 1, code: 'laporanPerPegawai', label: 'Laporan Per Pegawai (Setahun)' },
  { id: 2, code: 'laporanSeluruhPegawaiSebulan', label: 'Laporan Seluruh Pegawai (Sebulan)' },
  { id: 3, code: 'laporanSeluruhPegawaiSetahun', label: 'Laporan Seluruh Pegawai (Setahun)' },
];

export default function LaporanPenggajianPajak() {
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState(false);
  const [jabatanOption, setJabatanOption] = useState([]);
  const [pegawaiOption, setPegawaiOption] = useState([]);
  const [dataLaporan, setDataLaporan] = useState([]);
  const [jenisLaporanSubmitted, setJenisLaporanSubmitted] = useState('');
  const [disableForm, setDisableForm] = useState(false);
  const [labelJenisLaporan, setLabelJenisLaporan] = useState('');
  const [labelWaktu, setLabelWaktu] = useState('');
  const [labelBagian, setLabelBagian] = useState('');
  const [labelJabatan, setLabelJabatan] = useState('');
  const [labelNip, setLabelNip] = useState('');
  const [labelNama, setLabelNama] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // let msg = '';

  const dispatch = useDispatch();

  const { masterJabatan } = useSelector((state) => state.masterJabatan);
  let masterJabatanList = [];
  try {
    masterJabatanList = masterJabatan?.data;
  } catch (e) {
    console.log(e);
  }

  const { masterBagian } = useSelector((state) => state.masterBagian);
  let masterBagianList = [];
  try {
    masterBagianList = masterBagian?.data;
  } catch (e) {
    console.log(e);
  }
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getMasterBagianActive());
    } catch (e) {
      console.log('ERROR', e);
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getMasterJabatanActive());
    } catch (e) {
      console.log('ERROR', e);
    }
    setLoading(false);
  }, [dispatch]);

  const LaporanSchema = Yup.object().shape({
    jenis_laporan: Yup.string().required('Jenis Laporan wajib dipilih'),
    waktu: Yup.date().when('jenis_laporan', {
      is: true,
      then: Yup.date().required('Waktu wajib dipilih'),
    }),
    id_bagian: Yup.string().when('jenis_laporan', {
      is: (a) => a === 'laporanPerPegawai',
      then: Yup.string().required('Bagian wajib dipilih'),
    }),
    id_jabatan: Yup.string().when('jenis_laporan', {
      is: (a) => a === 'laporanPerPegawai',
      then: Yup.string().required('Jabatan wajib dipilih'),
    }),
    nip: Yup.string().when('jenis_laporan', {
      is: (a) => a === 'laporanPerPegawai',
      then: Yup.string().required('Pegawai wajib dipilih'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      jenis_laporan: '',
      waktu: new Date(),
      id_bagian: '',
      id_jabatan: '',
      nip: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(LaporanSchema),
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
    reset(defaultValues);
  }, []);

  const idBagian = values.id_bagian;

  console.log(idBagian);

  let strukturOption = [];

  useEffect(() => {
    setFilter(false);
    try {
      setJabatanOption([]);
      console.log(masterJabatanList);
      strukturOption = masterJabatanList?.filter((x) => parseInt(x.id_bagian, 10) === parseInt(idBagian, 10));
      console.log(strukturOption);
      setJabatanOption(strukturOption);
    } catch (e) {
      console.log('error', e);
    }
  }, [idBagian]);

  const idJabatan = values.id_jabatan;

  console.log(idJabatan);

  // let pegawaiOption = [];

  useEffect(() => {
    setPegawaiOption([]);
    setFilter(false);
    const reqIdJabatan = {
      id_jabatan: parseInt(idJabatan, 10),
    };

    try {
      dispatch(getPegawaiByJabatan(reqIdJabatan)).then((data) => {
        console.log(data);
        setPegawaiOption(data?.payload.data);
      });
    } catch (e) {
      console.log('error', e);
    }
  }, [idJabatan]);

  const idLaporan = values.jenis_laporan;

  const onFilter = () => {
    try {
      setFilter(false);
      setTimeout(() => {
        setFilter(true);
      }, 500);

      console.log('LINE 167', filter);
    } catch (error) {
      console.error(error);
    }
  };

  const onReset = () => {
    reset();
    setDisableForm(false);
    setNotFound(false);
    setFilter(false);
    setDataLaporan([]);
    setJenisLaporanSubmitted('');
  };
  const onSubmit = () => {
    let laporan = [];
    let jls = '';
    let payload = [];
    console.log(values);
    const reqLaporan = {
      jenis_laporan: values.jenis_laporan,
      waktu: values.waktu,
      nip: values?.nip || '',
    };
    dispatch(getLaporan(reqLaporan))
      .then((data) => {
        console.log(data);
        payload = data?.payload;
        laporan = payload?.data;
        jls = payload?.jenis_laporan;
        console.log(laporan);
        console.log(jls);
        setDataLaporan(laporan);
        setJenisLaporanSubmitted(jls);
        setDisableForm(true);
        setLabelBagian(payload?.nama_bagian || '');
        setLabelJabatan(payload?.nama_jabatan || '');
        setLabelNama(payload?.nama_jabatan || '');
        setLabelNip(payload?.nip || '');
        setLabelJenisLaporan(payload?.nama_jenis_laporan || '');
        setLabelWaktu(payload?.waktu || '');
        setTimeout(() => {
          onFilter();
        }, 500);
      })
      .catch((e) => {
        console.log('error', e);
      });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title={'Laporan Penggajian & Pajak'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Laporan Penggajian & Pajak'}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Laporan Penggajian & Pajak' }]}
        />

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    pb: 2,
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                  }}
                >
                  {disableForm ? (
                    <>
                      <Typography variant="subtitle2">Jenis Laporan: {labelJenisLaporan}</Typography>
                    </>
                  ) : (
                    <RHFSelect name="jenis_laporan" label="Jenis Laporan" placeholder="Jenis Laporan">
                      <option value="" />
                      {jenisLaporan.map((option) => (
                        <option key={option.code} value={option.code}>
                          {option.label}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                </Box>
                {idLaporan && (
                  <Box
                    sx={{
                      pb: 2,
                      display: 'grid',
                      columnGap: 2,
                      rowGap: 3,
                      gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                    }}
                  >
                    {disableForm ? (
                      <>
                        <Typography variant="subtitle2">Waktu: {labelWaktu}</Typography>
                      </>
                    ) : (
                      <Controller
                        name="waktu"
                        control={control}
                        render={({ field }) => (
                          <MobileDatePicker
                            {...field}
                            label="Waktu"
                            inputFormat={idLaporan === 'laporanSeluruhPegawaiSebulan' ? 'MM/yyyy' : 'yyyy'}
                            views={idLaporan === 'laporanSeluruhPegawaiSebulan' ? ['month', 'year'] : ['year']}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                          />
                        )}
                      />
                    )}
                  </Box>
                )}

                {idLaporan === 'laporanPerPegawai' && (
                  <Box
                    sx={{
                      display: 'grid',
                      columnGap: 2,
                      rowGap: 3,
                      gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
                    }}
                  >
                    {disableForm ? (
                      <>
                        <Typography variant="subtitle2">Bagian: {labelBagian}</Typography>
                      </>
                    ) : (
                      <RHFSelect name="id_bagian" label="Bagian" placeholder="Bagian">
                        <option value="" />
                        {masterBagianList.map((option) => (
                          <option key={option.id_bagian} value={option.id_bagian}>
                            {option.nama_bagian}
                          </option>
                        ))}
                      </RHFSelect>
                    )}
                    {disableForm ? (
                      <>
                        <Typography variant="subtitle2">Jabatan: {labelJabatan}</Typography>
                      </>
                    ) : (
                      <RHFSelect name="id_jabatan" label="Jabatan" placeholder="Jabatan">
                        <option value="" />
                        {jabatanOption?.map((option) => (
                          <option key={option.id_jabatan} value={option.id_jabatan}>
                            {option.nama_jabatan}
                          </option>
                        ))}
                      </RHFSelect>
                    )}
                    {disableForm ? (
                      <>
                        <Typography variant="subtitle2">
                          Pegawai: {labelNama}/{labelNip}
                        </Typography>
                      </>
                    ) : (
                      <RHFSelect name="nip" label="Nama/NIP" placeholder="Nama/NIP">
                        <option value="" />
                        {pegawaiOption.map((option) => (
                          <option key={option.nip} value={option.nip}>
                            {option.nama_lengkap}/{option.nip}
                          </option>
                        ))}
                      </RHFSelect>
                    )}
                  </Box>
                )}
                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  {/* <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {'Proses'}
                  </LoadingButton> */}
                  {disableForm ? (
                    <Button
                      variant="contained"
                      color="error"
                      // startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
                      onClick={onReset}
                    >
                      Reset
                    </Button>
                  ) : (
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      Proses
                    </LoadingButton>
                  )}
                </Stack>

                <Box sx={{ m: 1 }} />

                {filter && jenisLaporanSubmitted === 'laporanPerPegawai' && (
                  // <LaporanPegawaiPerTahun currentData={dataLaporan} waktu={labelWaktu} />
                  <LaporanPegawaiPerTahunPdf currentData={dataLaporan} waktu={labelWaktu} />
                )}
                {filter && jenisLaporanSubmitted === 'laporanSeluruhPegawaiSebulan' && (
                  <LaporanAllPerBulanPdf currentData={dataLaporan} waktu={labelWaktu} />
                )}
                {filter && jenisLaporanSubmitted === 'laporanSeluruhPegawaiSetahun' && (
                  <LaporanAllPerTahunPdf currentData={dataLaporan} waktu={labelWaktu} />
                )}
                {notFound && (
                  <Paper>
                    <Typography gutterBottom align="center" variant="subtitle1">
                      Data tidak Tersedia
                    </Typography>
                  </Paper>
                )}
              </Card>
            </Grid>
          </Grid>
        </FormProvider>

        <Box sx={{ m: 3 }} />
      </Container>
    </Page>
  );
}
