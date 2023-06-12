import { useCallback, useEffect, useMemo, useState } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';

import { useDispatch, useSelector } from '../../redux/store';

import { getSlipGaji } from '../../redux/slices/slipGaji';
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
import DetailSlipGaji from '../../sections/@dashboard/slipgaji/DetailSlipGaji';
// ----------------------------------------------------------------------

export default function SlipGajiDetail() {
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const { slipGaji } = useSelector((state) => state.slipGaji);
  let currentSlipGaji = [];
  try {
    currentSlipGaji = slipGaji.data;
    console.log(currentSlipGaji);
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    setLoading(true);
    const kodePenggajian = window.localStorage.getItem('currentKodePenggajian');
    console.log(kodePenggajian);
    try {
      dispatch(getSlipGaji(kodePenggajian));
    } catch (e) {
      console.log('ERROR', e);
    }
    setLoading(false);
  }, [dispatch]);
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Page title="Slip Gaji Detail">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Slip Gaji Detail'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Slip Gaji', href: PATH_DASHBOARD.slipGaji.root },
            { name: 'Slip Gaji Detail' },
          ]}
        />
        <DetailSlipGaji currentData={currentSlipGaji} />
      </Container>
    </Page>
  );
}
