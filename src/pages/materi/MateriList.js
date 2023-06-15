import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { useDispatch, useSelector } from '../../redux/store';

import { getUsers, setCurrentUser, resetUser, deleteUser } from '../../redux/slices/users';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';

// sections
import { DialogAnimate } from '../../components/animate';
import LoadingScreen from '../../components/LoadingScreen';
import SearchNotFound from '../../components/SearchNotFound';
import { MateriListHead, MateriListToolbar, MateriMoreMenu } from '../../sections/@dashboard/materi/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  //   { id: 'idMateri', label: 'ID Kelas', alignRight: false },
  { id: 'judul', label: 'Judul', alignRight: false },
  { id: 'guru', label: 'Guru', alignRight: false },
  { id: 'deskripsi', label: 'Deskripsi', alignRight: false },
  { id: 'kelas', label: 'Kelas', alignRight: false },
  { id: '' },
];

const dummyMateri = [
  { judul: 'Materi A', guru: 'Lizza', kelas: 'X.IPA.1', deskripsi: 'Deskripsi' },
  { judul: 'Materi B', guru: 'Dhiya', kelas: 'X.IPS.1', deskripsi: 'Deskripsi' },
  { judul: 'Materi C', guru: 'Didi', kelas: 'X.IPS.2', deskripsi: 'Deskripsi' },
];

export default function MateriList() {
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dummyMateri.length) : 0;

  const filteredUsers = applySortFilter(dummyMateri, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

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

  const handleCloseModal = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const handleOpenDeleteModal = (idMateri) => {
    setDeleteIdUser(parseInt(idMateri, 10));
    setOpen(true);
  };

  const handleUpdateUser = (user) => {
    console.log('UPDATE USER LIST', user);
    dispatch(setCurrentUser(user));
    window.localStorage.setItem('currentUser', JSON.stringify(user));
    window.localStorage.setItem('action', 'update');
  };

  return (
    <Page title="Materi">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Materi"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Materi' }]}
          action={
            <Button
              //   onClick={() => handleCreateUser()}
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.materi.form}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tambah
            </Button>
          }
        />
        <Card>
          <MateriListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            // onDeleteUsers={() => handleDeleteMultiUser(selected)}
          />

          <Scrollbar>
            <TableContainer>
              <Table>
                <MateriListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dummyMateri.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const idMateri = row.idMateri;
                    const judul = row.judul;
                    const guru = row.guru;
                    const kelas = row.kelas;
                    const deskripsi = row.deskripsi;
                    const isItemSelected = selected.indexOf(idMateri) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idMateri}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                        </TableCell> */}
                        {/* <TableCell align="left">{idMateri}</TableCell> */}
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {judul}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{guru}</TableCell>
                        <TableCell align="left">{deskripsi}</TableCell>
                        <TableCell align="left">{kelas}</TableCell>
                        {/* <TableCell align="left">{userRole}</TableCell> */}
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
                          <MateriMoreMenu
                            // onUpdate={() => handleUpdateUser(row)}  => handle detail materi
                            onDelete={() => handleOpenDeleteModal(idMateri)}
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
            count={dummyMateri.length}
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
