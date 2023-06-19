import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Container } from '@mui/material';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import InputHasilForm from '../../sections/@dashboard/ujian/InputHasilForm';

export default function HasilHasilForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const [currentHasil, setCurrentHasil] = useState({});
  const [action, setAction] = useState();
  const title = 'Form Hasil Ujian';

  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentKelas'));

    setCurrentHasil(curr);

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
        <InputHasilForm currentData={currentHasil} menu={title} action={action} />
      </Container>
    </Page>
  );
}
