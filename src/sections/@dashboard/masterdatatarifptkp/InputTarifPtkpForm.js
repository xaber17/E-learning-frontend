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
  getMasterTarifPtkp,
  createMasterTarifPtkp,
  updateMasterTarifPtkp,
  resetMasterTarifPtkp,
} from '../../../redux/slices/masterTarifPtkp';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries, roles } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

InputTarifPtkpForm.propTypes = {
  isEdit: PropTypes.bool,
  currentMasterTarifPtkp: PropTypes.object,
  menu: PropTypes.string,
};

const statusTarifPtkp = [
  { id: 1, code: 'aktif', label: 'Aktif' },
  { id: 2, code: 'non-aktif', label: 'Tidak Aktif' },
];

export default function InputTarifPtkpForm({ currentData, menu, action }) {
  console.log('INPUT MASTER Tarif PTKP FORM', currentData);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const TarifPtkpSchema = Yup.object().shape({
    kode_tarifptkp: Yup.string().required('Kode Tarif PTKP wajib diisi'),
    besaran_tarifptkp: Yup.string().required('Besaran Tarif PTKP wajib diisi'),
    keterangan_tarifptkp: Yup.string().required('Keterangan Tarif PTKP wajib diisi'),
    status_tarifptkp: Yup.mixed().required('Status Tarif PTKP wajib dipilih'),
  });

  const defaultValues = useMemo(
    () => ({
      kode_tarifptkp: currentData?.kode_tarifptkp || '',
      besaran_tarifptkp: currentData?.besaran_tarifptkp || '',
      keterangan_tarifptkp: currentData?.keterangan_tarifptkp || '',
      status_tarifptkp: currentData?.status_tarifptkp || '',
      id_tarifptkp: currentData?.id_tarifptkp || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(TarifPtkpSchema),
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

    const dataMasterTarifPtkp = {
      kode_tarifptkp: data?.kode_tarifptkp,
      besaran_tarifptkp: data?.besaran_tarifptkp,
      keterangan_tarifptkp: data?.keterangan_tarifptkp,
      status_tarifptkp: data?.status_tarifptkp,
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('ACTION', action);
    if (action === 'create') {
      dispatch(createMasterTarifPtkp(dataMasterTarifPtkp))
        .then((create) => {
          console.log(create);
          reset();
          dispatch(resetMasterTarifPtkp());
          navigate(PATH_DASHBOARD.masterdataTarifPtkp.list);
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
      dispatch(updateMasterTarifPtkp(data.id_tarifptkp, dataMasterTarifPtkp))
        .then((update) => {
          console.log(update);
          reset();
          dispatch(resetMasterTarifPtkp());
          navigate(PATH_DASHBOARD.masterdataTarifPtkp.list);
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
    dispatch(resetMasterTarifPtkp());
    if (currentData) {
      window.localStorage.removeItem('currentMasterTarifPtkp');
    }
    window.localStorage.removeItem('action');
    await getMasterTarifPtkp();
    navigate(PATH_DASHBOARD.masterdataTarifPtkp.list);
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
              <RHFTextField name="kode_tarifptkp" label="Kode Tarif PTKP" />

              <RHFTextField
                name="besaran_tarifptkp"
                label="Besaran Tarif PTKP"
                placeholder="0.00"
                value={getValues('besaran_tarifptkp') <= 0 ? 0 : getValues('besaran_tarifptkp')}
                onChange={(event) => setValue('besaran_tarifptkp', Number(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  type: 'number',
                }}
              />

              <RHFTextField name="keterangan_tarifptkp" label="Keterangan Tarif PTKP" />

              <RHFSelect name="status_tarifptkp" label="Status Tarif PTKP" placeholder="Status Tarif PTKP">
                <option value="" />
                {statusTarifPtkp.map((option) => (
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
