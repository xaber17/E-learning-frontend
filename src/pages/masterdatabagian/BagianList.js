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
  getMasterBagian,
  setCurrentMasterBagian,
  resetMasterBagian,
  deleteMasterBagian,
} from '../../redux/slices/masterBagian';
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
import { BagianListHead, BagianListToolbar, BagianMoreMenu } from '../../sections/@dashboard/masterdatabagian/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'namaBagian', label: 'Nama Bagian', alignRight: false },
  { id: 'statusBagian', label: 'Status', alignRight: false },
  { id: '' },
];
// ----------------------------------------------------------------------

export default function BagianList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [list, setList] = useState();
  const [open, setOpen] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteIdBagian, setDeleteIdBagian] = useState();
  let msg = '';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { masterBagian } = useSelector((state) => state.masterBagian);
  let masterBagianList = [];
  try {
    masterBagianList = masterBagian.data;
    console.log(masterBagianList);
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    setLoading(true);
    const action = window.localStorage.getItem('action');
    window.localStorage.removeItem('currentMasterBagian');
    try {
      dispatch(getMasterBagian());
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
  //   window.localStorage.removeItem('currentMasterBagian')
  //   console.log('action', action);
  //   try {
  //     dispatch(getMasterBagian());
  //     const list = JSON.parse(window.localStorage.getItem('bagianList'));
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

  // const { masterBagian } = useSelector((state) => state.masterBagian);

  // console.log(masterBagian);
  console.log(_userList);
  console.log(list);

  // const [masterBagianList, setMasterBagianList] = useState(masterBagian.data);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id_bagian');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = masterBagianList.map((n) => n.nama_bagian);
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

  const handleDeleteMasterBagian = async (idBagian) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.localStorage.setItem('action', 'delete');
    dispatch(deleteMasterBagian(idBagian))
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          enqueueSnackbar('Berhasil menghapus data');
        }, 1000);

        setLoading(true);
        dispatch(getMasterBagian());
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

  const handleOpenDeleteModal = (idBagian) => {
    setDeleteIdBagian(parseInt(idBagian, 10));
    setOpen(true);
  };

  const handleDeleteMultiMasterBagian = (selected) => {
    const deleteMasterBagian = masterBagianList.filter((bagian) => !selected.includes(bagian.nama_bagian));
    setSelected([]);
    // setMasterBagianList(deleteMasterBagian);
  };

  const handleUpdateMasterBagian = (masterBagian) => {
    console.log('UPDATE MASTER BAGIAN LIST', masterBagian);
    dispatch(setCurrentMasterBagian(masterBagian));
    window.localStorage.setItem('currentMasterBagian', JSON.stringify(masterBagian));
    window.localStorage.setItem('action', 'update');
  };

  const handleCreateMasterBagian = () => {
    dispatch(resetMasterBagian());
    window.localStorage.removeItem('currentMasterBagian');
    window.localStorage.setItem('action', 'create');
  };

  const handleCloseModal = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - masterBagianList.length) : 0;

  const filteredMasterBagian = applySortFilter(masterBagianList, getComparator(order, orderBy), filterName);
  console.log('masterBagianList', masterBagianList);
  console.log('filteredMasterBagian', filteredMasterBagian);
  const isNotFound = !filteredMasterBagian?.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Master Bagian">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Master Bagian"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Master Bagian' }]}
          action={
            <Button
              onClick={() => handleCreateMasterBagian()}
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.masterdataBagian.form}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tambah
            </Button>
          }
        />
        <Card>
          <BagianListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteMasterBagian={() => handleDeleteMultiMasterBagian(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <BagianListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={masterBagianList?.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredMasterBagian?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const idBagian = row.id_bagian;
                    const namaBagian = row.nama_bagian;
                    const statusBagian = row.status_bagian;

                    const isItemSelected = selected.indexOf(idBagian) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idBagian}
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
                            {namaBagian}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={statusBagian === 'non-aktif' ? 'error' : 'success'}
                          >
                            {statusBagian === 'non-aktif' ? 'Non Aktif' : 'Aktif'}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <BagianMoreMenu
                            onDelete={() => handleOpenDeleteModal(idBagian)}
                            onUpdate={() => handleUpdateMasterBagian(row)}
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
            count={masterBagianList?.length || 0}
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
            <Button onClick={() => handleDeleteMasterBagian(deleteIdBagian)} autoFocus color="error">
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
    return array?.filter((mb) => mb.nama_bagian.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}
