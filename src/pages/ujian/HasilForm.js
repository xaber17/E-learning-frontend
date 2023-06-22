import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Container } from '@mui/material';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import InputUjianForm from '../../sections/@dashboard/ujian/InputUjianForm';

export default function HasilForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const [currentHasil, setCurrentHasil] = useState({});
  const [action, setAction] = useState();
  const title = 'Hasil Form';

  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentHasil'));

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
        <InputUjianForm currentData={currentHasil} menu={title} action={action} />
      </Container>
    </Page>
  );
}
