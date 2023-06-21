import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import InputUsersForm from '../../sections/@dashboard/users/InputUsersForm';

// ----------------------------------------------------------------------

export default function UsersForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const { user } = useAuth();
  const isEdit = pathname.includes('edit');

  console.log(user);
  const changePassword = {
    changePassword: true,
  };
  const akun = {
    akun: true,
  };
  console.log(changePassword);

  const a = {
    ...user,
    ...changePassword,
    ...akun,
  };

  console.log('USER', user);

  console.log('AKUN', a);

  const currentUser = a;

  const title = 'Profile';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: title }]}
        />

        <InputUsersForm currentData={currentUser} menu={title} action={'update'} />
      </Container>
    </Page>
  );
}
