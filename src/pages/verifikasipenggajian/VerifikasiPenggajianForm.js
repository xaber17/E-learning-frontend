import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import InputVerifikasiPenggajianForm from '../../sections/@dashboard/verifikasipenggajian/InputVerifikasiPenggajianForm';

// ----------------------------------------------------------------------

export default function VerifikasiPenggajianForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const isEdit = pathname.includes('edit');

  const currentUser = _userList.find((user) => paramCase(user.name) === name);

  return (
    <Page title="Form Verifikasi Penggajian">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Form Verifikasi Penggajian'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Verifikasi Penggajian', href: PATH_DASHBOARD.statusPenggajian.root },
            { name: 'Form Verifikasi Penggajian' },
          ]}
        />
        <InputVerifikasiPenggajianForm />
      </Container>
    </Page>
  );
}
