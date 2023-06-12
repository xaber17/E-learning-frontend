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
  getMasterBagian,
  createMasterBagian,
  updateMasterBagian,
  resetMasterBagian,
} from '../../../redux/slices/masterBagian';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries, roles } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

InputBagianForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
  menu: PropTypes.string,
};

const statusBagian = [
  { id: 1, code: 'aktif', label: 'Aktif' },
  { id: 2, code: 'non-aktif', label: 'Tidak Aktif' },
];

export default function InputBagianForm({ currentData, menu, action }) {
  console.log('INPUT MASTER BAGIAN FORM', currentData);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const BagianSchema = Yup.object().shape({
    nama_bagian: Yup.string().required('Nama Bagian wajib diisi'),
    status_bagian: Yup.mixed().required('Status Bagian wajib dipilih'),
  });

  const defaultValues = useMemo(
    () => ({
      nama_bagian: currentData?.nama_bagian || '',
      status_bagian: currentData?.status_bagian || '',
      id_bagian: currentData?.id_bagian || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(BagianSchema),
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
  }, [currentData, menu]);

  let msg = '';
  const failedMessage = 'Gagal menambah data';

  const onSubmit = async (data) => {
    console.log('jalan');
    console.log(data);

    const dataMasterBagian = {
      nama_bagian: data.nama_bagian,
      status_bagian: data.status_bagian,
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('ACTION', action);
    if (action === 'create') {
      dispatch(createMasterBagian(dataMasterBagian))
        .then((create) => {
          console.log(create);
          reset();
          dispatch(resetMasterBagian());
          navigate(PATH_DASHBOARD.masterdataBagian.list);
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
      dispatch(updateMasterBagian(data.id_bagian, dataMasterBagian))
        .then((update) => {
          console.log(update);
          reset();
          dispatch(resetMasterBagian());
          navigate(PATH_DASHBOARD.masterdataBagian.list);
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
    dispatch(resetMasterBagian());
    if (currentData) {
      window.localStorage.removeItem('currentMasterBagian');
    }
    window.localStorage.removeItem('action');
    await getMasterBagian();
    navigate(PATH_DASHBOARD.masterdataBagian.list);
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
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              {/* <RHFTextField name="kodeBagian" label="Kode Bagian" /> */}

              <RHFTextField name="nama_bagian" label="Nama Bagian" />

              <RHFSelect name="status_bagian" label="Status Bagian" placeholder="Status Bagian">
                <option value="" />
                {statusBagian.map((option) => (
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
