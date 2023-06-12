import { useCallback, useEffect, useMemo, useState } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';
import { getBawahan } from '../../redux/slices/penilaianKinerja';

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
import InputPenilaianKinerjaForm from '../../sections/@dashboard/penilaiankinerja/InputPenilaianKinerjaForm';

// ----------------------------------------------------------------------

export default function PenilaianKinerjaForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentPenilaianKinerja, setCurrentPenilaianKinerja] = useState({});
  const [action, setAction] = useState();
  const [loading, setLoading] = useState(true);

  // const currentUser = _userList.find((user) => paramCase(user.name) === name);
  const title = 'Penilaian Kinerja Form';

  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentPenilaianKinerja'));

    setCurrentPenilaianKinerja(curr);

    const a = window.localStorage.getItem('action');

    setAction(a);

    setLoading(false);
  }, []);

  console.log('CURRENT DATA DI PENILAIAN KINERJA FORM', currentPenilaianKinerja);
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
            { name: 'Penilaian Kinerja', href: PATH_DASHBOARD.penilaianKinerja.list },
            { name: title },
          ]}
        />

        <InputPenilaianKinerjaForm currentData={currentPenilaianKinerja} menu={title} action={action} />
      </Container>
    </Page>
  );
}
