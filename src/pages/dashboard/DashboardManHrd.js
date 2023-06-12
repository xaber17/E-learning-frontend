import { useState, useEffect } from 'react';
// @mui
import { Grid, Container, Typography } from '@mui/material';
// hooks
import LoadingScreen from '../../components/LoadingScreen';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import { useDispatch, useSelector } from '../../redux/store';
import { getDashboardManHrd } from '../../redux/slices/dashboard';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsWidgetSummary,
  AnalyticsRole,
  AnalyticsDokumen,
  AnalyticsRekapKehadiranHarian,
  AnalyticsRekapUserBulanan,
} from '../../sections/@dashboard/general/analytics';


// ----------------------------------------------------------------------

export default function DashboardManHrd() {
  const { auth } = useAuth();
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardManHrd())
      .then((data) => {
        console.log('data', data)
        setLoading(false);
      })
      .catch((err) => {
        console.log('error', err);
      });
  }, [dispatch]);

  const { dashboard } = useSelector((state) => state.dashboard);

  console.log('data_dashboard_manhrd', dashboard);

  
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Dashboard Manajer HRD">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Selamat Datang, {auth?.nama_lengkap}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Pegawai"
              total={dashboard?.total_pegawai}
              color="success"
              icon={'bxs:user'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Dokumen Belum Diverifikasi"
              total={dashboard?.dokumen_belum_diverifikasi}
              icon={'akar-icons:circle-check-fill'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Pegawai Belum Dinilai"
              total={dashboard?.belum_dinilai}
              color="warning"
              icon={'akar-icons:circle-x-fill'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Hari Menuju Penggajian"
              total={dashboard?.hari_sebelum_penggajian}
              color="error"
              icon={'fa-solid:calendar-alt'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsRole
              data={dashboard?.role?.map((num) => num.total)}
              labels={dashboard?.role?.map((num) => {
                if (num.jabatan.length < 1) {
                  return 'Admin';
                }
                return num.jabatan[0];
              })}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsDokumen data={dashboard?.dokumen} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsRekapKehadiranHarian data={[{ data: dashboard?.rekap_harian }]} />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AnalyticsRekapUserBulanan
              dataUser={[
                {
                  name: 'Hadir',
                  type: 'column',
                  data: dashboard?.hadir_perbulan,
                },
                {
                  name: 'Izin',
                  type: 'area',
                  data: dashboard?.izin_perbulan,
                },
                {
                  name: 'Sakit',
                  type: 'line',
                  data: dashboard?.sakit_perbulan,
                },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
