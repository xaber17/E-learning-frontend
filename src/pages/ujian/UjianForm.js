import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { DesktopDateTimePicker, LoadingButton } from '@mui/lab';
import { Controller } from 'react-hook-form';
import { Box, Button, Card, Container, Grid, Stack, TextField } from '@mui/material';
import { RHFUploadMultiFile } from '../../components/hook-form';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import InputUjianForm from '../../sections/@dashboard/ujian/InputUjianForm';

export default function UjianForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const [currentUjian, setCurrentUjian] = useState({});
  const [action, setAction] = useState();
  const title = 'Kelas Form';

  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentKelas'));

    setCurrentUjian(curr);

    const a = window.localStorage.getItem('action');

    setAction(a);

    console.log('action', a);
  }, []);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Ujian', href: PATH_DASHBOARD.ujian.list },
            { name: title },
          ]}
        />
        <InputUjianForm currentData={currentUjian} menu={title} action={action} />
      </Container>
    </Page>
  );
}
