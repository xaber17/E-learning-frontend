import { useState, useEffect } from 'react';
// @mui
import { Grid, Container, Typography } from '@mui/material';
import LoadingScreen from '../../components/LoadingScreen';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import { useDispatch, useSelector } from '../../redux/store';
import { getDashboardPegawai } from '../../redux/slices/dashboard';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsWidgetSummary,
  AnalyticsRekapKehadiranPegawai,
} from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

export default function DashboardPegawai() {
  const { auth } = useAuth();
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardPegawai()).then((data) => {
      console.log('data', data)
      setLoading(false);
    })
    .catch((err) => {
      console.log('error', err);
    });
  }, [dispatch]);

  const { dashboard } = useSelector((state) => state.dashboard);

  console.log('data_dashboard_pegawai', dashboard);

  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Page title="Dashboard Pegawai">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
        Selamat Datang, {auth?.nama_lengkap}
        </Typography>

        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title="Total Absensi" total={dashboard?.total_absensi} color="success" icon={'akar-icons:circle-check-fill'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title="Total Izin" total={dashboard?.total_izin} icon={'akar-icons:circle-x-fill'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Cuti"
              total={dashboard?.total_cuti}
              color="warning"
              icon={'eva:briefcase-fill'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title="Total Sakit" total={dashboard?.total_sakit} color="error" icon={'ant-design:home-filled'} />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AnalyticsRekapKehadiranPegawai data={dashboard?.rekap_harian} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
