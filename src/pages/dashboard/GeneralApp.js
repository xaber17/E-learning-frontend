import { useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, Container, Grid, List, ListItem, Stack } from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';
import { getUsers } from '../../redux/slices/users';
import { getKelas } from '../../redux/slices/kelas';
import { getMateri } from '../../redux/slices/materi';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';
import { AnalyticsCurrentVisits, AnalyticsWidgetSummary } from '../../sections/@dashboard/general/analytics';


// ----------------------------------------------------------------------

export default function GeneralApp() {
  const dispatch = useDispatch();
  const { user, guru, siswa } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { materi } = useSelector((state) => state.materi);
  let materiList = [];
  try {
    materiList = [materi?.data?.result[0] || [], materi?.data?.result[1] || [], materi?.data?.result[2] || []];
    console.log('materi list dashboard: ', materiList);
  } catch (e) {
    console.log(e);
  }
  console.log('Data materi di dashboard: ', materi)
  console.log('Data guru dan siswa: ', guru, siswa);

  useEffect(() => {
    try {
      dispatch(getUsers());
    } catch (e) {
      console.log('ERROR', e);
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      dispatch(getMateri());
    } catch (e) {
      console.log('ERROR', e);
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      dispatch(getKelas());
    } catch (e) {
      console.log('ERROR', e);
    }
  }, [dispatch]);

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <AppWelcome displayName={user?.displayName} />
        <Grid container spacing={3}>
          {user.role === 'admin' ? (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <AnalyticsWidgetSummary
                  title="Total Users"
                  total={siswa?.length + guru?.length}
                  icon={'mdi:user-group'}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <AnalyticsWidgetSummary title="Total Siswa" total={siswa?.length} color="info" icon={'mdi:user'} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <AnalyticsWidgetSummary title="Total Guru" total={guru?.length} color="warning" icon={'mdi:user'} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <AnalyticsCurrentVisits Materi={materiList}/>
              </Grid>
            </>
          ) : null }
          {user.role === 'guru' ? (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <AnalyticsWidgetSummary
                  title="Total Siswa"
                  total={siswa?.length}
                  icon={'mdi:user-group'}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <AnalyticsWidgetSummary title="Total Materi" total={materiList?.length} color="info" icon={'mdi:book'} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <AnalyticsWidgetSummary title="Total Ujian" total={5} color="warning" icon={'mdi:assignment'} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <AnalyticsCurrentVisits Materi={materiList}/>
              </Grid>
            </>
          ) : null }
          {user.role === 'siswa' ? (
            <>
              <Grid item xs={6} sm={6} md={6}>
                <AnalyticsWidgetSummary title="Total Materi" total={materiList?.length} color="info" icon={'mdi:book'} />
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <AnalyticsWidgetSummary title="Total Ujian" total={5} color="warning" icon={'mdi:assignment'} />
              </Grid>
              
              <Grid item xs={12} md={6} lg={4}>
                <AnalyticsCurrentVisits Materi={materiList}/>
              </Grid>
            </>
          ) : null }
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardHeader title="Materi Terbaru" />
              <List
                sx={{
                  listStyleType: 'disc',
                  listStylePosition: 'inside',
                }}
              >
              {materiList.map((row) => {
                const materiName = row.materi_name || [];

                return (
                  <ListItem sx={{ display: 'list-item' }}>
                    {materiName}
                  </ListItem>
                )
              })}
              </List>
            </Card>
            <Card sx={{ mt: 3 }}>
              <CardHeader title="Ujian Berlangsung" />
              <List
                sx={{
                  listStyleType: 'disc',
                  listStylePosition: 'inside',
                }}
              >
                <ListItem sx={{ display: 'list-item' }}>Ujian A</ListItem>
                <ListItem sx={{ display: 'list-item' }}>Ujian B</ListItem>
                <ListItem sx={{ display: 'list-item' }}>Ujian C</ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
