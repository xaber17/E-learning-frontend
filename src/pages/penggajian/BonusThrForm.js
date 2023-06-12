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
import InputBonusThrForm from '../../sections/@dashboard/penggajian/InputBonusThrForm'

// ----------------------------------------------------------------------

export default function BonusThrForm() {
  const { themeStretch } = useSettings();
  const [currentPenggajianDetail, setCurrentPenggajianDetail] = useState({});
  const [action, setAction] = useState();
  const [loading, setLoading] = useState(true);
  // const currentUser = _userList.find((user) => paramCase(user.name) === name);

  const title = 'Bonus/THR';
  const dispatch = useDispatch();
  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentPenggajianDetail'));

    setCurrentPenggajianDetail(curr);

    const a = window.localStorage.getItem('action');

    setAction(a);

    setLoading(false);
  }, []);

  console.log('CURRENT PENGGAJIAN DETAIL FORM', currentPenggajianDetail);
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
            { name: 'Penggajian', href: PATH_DASHBOARD.penggajian.list },
            { name: title },
          ]}
        />

        <InputBonusThrForm currentData={currentPenggajianDetail} menu={title} action={action} />
      </Container>
    </Page>
  );
}
