import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Grid, Stack, TextField } from '@mui/material';
import { RHFSelect, RHFTextField } from '../../components/hook-form';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

export default function KelasForm() {
  const title = 'Kelas Form';
  const { themeStretch } = useSettings();
  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Kelas', href: PATH_DASHBOARD.kelas.list },
            { name: title },
          ]}
        />

        {/* <InputUsersForm currentData={currentUser} menu={title} action={action} /> */}
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
              {/* <RHFTextField name="state" label="State/Region" />

              <RHFTextField name="city" label="City" />
              <RHFTextField name="zipCode" label="Zip/Code" /> */}
              <TextField id="outlined-helperText" label="Nama Kelas" defaultValue="Kelas A" />
              <TextField
                id="outlined-helperText"
                label="Deskripsi"
                defaultValue="Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus."
              />{' '}
            </Box>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton
                type="submit"
                variant="contained"
                //   loading={isSubmitting}
              >
                Simpan
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Container>
    </Page>
  );
}
