import { useState, useEffect } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';
import { getMasterTarifPtkp } from '../../redux/slices/masterTarifPtkp';
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
import InputGajiPokokTunjanganForm from '../../sections/@dashboard/gajipokoktunjangan/InputGajiPokokTunjanganForm';

// ----------------------------------------------------------------------

export default function GajiPokokTunjanganForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentGajiPokokTunjangan, setCurrentGajiPokokTunjangan] = useState({});
  const [action, setAction] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentGajiPokokTunjangan'));

    setCurrentGajiPokokTunjangan(curr);

    const a = window.localStorage.getItem('action');

    setAction(a);

    setLoading(false);
  }, []);

  console.log('CURRENT DATA DI GAJI POKOK DAN TUNJANGAN FORM', currentGajiPokokTunjangan);
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Page title="Form Gaji Pokok dan Tunjangan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Form Gaji Pokok dan Tunjangan'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Gaji Pokok dan Tunjangan', href: PATH_DASHBOARD.gajiPokokTunjangan.root },
            { name: 'Form Gaji Pokok dan Tunjangan' },
          ]}
        />
        <InputGajiPokokTunjanganForm currentData={currentGajiPokokTunjangan} action={action} />
      </Container>
    </Page>
  );
}
