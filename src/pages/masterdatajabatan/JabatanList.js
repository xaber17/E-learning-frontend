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

import {
  getMasterJabatan,
  setCurrentMasterJabatan,
  resetMasterJabatan,
  deleteMasterJabatan,
} from '../../redux/slices/masterJabatan';
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
import {
  JabatanListHead,
  JabatanListToolbar,
  JabatanMoreMenu,
} from '../../sections/@dashboard/masterdatajabatan/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'namaJabatan', label: 'Nama Jabatan', alignRight: false },
  { id: 'namaBagian', label: 'Nama Bagian', alignRight: false },
  { id: 'namaAtasan', label: 'Atasan', alignRight: false },
  { id: 'statusStruktur', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function JabatanList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [list, setList] = useState();
  const [open, setOpen] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteIdJabatan, setDeleteIdJabatan] = useState();
  let msg = '';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { masterJabatan } = useSelector((state) => state.masterJabatan);
  let masterJabatanList = [];
  try {
    masterJabatanList = masterJabatan?.data;
    console.log(masterJabatanList);
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    const action = window.localStorage.getItem('action');
    window.localStorage.removeItem('currentMasterJabatan');
    try {
      dispatch(getMasterJabatan());
    } catch (e) {
      console.log(e);
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

  console.log(_userList);
  console.log(list);

  // const [masterJabatanList, setMasterJabatanList] = useState(masterJabatan.data);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id_jabatan');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = masterJabatanList.map((n) => n.name);
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

  const handleDeleteMasterJabatan = async (idJabatan) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.localStorage.setItem('action', 'delete');
    dispatch(deleteMasterJabatan(idJabatan))
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          enqueueSnackbar('Berhasil menghapus data');
        }, 1000);

        setLoading(true);
        dispatch(getMasterJabatan());
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

  const handleOpenDeleteModal = (idJabatan) => {
    setDeleteIdJabatan(parseInt(idJabatan, 10));
    setOpen(true);
  };

  const handleDeleteMultiMasterJabatan = (selected) => {
    const deleteMasterJabatan = masterJabatanList.filter((x) => !selected.includes(x.nama_jabatan));
    setSelected([]);
    // setMasterJabatanList(deleteMasterJabatan);
  };

  const handleUpdateMasterJabatan = (masterJabatan) => {
    console.log('UPDATE MASTER JABATAN LIST', masterJabatan);
    dispatch(setCurrentMasterJabatan(masterJabatan));
    window.localStorage.setItem('currentMasterJabatan', JSON.stringify(masterJabatan));
    window.localStorage.setItem('action', 'update');
  };

  const handleCreateMasterJabatan = () => {
    dispatch(resetMasterJabatan());
    window.localStorage.removeItem('currentMasterJabatan');
    window.localStorage.setItem('action', 'create');
  };

  const handleCloseModal = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - masterJabatanList?.length) : 0;

  const filteredMasterJabatan = applySortFilter(masterJabatanList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredMasterJabatan?.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Jabatan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Master Jabatan"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Jabatan' }]}
          action={
            <Button
              onClick={() => handleCreateMasterJabatan()}
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.masterdataJabatan.form}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tambah
            </Button>
          }
        />
        <Card>
          <JabatanListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDelete={() => handleDeleteMultiMasterJabatan(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <JabatanListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={masterJabatanList?.length || 0}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredMasterJabatan?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const idJabatan = row.id_jabatan;
                    const namaJabatan = row.nama_jabatan;
                    const idBagian = row.id_bagian;
                    const namaBagian = row.nama_bagian;
                    const kodeAtasan = row.kode_atasan;
                    const namaAtasan = row.nama_atasan;
                    const statusJabatan = row.status_jabatan;
                    const isItemSelected = selected.indexOf(idJabatan) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idJabatan}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                        </TableCell> */}
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {namaJabatan}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{namaBagian}</TableCell>
                        <TableCell align="left">{namaAtasan ?? 'Tidak Ada'}</TableCell>
                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={statusJabatan === 'non-aktif' ? 'error' : 'success'}
                          >
                            {statusJabatan === 'non-aktif' ? 'Non Aktif' : 'Aktif'}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <JabatanMoreMenu
                            onDelete={() => handleOpenDeleteModal(idJabatan)}
                            onUpdate={() => handleUpdateMasterJabatan(row)}
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
            count={masterJabatanList?.length || 0}
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
            <Button onClick={() => handleDeleteMasterJabatan(deleteIdJabatan)} autoFocus color="error">
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
    return array?.filter((_user) => _user.nama_lengkap.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}
