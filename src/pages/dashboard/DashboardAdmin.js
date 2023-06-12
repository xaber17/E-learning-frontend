import { useState, useEffect } from 'react';
// @mui
import { Grid, Container, Typography } from '@mui/material';
// import AnalyticsRekapJumlahUser from 'src/sections/dashboard/general/analytics/AnalyticsRekapJumlahUser';
// import AnalyticsStatusUser from 'src/sections/dashboard/general/analytics/AnalyticsStatusUser';
// hooks
import LoadingScreen from '../../components/LoadingScreen';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';

import { useDispatch, useSelector } from '../../redux/store';

import { getMasterBagian } from '../../redux/slices/masterBagian';

import { getMasterJabatan } from '../../redux/slices/masterJabatan';

import { getMasterTarifPtkp } from '../../redux/slices/masterTarifPtkp';

import { getUsers } from '../../redux/slices/users';

import { getDashboardAdmin } from '../../redux/slices/dashboard';

import {roles} from '../../_mock/_roles'
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsTasks,
  AnalyticsNewsUpdate,
  AnalyticsOrderTimeline,
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsTrafficBySite,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
  AnalyticsRekapJumlahUser,
  AnalyticsStatusUser,
  AnalyticsRole
} from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

export default function DashboardAdmin() {
  const { auth } = useAuth();
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardAdmin()).then((data) => {
        console.log('data', data)
        setLoading(false);
      })
      .catch((err) => {
        console.log('error', err);
      });
    try {
      dispatch(getMasterBagian());
      dispatch(getMasterJabatan());
      dispatch(getMasterTarifPtkp());
      dispatch(getUsers());
      
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);

  const { masterBagian } = useSelector((state) => state.masterBagian);
  const { masterJabatan } = useSelector((state) => state.masterJabatan);
  const { masterTarifPtkp } = useSelector((state) => state.masterTarifPtkp);
  const { users } = useSelector((state) => state.users);
  const { dashboard } = useSelector((state) => state.dashboard);

  console.log(masterBagian);
  console.log(masterJabatan);
  console.log(masterTarifPtkp);
  console.log(users);
  console.log('data', dashboard);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Dashboard Admin">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Selamat Datang, {auth?.nama_lengkap}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={4}>
            <AnalyticsWidgetSummary title="Total User" total={dashboard?.total_user} color="success" icon={'ooui:user-group-ltr'} />
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <AnalyticsWidgetSummary title="User Aktif" total={dashboard?.user_aktif} color="info" icon={'bxs:user'} />
          </Grid>

          {/* <Grid item xs={12} sm={12} md={3}>
            <AnalyticsWidgetSummary
              title="Item Orders"
              total={1723315}
              color="warning"
              icon={'ant-design:windows-filled'}
            />
          </Grid> */}

          <Grid item xs={12} sm={12} md={4}>
            <AnalyticsWidgetSummary
              title="User Tidak Aktif"
              total={dashboard?.user_nonaktif}
              color="error"
              icon={'gridicons:cross-circle'}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AnalyticsRekapJumlahUser
              dataUser={[
                {
                  name: 'User',
                  type: 'column',
                  data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3],
                },
              ]}
            />
          </Grid> */}

          <Grid item xs={12} md={6} lg={6}>
            <AnalyticsRole 
            data={dashboard?.role.map((num) => num.total)}
            labels={dashboard?.role.map((num) => {
              if (num.role === null) {
                return "Admin";
              }
              return num.role
            })} />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AnalyticsStatusUser data={[dashboard?.user_aktif, dashboard?.user_nonaktif]} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AnalyticsConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsCurrentSubject />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsTasks />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
