import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Input
} from '@mui/material';

// utils
import { useDispatch, useSelector } from '../../../redux/store';

import { createMateri, getMateri, resetMateri, updateMateri } from '../../../redux/slices/materi';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import LoadingScreen from '../../../components/LoadingScreen';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadMultiFile, RHFUploadSingleFile } from '../../../components/hook-form';

// ----------------------------------------------------------------------

InputMateriForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
  menu: PropTypes.string,
};

export default function InputMateriForm({ currentData, menu, action }) {
  console.log('INPUT Materi FORM', currentData);
  console.log('ACTION', action);
  console.log('MENU', menu);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const [message, setMessage] = useState('');

  const { kelas } = useSelector((state) => state.kelas);
  let kelasList = [];
  try {
    kelasList = kelas?.data?.result;
  } catch (e) {
    console.log(e);
  }

  const NewMateriSchema = Yup.object().shape({
    materi_name: Yup.string().required('Nama Materi wajib diisi'),
    deskripsi: Yup.string().required('Deskripsi Materi wajib diisi'),
    kelas_id: Yup.string().required('Kelas wajib diisi'),
    pdf: Yup.array().min(1)
  });

  const defaultValues = useMemo(
    () => ({
      materi_name: currentData?.materi_name || '',
      deskripsi: currentData?.deskripsi || '',
      kelas_id: currentData?.kelas_id || '',
      pdf: currentData?.pdf || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(NewMateriSchema),
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
  const pdf = (values.pdf.length >= 1)

  console.log('VALUE INPUT', values);

  if (action === 'update' && menu === 'Akun' && values.materi_name === '') {
    window.location.reload();
  }
  console.log('CURRENTDATA', currentData);

  useEffect(() => {
    if (currentData) {
      reset(defaultValues);
    }
    if (!currentData) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData, menu]);

  const err = useSelector((state) => state.error);
  let msg = '';
  let failedMessage = '';
  if (action === 'create') {
    failedMessage = 'Gagal menambah data';
  } else if (action === 'update') {
    failedMessage = 'Gagal mengubah data';
  }

  const onSubmit = async (data) => {
    console.log('jalan dan ini datanya: ', data);
    // try {
    const newMateri = {
      materi_name: data.materi_name,
      deskripsi: data.deskripsi,
      kelas_id: data.kelas_id,
      file: data.pdf[0],
    };

    const updateMateriData = {
      materi_name: data.materi_name,
      materi_id: data.materi_id,
      deskripsi: data.deskripsi,
    };
    console.log('pushed button');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Action: ', action);
    if (action === 'create') {
      console.log('NEW Materi', newMateri);
      dispatch(createMateri(newMateri))
        .then((create) => {
          console.log(create);
          reset();
          dispatch(resetMateri());
          navigate(PATH_DASHBOARD.materi.list);
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
      console.log('jalan update');
      dispatch(updateMateri(data.materi_id, updateMateriData))
        .then((update) => {
          console.log(update);
          reset();
          dispatch(resetMateri());
          navigate(PATH_DASHBOARD.materi.list);
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
    dispatch(resetMateri());
    if (currentData) {
      window.localStorage.removeItem('currentMateri');
    }
    window.localStorage.removeItem('action');
    await getMateri();
    navigate(PATH_DASHBOARD.materi.list);
  };

  if (loading) {
    setTimeout(() => {
      return <LoadingScreen />;
    }, 1000);
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'pdf',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('pdf', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.pdf?.filter((_file) => _file !== file);
    setValue('pdf', filteredItems);
  };

  return (
    <FormProvider className='form-group' methods={methods} onSubmit={handleSubmit(onSubmit)}>
        
      <Grid container spacing={3}>
        <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
              }}
            >
              <RHFTextField id="outlined-helperText" label="Judul" name="materi_name" />
              <RHFTextField
                id="outlined-helperText"
                label="Deskripsi"
                name="deskripsi"
              />
              <RHFSelect name="kelas_id" label="Kelas" placeholder="Kelas">
                <option value="" />
                {kelasList.map((option) => (
                  <option key={option.kelas_id} value={option.kelas_id}>
                    {option.kelas_name}
                  </option>
                ))}
              </RHFSelect>
              <RHFUploadMultiFile 
                  name="pdf"
                  showPreview
                  accept="application/pdf"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
            </Box>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }} direction="row-reverse">
              <Button
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Simpan
              </Button>
              {pdf && (
                <Button color="inherit" onClick={handleRemoveAll}>
                  Remove
                </Button>
              )}
            </Stack>
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
