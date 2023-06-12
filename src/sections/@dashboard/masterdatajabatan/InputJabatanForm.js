import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
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
  getMasterJabatan,
  getMasterJabatanActive,
  createMasterJabatan,
  updateMasterJabatan,
  resetMasterJabatan,
} from '../../../redux/slices/masterJabatan';

import { getMasterBagianActive } from '../../../redux/slices/masterBagian';
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

InputJabatanForm.propTypes = {
  isEdit: PropTypes.bool,
  currentMasterJabatan: PropTypes.object,
  menu: PropTypes.string,
};

const statusJabatan = [
  { id: 1, code: 'aktif', label: 'Aktif' },
  { id: 2, code: 'non-aktif', label: 'Tidak Aktif' },
];

export default function InputJabatanForm({ currentData, menu, action }) {
  console.log('INPUT MASTER JABATAN FORM', currentData);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [jabatanOption, setJabatanOption] = [];
  const { enqueueSnackbar } = useSnackbar();
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

  const StrukturSchema = Yup.object().shape({
    nama_jabatan: Yup.string().required('Nama Jabatan wajib diisi'),
    id_bagian: Yup.string().required('Bagian wajib dipilih'),
    kode_atasan: Yup.string().required('Atasan wajib dipilih'),
    status_jabatan: Yup.mixed().required('Status Jabatan wajib dipilih'),
  });

  const defaultValues = useMemo(
    () => ({
      id_jabatan: currentData?.id_jabatan || '',
      nama_jabatan: currentData?.nama_jabatan || '',
      id_bagian: currentData?.id_bagian || '',
      nama_bagian: currentData?.nama_bagian || '',
      kode_atasan: currentData?.kode_atasan || '',
      nama_atasan: currentData?.nama_atasan || '',
      status_jabatan: currentData?.status_jabatan || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(StrukturSchema),
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

  useEffect(() => {
    if (currentData) {
      reset(defaultValues);
    }
    if (!currentData) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData]);

  const idBagian = values.id_bagian;

  console.log(idBagian);

  let strukturOption = [{ id_jabatan: 0, nama_jabatan: 'Tidak Ada' }];
  if (masterJabatanList) {
    strukturOption = strukturOption.concat(masterJabatanList);
  }

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

    const dataMasterJabatan = {
      nama_jabatan: data?.nama_jabatan || '',
      id_bagian: data?.id_bagian || '',
      kode_atasan: data?.kode_atasan || '',
      status_jabatan: data?.status_jabatan || '',
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('ACTION', action);
    if (action === 'create') {
      dispatch(createMasterJabatan(dataMasterJabatan))
        .then((create) => {
          console.log(create);
          reset();
          dispatch(resetMasterJabatan());
          navigate(PATH_DASHBOARD.masterdataJabatan.list);
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
      dispatch(updateMasterJabatan(data.id_jabatan, dataMasterJabatan))
        .then((update) => {
          console.log(update);
          reset();
          dispatch(resetMasterJabatan());
          navigate(PATH_DASHBOARD.masterdataJabatan.list);
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
    dispatch(resetMasterJabatan());
    if (currentData) {
      window.localStorage.removeItem('currentMasterJabatan');
    }
    window.localStorage.removeItem('action');
    await getMasterJabatan();
    navigate(PATH_DASHBOARD.masterdataJabatan.list);
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
              {/* <RHFTextField name="kodeBagian" label="Kode Bagian" /> */}

              <RHFSelect name="id_bagian" label="Bagian" placeholder="Bagian">
                <option value="" />
                {masterBagianList?.map((option) => (
                  <option key={option.id_bagian} value={option.id_bagian}>
                    {option.nama_bagian}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="nama_jabatan" label="Nama Jabatan" />

              <RHFSelect name="kode_atasan" label="Atasan" placeholder="Atasan">
                <option value="" />
                {strukturOption?.map((option) => (
                  <option key={option.id_jabatan} value={option.id_jabatan}>
                    {option.nama_jabatan}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name="status_jabatan" label="Status Jabatan" placeholder="Status Jabatan">
                <option value="" />
                {statusJabatan?.map((option) => (
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
