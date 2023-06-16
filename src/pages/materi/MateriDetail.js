import { Box, Card, Container, Grid } from '@mui/material';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { PATH_DASHBOARD } from '../../routes/paths';

export default function MateriForm() {
  const title = 'Detail Materi';
  const { themeStretch } = useSettings();

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
              <p>Materi Kelas</p>
              <p>Materi Kelas</p>
              <p>Materi Kelas</p>
              <p>Materi Kelas</p>
              <p>Materi Kelas</p>
            </Box>
          </Card>
        </Grid>
      </Container>
    </Page>
  );
}
