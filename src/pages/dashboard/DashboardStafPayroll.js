import { useState, useEffect } from 'react';
// @mui
import { Grid, Container, Typography } from '@mui/material';
import LoadingScreen from '../../components/LoadingScreen';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import { useDispatch, useSelector } from '../../redux/store';
import { getDashboardStafPayroll } from '../../redux/slices/dashboard';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsWidgetSummary,
  AnalyticsRole,
  AnalyticsRekapKehadiranHarian,
  AnalyticsWidgetText,
} from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

export default function DashboardStafPayroll() {
  const { auth } = useAuth();
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardStafPayroll()).then((data) => {
      console.log('data', data)
      setLoading(false);
    })
    .catch((err) => {
      console.log('error', err);
    });
  }, [dispatch]);

  const { dashboard } = useSelector((state) => state.dashboard);

  console.log('data_dashboard_stafpayroll', dashboard);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Dashboard Staf Payroll">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Selamat Datang, {auth?.nama_lengkap}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={4}>
            <AnalyticsWidgetSummary title="Pegawai" total={dashboard?.total_pegawai} color="success" icon={'bxs:user'} />
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <AnalyticsWidgetText title="Status Penggajian Bulan Ini" text={dashboard?.status_penggajian} icon={'akar-icons:circle-check-fill'} />
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
          <AnalyticsWidgetSummary title="Hari Menuju Penggajian" total={dashboard?.hari_sebelum_penggajian} color="error" icon={'fa-solid:calendar-alt'} />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AnalyticsRole
            data={dashboard?.role.map((num) => num.total)}
            labels={dashboard?.role.map((num) => {
              if (num.jabatan.length < 1) {
                return "Admin";
              }
              return num.jabatan[0]
            })}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AnalyticsRekapKehadiranHarian data={[{ data: dashboard?.rekap_harian }]} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
