import { DesktopDateTimePicker, LoadingButton } from '@mui/lab';
import { Controller } from 'react-hook-form';
import { Box, Button, Card, Container, Grid, Stack, TextField } from '@mui/material';
import { RHFUploadMultiFile } from '../../components/hook-form';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

export default function UjianForm() {
  const title = 'Ujian Form';
  const { themeStretch } = useSettings();

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Ujian', href: PATH_DASHBOARD.materi.list },
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
              <TextField id="outlined-helperText" label="Nama Ujian" defaultValue="Ujian A" />
              <TextField
                id="outlined-helperText"
                label="Deadline"
                defaultValue="Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus."
              />{' '}
              <DesktopDateTimePicker
                label="Start date"
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              {/* <Button variant="contained" component="label" color="secondary" sx={{ width: '50%' }}>
                Upload File
                <input type="file" hidden />
              </Button> */}
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
