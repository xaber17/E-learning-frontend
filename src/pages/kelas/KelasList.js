import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
import { KelasListHead, KelasListToolbar, KelasMoreMenu } from '../../sections/@dashboard/kelas/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  //   { id: 'idKelas', label: 'ID Kelas', alignRight: false },
  { id: 'kelas', label: 'Kelas', alignRight: false },
  { id: 'deskripsi', label: 'Deskripsi', alignRight: false },
  { id: '' },
];

const dummyKelas = [
  { kelas: 'X.IPA.1', deskripsi: 'Angkatan Tahun 2023' },
  { kelas: 'X.IPS.1', deskripsi: 'Angkatan Tahun 2023' },
  { kelas: 'X.IPS.2', deskripsi: 'Angkatan Tahun 2023' },
];

export default function KelasList() {
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

  const filteredUsers = applySortFilter(dummyKelas, getComparator(order, orderBy), filterName);

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

  const handleOpenDeleteModal = (idUser) => {
    setDeleteIdUser(parseInt(idUser, 10));
    setOpen(true);
  };

  const handleUpdateUser = (user) => {
    console.log('UPDATE USER LIST', user);
    dispatch(setCurrentUser(user));
    window.localStorage.setItem('currentUser', JSON.stringify(user));
    window.localStorage.setItem('action', 'update');
  };

  return (
    <Page title="Kelas">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Kelas"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Kelas' }]}
          action={
            <Button
              //   onClick={() => handleCreateUser()}
              variant="contained"
              //   component={RouterLink}
              //   to={PATH_DASHBOARD.users.form}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tambah
            </Button>
          }
        />
        <Card>
          <KelasListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            // onDeleteUsers={() => handleDeleteMultiUser(selected)}
          />

          <Scrollbar>
            <TableContainer>
              <Table>
                <KelasListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dummyKelas.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const idKelas = row.idKelas;
                    const kelas = row.kelas;
                    const deskripsi = row.deskripsi;
                    const isItemSelected = selected.indexOf(idKelas) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idKelas}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                        </TableCell> */}
                        {/* <TableCell align="left">{idKelas}</TableCell> */}
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {kelas}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{deskripsi}</TableCell>
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
                          <KelasMoreMenu
                            onDelete={() => handleOpenDeleteModal(idKelas)}
                            onUpdate={() => handleUpdateUser(row)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
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
