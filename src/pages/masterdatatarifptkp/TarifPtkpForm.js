import { useCallback, useEffect, useMemo, useState } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';
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
import InputTarifPtkpForm from '../../sections/@dashboard/masterdatatarifptkp/InputTarifPtkpForm';

// ----------------------------------------------------------------------

export default function TarifPtkpForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentMasterTarifPtkp, setCurrentMasterTarifPtkp] = useState({});
  const [action, setAction] = useState();
  const [loading, setLoading] = useState(true);

  // const currentUser = _userList.find((user) => paramCase(user.name) === name);
  const title = 'Master Tarif PTKP Form';
  const dispatch = useDispatch();
  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentMasterTarifPtkp'));

    setCurrentMasterTarifPtkp(curr);

    const a = window.localStorage.getItem('action');

    setAction(a);

    setLoading(false);
  }, []);

  console.log('CURRENT DATA DI MASTER TARIF PTKP FORM', currentMasterTarifPtkp);
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
            { name: 'Tarif PTKP', href: PATH_DASHBOARD.masterdataTarifPtkp.list },
            { name: title },
          ]}
        />

        <InputTarifPtkpForm currentData={currentMasterTarifPtkp} menu={title} action={action} />
      </Container>
    </Page>
  );
}
