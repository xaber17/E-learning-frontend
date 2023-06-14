import { sentenceCase } from 'change-case';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { useDispatch, useSelector } from '../../redux/store';

import { getUsers, setCurrentUser, resetUser, deleteUser } from '../../redux/slices/users';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList, roles } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { DialogAnimate } from '../../components/animate';
import LoadingScreen from '../../components/LoadingScreen';
// sections
import { UsersListHead, UsersListToolbar, UsersMoreMenu } from '../../sections/@dashboard/users/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'noInduk', label: 'No. Induk', alignRight: false },
  { id: 'namaLengkap', label: 'Nama Lengkap', alignRight: false },
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'kelas', label: 'Kelas', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: '' },
];

const dummyUsers = [
  { noInduk: 1, namaLengkap: 'Getar', username: 'getarmetal', kelas: 'X.1', role: 'siswa' },
  { noInduk: 2, namaLengkap: 'Farah', username: 'getarmetal', kelas: 'X.1', role: 'guru' },
  { noInduk: 3, namaLengkap: 'Adli', username: 'getarmetal', kelas: 'X.1', role: 'admin' },
  { noInduk: 4, namaLengkap: 'Qila', username: 'getarmetal', kelas: 'X.1', role: 'siswa' },
  { noInduk: 5, namaLengkap: 'Siddiq', username: 'getarmetal', kelas: 'X.1', role: 'siswa' },
  { noInduk: 6, namaLengkap: 'Frisky', username: 'getarmetal', kelas: 'X.1', role: 'siswa' },
];

// ----------------------------------------------------------------------

