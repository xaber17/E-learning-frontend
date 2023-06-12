import { useState, useEffect } from 'react';
// @mui
import { Grid, Container, Typography } from '@mui/material';
import LoadingScreen from '../../components/LoadingScreen';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import { useDispatch, useSelector } from '../../redux/store';
import { getDashboardManFin } from '../../redux/slices/dashboard';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsWidgetSummary,
  AnalyticsTotalGajiBulanan,
  AnalyticsHistoryLaporan
} from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

export default function DashboardManFin() {
  const { auth } = useAuth();
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardManFin()).then((data) => {
        console.log('data', data)
        setLoading(false);
      })
      .catch((err) => {
        console.log('error', err);
      });
  }, [dispatch]);

  const { dashboard } = useSelector((state) => state.dashboard);

  console.log('data_dashboard_manfin', dashboard);

  // const dataHistoryLaporan = [...Array(5)].map((_, index) => ({
  //   id: index + 1,
  //   title: [
  //     '1983, orders, $4220',
  //     '12 Invoices have been paid',
  //     'Order #37745 from September',
  //     'New order placed #XF-2356',
  //     'New order placed #XF-2346',
  //   ][index],
  //   type: `order${index + 1}`,
  //   time: [
  //     '01/01/2003',
  //     '02/01/2003',
  //     '03/01/2003',
  //     '04/01/2003',
  //     '05/01/2003',
  //     '06/01/2003',
  //   ][index],
  // }));

  if (loading) {
    return <LoadingScreen />;
  }

  
  return (
    <Page title="Dashboard Manajer Finance">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
        Selamat Datang, {auth?.nama_lengkap}
        </Typography>

        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title="Pegawai Finance" total={dashboard?.total_pegawai_finance} color="success" icon={'bxs:user'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title="Laporan Penggajian" total={dashboard?.total_laporan} icon={'akar-icons:circle-check-fill'} />
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
            <AnalyticsWidgetSummary title="Hari Menuju Penggajian" total={dashboard?.hari_sebelum_penggajian} color="error" icon={'fa-solid:calendar-alt'} />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AnalyticsTotalGajiBulanan data={[
                {
                  // name: 'Total Gaji',
                  // type: 'line',
                  data: dashboard?.budget_setahun,
                }
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AnalyticsHistoryLaporan dataHistory={dataHistoryLaporan} />
          </Grid> */}
          
        </Grid>
      </Container>
    </Page>
  );
}
