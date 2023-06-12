import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, MobileDatePicker } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import {
  Button,
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
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TablePagination,
  Checkbox,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
// utils
import { fData } from '../../../utils/formatNumber';
import { useDispatch, useSelector } from '../../../redux/store';
import {
  getPenggajian,
  createPenggajian,
  resetPenggajian,
  generatePenggajianDetail,
  getPenggajianDetail,
  updatePenggajian,
  validasiPenggajian,
  verifikasiPenggajian,
  tolakPenggajian,
  persetujuanPenggajian,
} from '../../../redux/slices/penggajian';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries, roles, _userList } from '../../../_mock';
// components
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import LoadingScreen from '../../../components/LoadingScreen';

// List
import { PenggajianDetailListHead, PenggajianDetailListToolbar, PenggajianDetailMoreMenu } from './list';
import PenggajianDetailList from './PenggajianDetailList';

// ----------------------------------------------------------------------

InputPenggajianForm.propTypes = {
  action: PropTypes.string,
  currentData: PropTypes.object,
};

export default function InputPenggajianForm({ currentData, action }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [generate, setGenerate] = useState(false);
  const [list, setList] = useState();
  const [loading, setLoading] = useState(true);

  const { penggajianDetail } = useSelector((state) => state?.penggajian);
  const [penggajianDetailList, setPenggajianDetailList] = useState(penggajianDetail?.data);
  try {
    console.log(penggajianDetailList);
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    setLoading(true);
    if (action !== 'create') {
      dispatch(getPenggajianDetail(currentData?.kode_penggajian))
        .then((data) => {
          // setLoading(true)
          console.log('PENGGAJIAN DETAIL', data.payload);
          if (data.payload.data && data.payload.success) {
            setGenerate(true);
          } else {
            setGenerate(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setLoading(false);
  }, [dispatch]);

  const PenggajianDetailSchema = Yup.object().shape({
    waktu_pembayaran_gaji: Yup.date().required('Waktu Pembayaran Gaji wajib diisi'),
    awal_periode_penggajian: Yup.date().required('Awal Periode Penggajian wajib diisi'),
    akhir_periode_penggajian: Yup.date().required('Akhir Periode Penggajian wajib diisi'),
    keterangan_penggajian: Yup.string().required('Keterangan Penggajian wajib diisi'),
  });

  const defaultValues = useMemo(
    () => ({
      kode_penggajian: currentData?.kode_penggajian || '',
      waktu_pembayaran_gaji: currentData?.waktu_pembayaran_gaji || new Date(),
      awal_periode_penggajian: currentData?.awal_periode_penggajian || new Date(),
      akhir_periode_penggajian: currentData?.akhir_periode_penggajian || new Date(),
      keterangan_penggajian: currentData?.keterangan_penggajian || '',
      generate_detail: currentData?.generate_detail || '',
      generate_last_updated: currentData?.generate_last_updated || '0',
      status_penggajian: currentData?.status_penggajian || '0',
      nama_status_penggajian: currentData?.nama_status_penggajian || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(PenggajianDetailSchema),
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
  let failedMessage = '';
  if (action === 'create') {
    failedMessage = 'Gagal menambah data';
  } else if (action === 'update') {
    failedMessage = 'Gagal mengubah data';
  }

  const onSubmit = async (data) => {
    console.log(data);
    if (action === 'create') {
      const createData = {
        waktu_pembayaran_gaji: data?.waktu_pembayaran_gaji,
        awal_periode_penggajian: data?.awal_periode_penggajian,
        akhir_periode_penggajian: data?.akhir_periode_penggajian,
        keterangan_penggajian: data?.keterangan_penggajian,
      };
      dispatch(createPenggajian(createData))
        .then((data) => {
          const payload = data.payload;
          if (payload.success) {
            reset();
            dispatch(resetPenggajian());
            navigate(PATH_DASHBOARD.penggajian.list);
          } else {
            msg = payload.message;
            console.log('ERROR MESSAGE', msg);

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

  const onSimpanDraft = () => {
    console.log('SIMPAN DRAFT');
    console.log(values);
    const updateData = {
      waktu_pembayaran_gaji: values.waktu_pembayaran_gaji,
      awal_periode_penggajian: values.awal_periode_penggajian,
      akhir_periode_penggajian: values.akhir_periode_penggajian,
      keterangan_penggajian: values.keterangan_penggajian,
      req: 'simpan_draft',
    };
    dispatch(updatePenggajian(values.kode_penggajian, updateData))
      .then((data) => {
        const payload = data.payload;
        if (payload.success) {
          reset();
          dispatch(resetPenggajian());
          navigate(PATH_DASHBOARD.penggajian.list);
        } else {
          msg = payload.message;
          console.log('ERROR MESSAGE', msg);

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

  const onSimpanPersetujuan = () => {
    console.log('SIMPAN PERSETUJUAN');
    console.log(values);
    const updateData = {
      waktu_pembayaran_gaji: values.waktu_pembayaran_gaji,
      awal_periode_penggajian: values.awal_periode_penggajian,
      akhir_periode_penggajian: values.akhir_periode_penggajian,
      keterangan_penggajian: values.keterangan_penggajian,
      req: 'simpan_persetujuan',
    };
    dispatch(updatePenggajian(values.kode_penggajian, updateData))
      .then((data) => {
        const payload = data.payload;
        if (payload.success) {
          reset();
          dispatch(resetPenggajian());
          navigate(PATH_DASHBOARD.penggajian.list);
        } else {
          msg = payload.message;
          console.log('ERROR MESSAGE', msg);

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

  const onValidasiPenggajian = () => {
    console.log('VALIDASI PENGGAJIAN');
    console.log(values);
    const validasiData = {
      keterangan_penggajian: values.keterangan_penggajian,
    };
    dispatch(validasiPenggajian(values.kode_penggajian, validasiData))
      .then((data) => {
        const payload = data.payload;
        if (payload.success) {
          reset();
          dispatch(resetPenggajian());
          navigate(PATH_DASHBOARD.penggajian.list);
        } else {
          msg = payload.message;
          console.log('ERROR MESSAGE', msg);

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

  const onVerifikasiPenggajian = () => {
    console.log('VERIFIKASI PENGGAJIAN');
    console.log(values);
    const verifikasiData = {
      keterangan_penggajian: values.keterangan_penggajian,
    };
    dispatch(verifikasiPenggajian(values.kode_penggajian, verifikasiData))
      .then((data) => {
        const payload = data.payload;
        if (payload.success) {
          reset();
          dispatch(resetPenggajian());
          navigate(PATH_DASHBOARD.penggajian.list);
        } else {
          msg = payload.message;
          console.log('ERROR MESSAGE', msg);

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

  const onPersetujuanPenggajian = () => {
    console.log('PERSETUJUAN PENGGAJIAN');
    console.log(values);
    const persetujuanData = {
      keterangan_penggajian: values.keterangan_penggajian,
    };
    dispatch(persetujuanPenggajian(values.kode_penggajian, persetujuanData))
      .then((data) => {
        const payload = data.payload;
        if (payload.success) {
          reset();
          dispatch(resetPenggajian());
          navigate(PATH_DASHBOARD.penggajian.list);
        } else {
          msg = payload.message;
          console.log('ERROR MESSAGE', msg);

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
  
  const onTolakPenggajian = () => {
    console.log('TOLAK PENGGAJIAN');
    console.log(values);
    const tolakData = {
      keterangan_penggajian: values.keterangan_penggajian,
    };
    window.localStorage.setItem('action', 'tolak');
    dispatch(tolakPenggajian(values.kode_penggajian, tolakData))
      .then((data) => {
        const payload = data.payload;
        if (payload.success) {
          reset();
          dispatch(resetPenggajian());
          navigate(PATH_DASHBOARD.penggajian.list);
        } else {
          msg = payload.message;
          console.log('ERROR MESSAGE', msg);

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
    dispatch(resetPenggajian());
    if (currentData) {
      window.localStorage.removeItem('currentPenggajian');
    }
    window.localStorage.removeItem('action');
    await getPenggajian();
    navigate(PATH_DASHBOARD.penggajian.list);
  };

  const onGenerate = async () => {
    console.log('GENERATE PENGGAJIAN DETAIL', values);
    console.log('jalan generate');
    setGenerate(false);

    dispatch(generatePenggajianDetail(values.kode_penggajian))
      .then((data) => {
        console.log('GENERATE PENGGAJIAN', data);
        setPenggajianDetailList(data.payload.data);
        setGenerate(true);
        enqueueSnackbar('Berhasil Generate Penggajian Detail');
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
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  console.log(generate);
  console.log(action);

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
              {action === 'update' || action === 'create' ? (
                <Controller
                  name="waktu_pembayaran_gaji"
                  control={control}
                  render={({ field }) => (
                    <MobileDatePicker
                      {...field}
                      label="Waktu Pembayaran Gaji"
                      inputFormat="dd/MM/yyyy"
                      views={['day', 'month', 'year']}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  )}
                />
              ) : (
                <RHFTextField name="waktu_pembayaran_gaji" label="Waktu Pembayaran Gaji" disabled />
              )}
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                {action === 'update' || action === 'create' ? (
                  <Controller
                    name="awal_periode_penggajian"
                    control={control}
                    render={({ field }) => (
                      <MobileDatePicker
                        {...field}
                        label="Awal Periode Penggajian"
                        inputFormat="dd/MM/yyyy"
                        views={['day', 'month', 'year']}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    )}
                  />
                ) : (
                  <RHFTextField name="awal_periode_penggajian" label="Awal Periode Penggajian" disabled />
                )}
                {action === 'update' || action === 'create' ? (
                  <Controller
                    name="akhir_periode_penggajian"
                    control={control}
                    render={({ field }) => (
                      <MobileDatePicker
                        {...field}
                        label="Akhir Periode Penggajian"
                        inputFormat="dd/MM/yyyy"
                        views={['day', 'month', 'year']}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    )}
                  />
                ) : (
                  <RHFTextField name="akhir_periode_penggajian" label="Akhir Periode Penggajian" disabled />
                )}
              </Box>
              {action === 'detail' ? (
                <RHFTextField name="keterangan_penggajian" label="Keterangan Penggajian" multiline rows={4} disabled />
              ) : (
                <RHFTextField name="keterangan_penggajian" label="Keterangan Penggajian" multiline rows={4} />
              )}
              {action === 'update' && (
                <Box
                  sx={{
                    justifyContent: 'flex-end',
                    display: 'flex',
                    columnGap: 1,
                    rowGap: 1,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
                  }}
                >
                  <Button variant="contained" onClick={onGenerate}>
                    Generate Penggajian
                  </Button>
                </Box>
              )}
              {generate && <PenggajianDetailList currentData={penggajianDetailList} action={action} />}
              {action === 'create' && (
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
              )}
              {action === 'update' && (
                <Box>
                  <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                    <Box>
                      <Button variant="contained" color="inherit" onClick={handleBack}>
                        Kembali
                      </Button>
                    </Box>
                    <Box>
                      <LoadingButton
                        type="submit"
                        color="inherit"
                        variant="outlined"
                        loading={isSubmitting}
                        sx={{ marginX: 1 }}
                        onClick={onSimpanDraft}
                      >
                        Simpan Draft
                      </LoadingButton>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        sx={{ marginX: 1 }}
                        onClick={onSimpanPersetujuan}
                      >
                        {'Simpan dan Persetujuan'}
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Box>
              )}
              {action === 'detail' && (
                <Box>
                  <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                    <Box>
                      <Button variant="contained" color="inherit" onClick={handleBack}>
                        Kembali
                      </Button>
                    </Box>
                    <Box />
                  </Stack>
                </Box>
              )}
              {action === 'validasi' && (
                <Box>
                  <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                    <Box>
                      <Button variant="contained" color="inherit" onClick={handleBack}>
                        Kembali
                      </Button>
                    </Box>
                    <Box>
                      <LoadingButton
                        type="submit"
                        color="error"
                        variant="contained"
                        loading={isSubmitting}
                        sx={{ marginX: 1 }}
                        onClick={onTolakPenggajian}
                      >
                        Tolak Validasi
                      </LoadingButton>
                      <LoadingButton
                        type="submit"
                        color="primary"
                        variant="contained"
                        loading={isSubmitting}
                        sx={{ marginX: 1 }}
                        onClick={onValidasiPenggajian}
                      >
                        Validasi
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Box>
              )}
              {action === 'verifikasi' && (
                <Box>
                  <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                    <Box>
                      <Button variant="contained" color="inherit" onClick={handleBack}>
                        Kembali
                      </Button>
                    </Box>
                    <Box>
                      <LoadingButton
                        type="submit"
                        color="error"
                        variant="contained"
                        loading={isSubmitting}
                        sx={{ marginX: 1 }}
                        onClick={onTolakPenggajian}
                      >
                        Tolak Verifiaksi
                      </LoadingButton>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={isSubmitting}
                        sx={{ marginX: 1 }}
                        onClick={onVerifikasiPenggajian}
                      >
                        Verifikasi
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Box>
              )}
              {action === 'persetujuan' && (
                <Box>
                  <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ mt: 3 }}>
                    <Box>
                      <Button variant="contained" color="inherit" onClick={handleBack}>
                        Kembali
                      </Button>
                    </Box>
                    <Box>
                      <LoadingButton
                        type="submit"
                        color="error"
                        variant="contained"
                        loading={isSubmitting}
                        sx={{ marginX: 1 }}
                        onClick={onTolakPenggajian}
                      >
                        Tolak Verifiaksi
                      </LoadingButton>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={isSubmitting}
                        sx={{ marginX: 1 }}
                        onClick={onPersetujuanPenggajian}
                      >
                        Setuju
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Box>
              )}
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
