import { useCallback, useEffect, useMemo, useState } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';
import { getMasterBagian } from '../../redux/slices/masterBagian';
import { getMasterJabatan } from '../../redux/slices/masterJabatan';
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
import InputJabatanForm from '../../sections/@dashboard/masterdatajabatan/InputJabatanForm';

// ----------------------------------------------------------------------

export default function JabatanForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentMasterJabatan, setCurrentMasterJabatan] = useState({});
  const [action, setAction] = useState();
  const [loading, setLoading] = useState(true);

  // const currentUser = _userList.find((user) => paramCase(user.name) === name);
  const title = 'Master Jabatan Form';
  // const dispatch = useDispatch();
  // const fetchDataMasterBagian = async () => {
  //   dispatch(getMasterBagian());
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  // };

  // const fetchDataMasterJabatan = async () => {
  //   dispatch(getMasterJabatan());
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  // };

  // useEffect(() => {
  //   fetchDataMasterBagian()
  //     // make sure to catch any error
  //     .catch(console.error);
  // }, [dispatch]);

  // useEffect(() => {
  //   fetchDataMasterJabatan()
  //     .then(setLoading(false))
  //     // make sure to catch any error
  //     .catch(console.error);
  // }, [dispatch]);
  useEffect(() => {
    const curr = JSON.parse(window.localStorage.getItem('currentMasterJabatan'));

    setCurrentMasterJabatan(curr);

    const a = window.localStorage.getItem('action');

    setAction(a);

    setLoading(false);
  }, []);

  console.log('CURRENT DATA DI MASTER JABATAN KEPEGAWAIAN FORM', currentMasterJabatan);
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
            { name: 'Jabatan', href: PATH_DASHBOARD.masterdataJabatan.list },
            { name: title },
          ]}
        />

        <InputJabatanForm currentData={currentMasterJabatan} menu={title} action={action} />
      </Container>
    </Page>
  );
}
