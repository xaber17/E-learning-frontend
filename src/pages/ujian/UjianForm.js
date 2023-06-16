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
import InputUjianForm from '../../sections/@dashboard/ujian/InputUjianForm';

// ----------------------------------------------------------------------

export default function UjianForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentUser, setCurrentUser] = useState({});
  const [action, setAction] = useState();

  // const currentUser = _userList.find((user) => paramCase(user.name) === name);
  const title = 'Ujian Form';

  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentUser'));

    setCurrentUser(curr);

    const a = window.localStorage.getItem('action');

    setAction(a);
  }, []);

  console.log('CURRENT DATA DI UJIAN FORM', currentUser);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Users', href: PATH_DASHBOARD.users.list },
            { name: title },
          ]}
        />

        <InputUjianForm currentData={currentUser} menu={title} action={action} />
      </Container>
    </Page>
  );
}
