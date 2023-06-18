import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Container, Grid, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RHFUploadMultiFile } from '../../components/hook-form';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import InputMateriForm from '../../sections/@dashboard/materi/InputMateriForm';

export default function MateriForm() {
  const title = 'Materi Form';
  const [currentMateri, setCurrentMateri] = useState({});
  const [action, setAction] = useState();
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');

  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentMateri'));
    setCurrentMateri(curr);

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
            { name: 'Materi', href: PATH_DASHBOARD.materi.list },
            { name: title },
          ]}
        />

        <InputMateriForm currentData={currentMateri} menu={title} action={action}/>
      </Container>
    </Page>
  );
}
