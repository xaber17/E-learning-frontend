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
  getPenilaianKinerja,
  setCurrentPenilaianKinerja,
  resetPenilaianKinerja,
} from '../../redux/slices/penilaianKinerja';
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
import { PenilaianKinerjaListHead, PenilaianKinerjaListToolbar, PenilaianKinerjaMoreMenu } from '../../sections/@dashboard/penilaiankinerja/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'nama_lengkap', label: 'Nama Lengkap', alignRight: false },
  { id: 'nip', label: 'NIP', alignRight: false },
  { id: 'nama_bagian', label: 'Bagian', alignRight: false },
  { id: 'nama_jabatan', label: 'Jabatan', alignRight: false },
  { id: 'waktu_penilaian', label: 'Waktu Penilaian', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function PenilaianKinerjaList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [list, setList] = useState();
  const [open, setOpen] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { penilaianKinerja } = useSelector((state) => state.penilaianKinerja);
  let penilaianKinerjaList = [];
  try {
    penilaianKinerjaList = penilaianKinerja?.data;
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    const action = window.localStorage.getItem('action');
    window.localStorage.removeItem('currentPenilaianKinerja')
    console.log('action', action);
    try {
      dispatch(getPenilaianKinerja());
      const list = JSON.parse(window.localStorage.getItem('penilaianKinerjaList'));
      if (list) {
        setList(list);
      }
    } catch (e) {
      console.log(e);
    }
    if (action === 'create') {
      enqueueSnackbar('Berhasil menambah data');
      window.localStorage.removeItem('action');
    } 
    setLoading(false);
  }, [dispatch]);

  console.log(penilaianKinerja);
  console.log(_userList);
  console.log(list);
  
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id_penilaian_kinerja');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = penilaianKinerjaList.map((n) => n.id_penilaian_kinerja);
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


  const handleViewPenilaianKinerja = (penilaianKinerja) => {
    console.log('VIEW PENILAIAN KINERJA LIST', penilaianKinerja);
    dispatch(setCurrentPenilaianKinerja(penilaianKinerja));
    window.localStorage.setItem('currentPenilaianKinerja', JSON.stringify(penilaianKinerja));
    window.localStorage.setItem('action', 'view');
  };

  const handleCreatePenilaianKinerja = () => {
    dispatch(resetPenilaianKinerja());
    window.localStorage.removeItem('currentPenilaianKinerja');
    window.localStorage.setItem('action', 'create');
  };

  const handleCloseModal = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - penilaianKinerjaList.length) : 0;

  const filteredPenilaianKinerja = applySortFilter(penilaianKinerjaList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredPenilaianKinerja?.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Penilaian Kinerja">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Penilaian Kinerja"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Penilaian Kinerja' }]}
          action={
            <Button
              onClick={() => handleCreatePenilaianKinerja()}
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.penilaianKinerja.form}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tambah
            </Button>
          }
        />
        <Card>
          <PenilaianKinerjaListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <PenilaianKinerjaListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={penilaianKinerjaList?.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredPenilaianKinerja?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const idPenilaianKinerja = row.id_penilaian_kinerja;
                    const namaLengkap =  row.nama_lengkap;
                    const nip = row.nip;
                    const namaBagian = row.nama_bagian;
                    const namaJabatan =  row.nama_jabatan;
                    const waktuPenilaian = row. waktu_penilaian

                    const isItemSelected = selected.indexOf(idPenilaianKinerja) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idPenilaianKinerja}
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
                            {namaLengkap}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{nip}</TableCell>
                        <TableCell align="left">{namaBagian}</TableCell>
                        <TableCell align="left">{namaJabatan}</TableCell>
                        <TableCell align="left">{waktuPenilaian}</TableCell>
                     

                        <TableCell align="right">
                          <PenilaianKinerjaMoreMenu
                            onView={() => handleViewPenilaianKinerja(row)}
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
            count={penilaianKinerjaList?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

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
    return array?.filter((mb) => mb.nip.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}
