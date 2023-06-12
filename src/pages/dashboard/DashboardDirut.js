import { useState, useEffect } from 'react';
// @mui
import { Grid, Container, Typography } from '@mui/material';
// hooks
import LoadingScreen from '../../components/LoadingScreen';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import { useDispatch, useSelector } from '../../redux/store';
import { getDashboardDirut } from '../../redux/slices/dashboard';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsWidgetSummary,
  AnalyticsRekapUserBulanan,
  AnalyticsHistoryLaporan,
  AnalyticsRole,
  AnalyticsDokumen,
  AnalyticsRekapKehadiranHarian
} from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

export default function DashboardDirut() {
  const { auth } = useAuth();
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardDirut()).then((data) => {
        console.log('data', data)
        setLoading(false);
      })
      .catch((err) => {
        console.log('error', err);
      });
    // try {
    //   dispatch(getMasterBagian());
    //   dispatch(getMasterJabatan());
    //   dispatch(getMasterTarifPtkp());
    //   dispatch(getUsers());
      
    // } catch (e) {
    //   console.log(e);
    // }
  }, [dispatch]);

  const { dashboard } = useSelector((state) => state.dashboard);

  console.log('data_dashboard', dashboard);

  const dataHistoryLaporan = dashboard?.budget?.map((val, index) => ({
    id: index + 1,
    title: val.kode_penggajian,
    type: `order${index + 1}`,
    time: val.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  }))
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
    <Page title="Dashboard Direktur Utama">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Selamat Datang, {auth?.nama_lengkap}
        </Typography>

        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title="Pegawai" total={dashboard?.total_pegawai} color="success" icon={'bxs:user'} />
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

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsRekapUserBulanan dataUser={[
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
            ]}/>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsHistoryLaporan dataHistory={dataHistoryLaporan} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsRole
            data={dashboard?.role.map((num) => num.total)}
            labels={dashboard?.role.map((num) => {
              if (num.jabatan.length < 1) {
                return "Admin";
              }
              return num.jabatan[0]
            })}  />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsDokumen data={dashboard?.dokumen} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsRekapKehadiranHarian data={[{ data: dashboard?.rekap_harian }]} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