export default function UsersList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [list, setList] = useState();
  const [open, setOpen] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteIdUser, setDeleteIdUser] = useState();
  let msg = '';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.users);
  let usersList = [];
  try {
    usersList = users?.data;
    console.log(usersList);
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    setLoading(true);
    const action = window.localStorage.getItem('action');
    window.localStorage.removeItem('currentUsers');
    try {
      dispatch(getUsers());
    } catch (e) {
      console.log('ERROR', e);
    }

    if (action === 'delete') {
      enqueueSnackbar('Berhasil menghapus data');
      window.localStorage.removeItem('action');
    } else if (action === 'create') {
      enqueueSnackbar('Berhasil menambah data');
      window.localStorage.removeItem('action');
    } else if (action === 'update') {
      enqueueSnackbar('Berhasil mengubah data');
      window.localStorage.removeItem('action');
    }

    setLoading(false);
  }, [dispatch]);

  // useEffect(() => {
  //   const action = window.localStorage.getItem('action');
  //   window.localStorage.removeItem('currentUser');
  //   console.log('action', action);
  //   try {
  //     dispatch(getUsers());
  //     const list = JSON.parse(window.localStorage.getItem('usersList'));
  //     if (list) {
  //       setList(list);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   if (action === 'delete') {
  //     enqueueSnackbar('Berhasil menghapus data');
  //     window.localStorage.removeItem('action');
  //   } else if (action === 'create') {
  //     enqueueSnackbar('Berhasil menambah data');
  //     window.localStorage.removeItem('action');
  //   } else if (action === 'update') {
  //     enqueueSnackbar('Berhasil mengubah data');
  //     window.localStorage.removeItem('action');
  //   }
  //   setLoading(false);
  // }, [dispatch]);

  // const { users } = useSelector((state) => state.users);

  // console.log(users);
  console.log(_userList);
  console.log(list);

  // const [usersList, setUsersList] = useState(users.data);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('noInduk');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = usersList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  // const handleDeleteUser = (userId) => {
  //   const deleteUser = usersList.filter((user) => user.id_user !== userId);
  //   setSelected([]);
  //   setUsersList(deleteUser);
  // };

  const handleDeleteUser = async (userId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.localStorage.setItem('action', 'delete');
    dispatch(deleteUser(userId))
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          enqueueSnackbar('Berhasil menghapus data');
        }, 1000);

        setLoading(true);
        dispatch(getUsers());
        handleCloseModal();
        handleCloseErrorModal();
        setLoading(false);
      })
      .catch((e) => {
        console.log('ERROR', e);
        const error = e;
        Object.keys(error).forEach((key) => {
          console.log(error[key][0]); // 👉️ "Tom", "Chile"
          const errMessage = error[key][0];

          msg = msg.concat(errMessage);
        });

        console.log('ERROR MESSAGE', msg);
        setErrorMessage(msg);
        handleCloseModal();
        setOpenErrorModal(true);
        handleCloseErrorModal();
      });
  };

  const handleOpenDeleteModal = (idUser) => {
    setDeleteIdUser(parseInt(idUser, 10));
    setOpen(true);
  };

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = dummyUsers.filter((user) => !selected.includes(user.namaLengkap));
    setSelected([]);
    // setUsersList(deleteUsers);
  };

  const handleUpdateUser = (user) => {
    console.log('UPDATE USER LIST', user);
    dispatch(setCurrentUser(user));
    window.localStorage.setItem('currentUser', JSON.stringify(user));
    window.localStorage.setItem('action', 'update');
  };

  const handleCreateUser = () => {
    dispatch(resetUser());
    window.localStorage.removeItem('currentUser');
    window.localStorage.setItem('action', 'create');
  };

  const handleCloseModal = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dummyUsers.length) : 0;

  const filteredUsers = applySortFilter(dummyUsers, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Users">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Users"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Users' }]}
          action={
            <Button
              onClick={() => handleCreateUser()}
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.users.form}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tambah
            </Button>
          }
        />
        <Card>
          <UsersListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteUsers={() => handleDeleteMultiUser(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UsersListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dummyUsers.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    // const idUser = row.id_user;
                    // const namaLengkap = row.namaLengkap;
                    // const email = row.email;
                    // const password = row.password;
                    // const idJabatan = row.id_jabatan;
                    // const isAdmin = row.is_admin;
                    // const role = row.role;
                    // const statusUser = row.status_user;
                    const noInduk = row.noInduk;
                    const namaLengkap = row.namaLengkap;
                    const username = row.username;
                    const kelas = row.kelas;
                    const userRole = row.role;

                    // let userRole = '';
                    // let role1 = '';
                    // let role2 = '';
                    // try {
                    //   if (isAdmin === '1') {
                    //     role1 = 'Admin';
                    //     if (role) {
                    //       role2 = roles.find((x) => x.code === role);
                    //       role2 = role2.label;
                    //       userRole = role1.concat(', ', role2);
                    //     } else {
                    //       userRole = role1;
                    //     }
                    //   } else {
                    //     role1 = roles.find((x) => x.code === role);
                    //     role1 = role1.label;
                    //     userRole = role1;
                    //   }
                    // } catch (e) {
                    //   console.log(e);
                    // }

                    const isItemSelected = selected.indexOf(noInduk) !== -1;

                    return (
                      <TableRow
                        hover
                        key={noInduk}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                        </TableCell> */}
                        <TableCell align="left">{noInduk}</TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {namaLengkap}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{username}</TableCell>
                        <TableCell align="left">{kelas}</TableCell>
                        <TableCell align="left">{userRole}</TableCell>
                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                        {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={statusUser === 'non-aktif' ? 'error' : 'success'}
                          >
                            {statusUser === 'non-aktif' ? 'Non Aktif' : 'Aktif'}
                          </Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <UsersMoreMenu
                            onDelete={() => handleOpenDeleteModal(noInduk)}
                            onUpdate={() => handleUpdateUser(row)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dummyUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <DialogAnimate open={open} onClose={handleCloseModal}>
          <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
          <DialogContent>
            <DialogContentText>Data akan terhapus secara permanen. Apakah anda yakin?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Kembali</Button>
            <Button onClick={() => handleDeleteUser(deleteIdUser)} autoFocus color="error">
              Yakin
            </Button>
          </DialogActions>
        </DialogAnimate>

        <DialogAnimate open={openErrorModal} onClose={handleCloseErrorModal}>
          <DialogTitle>Gagal menambah data</DialogTitle>
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
          </DialogContent>
        </DialogAnimate>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array?.filter((_user) => _user?.namaLengkap.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
