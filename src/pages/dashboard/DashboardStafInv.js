import { useState, useEffect } from 'react';
// @mui
import { Grid, Container, Typography } from '@mui/material';
import LoadingScreen from '../../components/LoadingScreen';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import { useDispatch, useSelector } from '../../redux/store';
import { getDashboardStafInv } from '../../redux/slices/dashboard';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsWidgetSummary,
  AnalyticsStatusGaji,
} from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

export default function DashboardStafInv() {
  const { auth } = useAuth();
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardStafInv()).then((data) => {
      console.log('data', data)
      setLoading(false);
    })
    .catch((err) => {
      console.log('error', err);
    });
  }, [dispatch]);

  const { dashboard } = useSelector((state) => state.dashboard);

  console.log('data_dashboard_stafinv', dashboard);

  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Page title="Dashboard Staf Pembukuan dan Invoicing">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Selamat Datang, {auth?.nama_lengkap}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={4}>
            <AnalyticsWidgetSummary title="Gaji Belum Dikirim" total={dashboard?.gaji_belum_dikirim} color="success" icon={'akar-icons:circle-check-fill'} />
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <AnalyticsWidgetSummary title="Gaji Sudah Dikirim" total={dashboard?.gaji_terkirim} icon={'akar-icons:circle-x-fill'} />
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <AnalyticsWidgetSummary title="Hari Menuju Penggajian" total={dashboard?.hari_sebelum_penggajian} color="error" icon={'fa-solid:calendar-alt'} />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <AnalyticsStatusGaji data={dashboard?.status_gaji} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
