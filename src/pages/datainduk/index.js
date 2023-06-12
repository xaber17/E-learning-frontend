import { useCallback, useEffect, useMemo, useState } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';

import { getDataInduk } from '../../redux/slices/pegawai';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import InputDataIndukForm from '../../sections/@dashboard/datainduk/InputDataIndukForm';

// ----------------------------------------------------------------------

export default function DataInduk() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const [dataInduk, setDataInduk] = useState({});
  const dispatch = useDispatch();

  const action = 'update';

  useEffect(() => {
    dispatch(getDataInduk())
      .then((x) => {
        console.log(x);
        const curr = JSON.parse(window.localStorage.getItem('dataInduk'));
        setDataInduk(curr);
      })
      .catch((x) => {
        console.log(x);
      });
  }, [dispatch]);

  return (
    <Page title="Data Induk">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Data Induk'}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Data Induk' }]}
        />

        <InputDataIndukForm currentData={dataInduk} action={action} />
      </Container>
    </Page>
  );
}
