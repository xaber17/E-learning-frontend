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
  getMasterTarifPtkp,
  setCurrentMasterTarifPtkp,
  resetMasterTarifPtkp,
  deleteMasterTarifPtkp,
} from '../../redux/slices/masterTarifPtkp';
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
  TarifPtkpListHead,
  TarifPtkpListToolbar,
  TarifPtkpMoreMenu,
} from '../../sections/@dashboard/masterdatatarifptkp/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'kode_tarifptkp', label: 'Kode Tarif PTKP', alignRight: false },
  { id: 'besaran_tarifptkp', label: 'Besaran Tarif PTKP', alignRight: false },
  { id: 'keterangan_tarifptkp', label: 'Keterangan', alignRight: false },
  { id: 'status_tarifptkp', label: 'Status', alignRight: false },
  { id: '' },
];
// ----------------------------------------------------------------------

export default function TarifPtkpList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [list, setList] = useState();
  const [open, setOpen] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteIdTarifPtkp, setDeleteIdTarifPtkp] = useState();
  let msg = '';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { masterTarifPtkp } = useSelector((state) => state.masterTarifPtkp);
  let masterTarifPtkpList = [];
  try {
    masterTarifPtkpList = masterTarifPtkp.data;
    console.log(masterTarifPtkpList);
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    setLoading(true);
    const action = window.localStorage.getItem('action');
    window.localStorage.removeItem('currentmasterTarifPtkp');
    try {
      dispatch(getMasterTarifPtkp());
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
  //   window.localStorage.removeItem('currentMasterTarifPtkp')
  //   console.log('action', action);
  //   try {
  //     dispatch(getMasterTarifPtkp());
  //     const list = JSON.parse(window.localStorage.getItem('tarifPtkpList'));
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

  // const { masterTarifPtkp } = useSelector((state) => state.masterTarifPtkp);

  // console.log(masterTarifPtkp);
  console.log(_userList);
  console.log(list);

  // const [masterTarifPtkpList, setMasterTarifPtkpList] = useState(masterTarifPtkp?.data);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id_tarifptkp');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = masterTarifPtkpList.map((n) => n.nama_tarifptkp);
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

  const handleDeleteMasterTarifPtkp = async (idTarifPtkp) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.localStorage.setItem('action', 'delete');
    dispatch(deleteMasterTarifPtkp(idTarifPtkp))
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          enqueueSnackbar('Berhasil menghapus data');
        }, 1000);

        setLoading(true);
        dispatch(getMasterTarifPtkp());
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

  const handleOpenDeleteModal = (idTarifPtkp) => {
    setDeleteIdTarifPtkp(parseInt(idTarifPtkp, 10));
    setOpen(true);
  };

  const handleDeleteMultiMasterTarifPtkp = (selected) => {
    const deleteMasterTarifPtkp = masterTarifPtkpList.filter(
      (tarifPtkp) => !selected.includes(tarifPtkp.kode_tarifptkp)
    );
    setSelected([]);
    // setMasterTarifPtkpList(deleteMasterTarifPtkp);
  };

  const handleUpdateMasterTarifPtkp = (masterTarifPtkp) => {
    console.log('UPDATE MASTER TARIF PTKP LIST', masterTarifPtkp);
    dispatch(setCurrentMasterTarifPtkp(masterTarifPtkp));
    window.localStorage.setItem('currentMasterTarifPtkp', JSON.stringify(masterTarifPtkp));
    window.localStorage.setItem('action', 'update');
  };

  const handleCreateMasterTarifPtkp = () => {
    dispatch(resetMasterTarifPtkp());
    window.localStorage.removeItem('currentMasterTarifPtkp');
    window.localStorage.setItem('action', 'create');
  };

  const handleCloseModal = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - masterTarifPtkpList.length) : 0;

  const filteredMasterTarifPtkp = applySortFilter(masterTarifPtkpList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredMasterTarifPtkp?.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Master Tarif PTKP">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Master Tarif PTKP"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Master Tarif PTKP' }]}
          action={
            <Button
              onClick={() => handleCreateMasterTarifPtkp()}
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.masterdataTarifPtkp.form}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tambah
            </Button>
          }
        />
        <Card>
          <TarifPtkpListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteMasterTarifPtkp={() => handleDeleteMultiMasterTarifPtkp(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TarifPtkpListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={masterTarifPtkpList?.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredMasterTarifPtkp?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const idTarifPtkp = row.id_tarifptkp;
                    const kodeTarifPtkp = row.kode_tarifptkp;
                    const besaranTarifPtkp = row.besaran_tarifptkp;
                    const keteranganTarifPtkp = row.keterangan_tarifptkp;
                    const statusTarifPtkp = row.status_tarifptkp;

                    const format = besaranTarifPtkp.toString().split('').reverse().join('');
                    const convert = format.match(/\d{1,3}/g);
                    const rupiah = convert.join('.').split('').reverse().join('');
                    const besaran = `Rp ${rupiah}`;

                    const isItemSelected = selected.indexOf(idTarifPtkp) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idTarifPtkp}
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
                            {kodeTarifPtkp}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{besaran}</TableCell>
                        <TableCell align="left">{keteranganTarifPtkp}</TableCell>
                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={statusTarifPtkp === 'non-aktif' ? 'error' : 'success'}
                          >
                            {statusTarifPtkp === 'non-aktif' ? 'Non Aktif' : 'Aktif'}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <TarifPtkpMoreMenu
                            onDelete={() => handleOpenDeleteModal(idTarifPtkp)}
                            onUpdate={() => handleUpdateMasterTarifPtkp(row)}
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
            count={masterTarifPtkpList?.length || 0}
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
            <Button onClick={() => handleDeleteMasterTarifPtkp(deleteIdTarifPtkp)} autoFocus color="error">
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
    return array?.filter((mb) => mb.kode_tarifptkp.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}
