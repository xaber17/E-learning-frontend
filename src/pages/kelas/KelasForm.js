import { LoadingButton } from '@mui/lab';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Card, Container, Grid, Stack, TextField } from '@mui/material';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
// sections
import InputKelasForm from '../../sections/@dashboard/kelas/InputKelasForm';

export default function KelasForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const [currentKelas, setCurrentKelas] = useState({});
  const [action, setAction] = useState();
  const title = 'Kelas Form';

  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentKelas'));

    setCurrentKelas(curr);

    const a = window.localStorage.getItem('action');

    setAction(a);

    console.log('action', a);
  }, []);

  console.log('CURRENT DATA DI KELAS FORM', currentKelas);

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

        <InputKelasForm currentData={currentKelas} menu={title} action={action} />
      </Container>
    </Page>
  );
}
