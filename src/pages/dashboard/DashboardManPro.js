import { useState, useEffect } from 'react';
// @mui
import { Grid, Container, Typography } from '@mui/material';
import LoadingScreen from '../../components/LoadingScreen';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import { useDispatch, useSelector } from '../../redux/store';
import { getDashboardManPro } from '../../redux/slices/dashboard';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsWidgetSummary,
  AnalyticsRole,
} from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

export default function DashboardManPro() {
  const { auth } = useAuth();
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardManPro()).then((data) => {
        console.log('data', data)
        setLoading(false);
      })
      .catch((err) => {
        console.log('error', err);
      });
  }, [dispatch]);

  const { dashboard } = useSelector((state) => state.dashboard);

  console.log('data_dashboard_manpro', dashboard);

  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Page title="Dashboard Manajer Produk">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
        Selamat Datang, {auth?.nama_lengkap}
        </Typography>

        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title="Pegawai" total={dashboard?.total_pegawai} color="success" icon={'bxs:user'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title="Pegawai Sudah Dinilai" total={dashboard?.sudah_dinilai} icon={'akar-icons:circle-check-fill'} />
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
            <AnalyticsWidgetSummary title="Hari Menuju Penilaian" total={dashboard?.hari_sebelum_penggajian} color="error" icon={'fa-solid:calendar-alt'} />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <AnalyticsRole
            data={dashboard?.role.map((num) => num.total)}
            labels={dashboard?.role.map((num) => {
              if (num.jabatan.length < 1) {
                return "Admin";
              }
              return num.jabatan[0]
            })} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
