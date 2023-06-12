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
  getLembur,
  setCurrentLembur,
  resetLembur,
} from '../../redux/slices/lembur';
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
import { LemburListHead, LemburListToolbar, LemburMoreMenu } from '../../sections/@dashboard/lembur/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'nama_lengkap', label: 'Nama Lengkap', alignRight: false },
  { id: 'nip', label: 'NIP', alignRight: false },
  { id: 'waktu_masuk_lembur', label: 'Waktu Masuk Lembur', alignRight: false },
  { id: 'waktu_keluar_lembur', label: 'Waktu Keluar Lembur', alignRight: false },
  { id: 'keterangan_lembur', label: 'Keterangan Lembur', alignRight: false },
  { id: 'jenis_lembur', label: 'Jenis Lembur', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function LemburList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [list, setList] = useState();
  const [open, setOpen] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { lembur } = useSelector((state) => state.lembur);
  let lemburList = [];
  try {
    lemburList = lembur?.data;
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    const action = window.localStorage.getItem('action');
    window.localStorage.removeItem('currentLembur')
    console.log('action', action);
    try {
      dispatch(getLembur());
      const list = JSON.parse(window.localStorage.getItem('lemburList'));
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

  console.log(lembur);
  console.log(_userList);
  console.log(list);
  
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id_lembur');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = lemburList.map((n) => n.id_lembur);
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


  const handleViewLembur = (lembur) => {
    console.log('VIEW LEMBUR LIST', lembur);
    dispatch(setCurrentLembur(lembur));
    window.localStorage.setItem('currentLembur', JSON.stringify(lembur));
    window.localStorage.setItem('action', 'view');
  };

  const handleCreateLembur = () => {
    dispatch(resetLembur());
    window.localStorage.removeItem('currentLembur');
    window.localStorage.setItem('action', 'create');
  };

  const handleCloseModal = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - lemburList.length) : 0;

  const filteredLembur = applySortFilter(lemburList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredLembur?.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Lembur">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Lembur"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Lembur' }]}
          action={
            <Button
              onClick={() => handleCreateLembur()}
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.lembur.form}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tambah
            </Button>
          }
        />
        <Card>
          <LemburListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <LemburListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={lemburList?.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredLembur?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const idLembur = row.id_lembur;
                    const namaLengkap =  row.nama_lengkap;
                    const nip = row.nip;
                    const waktuMasukLembur = row.waktu_masuk_lembur;
                    const waktuKeluarLembur =  row.waktu_keluar_lembur;
                    const keteranganLembur = row. keterangan_lembur;
                    const jenisLembur = row.nama_jenis_lembur;

                    const isItemSelected = selected.indexOf(idLembur) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idLembur}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                        </TableCell> */}
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          {/* <Typography variant="subtitle2" noWrap> */}
                            {namaLengkap}
                          {/* </Typography> */}
                        </TableCell>
                        <TableCell align="left">{nip}</TableCell>
                        <TableCell align="left">{waktuMasukLembur}</TableCell>
                        <TableCell align="left">{waktuKeluarLembur}</TableCell>
                        <TableCell align="left">{keteranganLembur}</TableCell>
                        <TableCell align="left">{jenisLembur}</TableCell>
                     

                        <TableCell align="right">
                          <LemburMoreMenu
                            onView={() => handleViewLembur(row)}
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
            count={lemburList?.length || 0}
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
