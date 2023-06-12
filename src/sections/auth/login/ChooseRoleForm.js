import * as Yup from 'yup';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { getAuth } from '../../../redux/slices/auth';
import { useDispatch, useSelector } from '../../../redux/store';
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox, RHFSelect } from '../../../components/hook-form';
import LoadingScreen from '../../../components/LoadingScreen';
// mock
import { roles } from '../../../_mock';

// ----------------------------------------------------------------------

export default function ChooseRoleForm({ loggedIn }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { choosingrole } = useAuth();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const [roleOpt, setRoleOpt] = useState([]);

  let roleOptions = [];
  useEffect(() => {
    dispatch(getAuth()).then((data) => {
      const role = data?.payload.role;
      const isAdmin = data?.payload.is_admin;

      console.log(data);
      if (role !== null) {
        roleOptions = roles.filter((x) => x.code === role);

        if (role !== 'pegawai') {
          roleOptions = roleOptions.concat(roles.filter((x) => x.code === 'pegawai'));
        }

        if (isAdmin === 1) {
          roleOptions = roleOptions.concat(roles.filter((x) => x.code === 'admin'));
        }
      } else {
        roleOptions = roleOptions.concat(roles.filter((x) => x.code === 'admin'));
      }
      console.log(roleOptions);
      setRoleOpt(roleOptions);
    });
  }, [dispatch]);

  console.log(roleOpt);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    role: Yup.string().required('Role wajib dipilih'),
  });

  const defaultValues = useMemo(
    () => ({
      role: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
    if (loggedIn) {
      reset(defaultValues);
      setLoading(false);
      if (auth) {
        console.log('AUTH', auth);
      } else {
        window.location.reload();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  const onSubmit = async (data) => {
    try {
      console.log('data on submit', data.role);
      window.localStorage.setItem('choosenRole', data.role);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await choosingrole(data.role);
      console.log('data on submit sudah');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      reset();
      enqueueSnackbar('Berhasil Pilih Role');
      switch (data.role) {
        case 'admin':
          return navigate(PATH_DASHBOARD.general.admin);
        case 'dirut':
          return navigate(PATH_DASHBOARD.general.dirut);
        case 'gm':
          return navigate(PATH_DASHBOARD.general.gm);
        case 'manfin':
          return navigate(PATH_DASHBOARD.general.manfin);
        case 'manpro':
          return navigate(PATH_DASHBOARD.general.manpro);
        case 'manhrd':
          return navigate(PATH_DASHBOARD.general.manhrd);
        case 'stafpayroll':
          return navigate(PATH_DASHBOARD.general.stafpayroll);
        case 'stafabs':
          return navigate(PATH_DASHBOARD.general.stafabs);
        case 'stafinv':
          return navigate(PATH_DASHBOARD.general.stafinv);
        case 'pegawai':
          return navigate(PATH_DASHBOARD.general.pegawai);
        default:
          return navigate(PATH_DASHBOARD.general.analytics);
      }
    } catch (error) {
      console.error('error 111', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack> */}

      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          Forgot password?
        </Link>
      </Stack> */}

      <Stack spacing={3} mb={5}>
        <RHFSelect name="role" label="Pilih Role" placeholder="Role">
          <option value="" />
          {roleOpt.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </RHFSelect>
      </Stack>

      <Button fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Pilih
      </Button>
    </FormProvider>
  );
}
