import { useState, useEffect } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';
import { getPenggajian } from '../../redux/slices/penggajian';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import LoadingScreen from '../../components/LoadingScreen';
// sections
import InputPenggajianForm from '../../sections/@dashboard/penggajian/InputPenggajianForm';

// ----------------------------------------------------------------------

export default function PenggajianForm() {
  const { themeStretch } = useSettings();

  const title = 'Form Penggajian';
  const [currentPenggajian, setCurrentPenggajian] = useState({});
  const [action, setAction] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentPenggajian'));

    setCurrentPenggajian(curr);

    const a = window.localStorage.getItem('action');

    setAction(a);

    setLoading(false);
  }, []);

  console.log('CURRENT DATA DIPENGGAJIAN FORM', currentPenggajian);
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
            { name: 'Penggajian', href: PATH_DASHBOARD.penggajian.root },
            { name: title },
          ]}
        />
        <InputPenggajianForm currentData={currentPenggajian} action={action} />
      </Container>
    </Page>
  );
}
