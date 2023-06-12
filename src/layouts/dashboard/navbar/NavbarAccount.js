import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { getAuth } from '../../../redux/slices/auth';
import { useDispatch, useSelector } from '../../../redux/store';
// components
import MyAvatar from '../../../components/MyAvatar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
};

export default function NavbarAccount({ isCollapse }) {
  const [choosenRole, setChoosenRole] = useState('');
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAuth()).then((data) => {
      const a = window.localStorage.getItem('choosenRole');
      let namaRole = '';
      if (a === 'pegawai') {
        namaRole = 'Pegawai';
      } else if (a === 'admin') {
        namaRole = 'Admin';
      } else if (a === 'stafinv') {
        namaRole = 'Staf Invoice & Pembukuan';
      } else if (a === 'stafpayroll') {
        namaRole = 'Staf Payroll';
      } else if (a === 'dirut') {
        namaRole = 'Direktur Utama';
      } else if (a === 'gm') {
        namaRole = 'General Manager';
      } else if (a === 'manhrd') {
        namaRole = 'Manajer HRD';
      } else if (a === 'manfin') {
        namaRole = 'Manajer Finance';
      } else if (a === 'manpro') {
        namaRole = 'Manajer Proyek';
      } else if (a === 'stafabs'){
        namaRole = 'Staf Absensi dan Lembur';
      }
      setChoosenRole(namaRole);
    });
  }, [dispatch]);

  return (
    // <Link underline="none" color="inherit" component={RouterLink} to={PATH_DASHBOARD.user.account}>
    <RootStyle
      sx={{
        ...(isCollapse && {
          bgcolor: 'transparent',
        }),
      }}
    >
      {/* <MyAvatar /> */}

      <Box
        sx={{
          ml: 2,
          transition: (theme) =>
            theme.transitions.create('width', {
              duration: theme.transitions.duration.shorter,
            }),
          ...(isCollapse && {
            ml: 0,
            width: 0,
          }),
        }}
      >
        <Typography variant="subtitle2" noWrap>
          {auth?.nama_lengkap}
        </Typography>
        <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
          {choosenRole}
        </Typography>
      </Box>
    </RootStyle>
    // </Link>
  );
}
