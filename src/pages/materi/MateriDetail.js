import { Box, Card, Container, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../redux/store';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import LoadingScreen from '../../components/LoadingScreen';
import { getMateriDetail } from '../../redux/slices/materi';
import { PATH_DASHBOARD } from '../../routes/paths';

export default function MateriDetail() {
  const title = 'Detail Materi';
  const [currentMateri, setCurrentMateri] = useState({});
  const [previewMateri, setPreviewMateri] = useState();
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  // const { materiDetail } = useSelector((state) => state.materiDetail);
  const materi = window.localStorage.getItem('materiDetail')
  console.log('Preview Mater: ', previewMateri)
  
  useEffect(async () => {
    setLoading(true);
    const curr = JSON.parse(window.localStorage.getItem('currentMateri'));
    setCurrentMateri(curr);
    const preview = window.localStorage.getItem(curr.materi_name)
    setPreviewMateri(preview)
    try {
      await dispatch(getMateriDetail(curr.materi_id));
    } catch (e) {
      console.log('ERROR', e);
    }

    console.log('Materi Detail: ', curr);
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Materi', href: PATH_DASHBOARD.materi.list },
            { name: title },
          ]}
        />
        <Grid>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                // gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <div>
                <h5>Judul</h5>
                <h4>{currentMateri.materi_name}</h4>
              </div>
              <div>
                <h5>Guru</h5>
                <h4>{currentMateri.user_name}</h4>
              </div>
              <div>
                <h5>Deskripsi</h5>
                <h4>{currentMateri.deskripsi}</h4>
              </div>
              <div>
              <object
                data={previewMateri}
                type="application/pdf"
                width="900"
                height="678"
              >

                <iframe
                  src={previewMateri}
                  width="500"
                  height="678"
                  title='asdas'
                />

              </object>
              </div>
            </Box>
          </Card>
        </Grid>
      </Container>
    </Page>
  );
}
