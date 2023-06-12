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
  getPenggajian,
  setCurrentPenggajian,
  resetPenggajian,
  getPenggajianStafInv,
} from '../../redux/slices/penggajian';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
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
  PenggajianListHead,
  PenggajianListToolbar,
  PenggajianMoreMenu,
  StatusPenggajianMoreMenu,
} from '../../sections/@dashboard/penggajian/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'kode_penggajian', label: 'Kode Penggajian', alignRight: false },
  { id: 'waktu_pembayaran_gaji', label: 'Waktu Pembayaran Gaji', alignRight: false },
  { id: 'awal_periode_penggajian', label: 'Awal Periode', alignRight: false },
  { id: 'akhir_periode_penggajian', label: 'Akhir Periode', alignRight: false },
  { id: 'status_penggajian', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function PenggajianList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { auth } = useAuth();
  console.log('AUTH ROLE', auth?.role);
  const [choosenRole, setChoosenRole] = useState(window.localStorage.getItem('choosenRole'));

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { penggajian } = useSelector((state) => state.penggajian);
  let penggajianList = [];
  try {
    penggajianList = JSON.parse(window.localStorage.getItem('penggajianList'));
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    const action = window.localStorage.getItem('action');
    window.localStorage.removeItem('currentPenggajian');
    const a = window.localStorage.getItem('choosenRole');
    setChoosenRole(a);
    console.log('action', action);
    try {
      dispatch(getPenggajianStafInv());
    } catch (e) {
      console.log(e);
    }
    if (action === 'create') {
      enqueueSnackbar('Berhasil menambah data');
      window.localStorage.removeItem('action');
    } else if (action === 'update') {
      enqueueSnackbar('Berhasil mengubah data');
      window.localStorage.removeItem('action');
    } else if (action === 'validasi') {
      enqueueSnackbar('Berhasil memvalidasi data');
      window.localStorage.removeItem('action');
    } else if (action === 'verifikasi') {
      enqueueSnackbar('Berhasil verifikasi data');
      window.localStorage.removeItem('action');
    } else if (action === 'tolak') {
      enqueueSnackbar('Berhasil menolak data');
      window.localStorage.removeItem('action');
    } else if (action === 'persetujuan') {
      enqueueSnackbar('Berhasil menyetujui data');
      window.localStorage.removeItem('action');
    }
    setLoading(false);
  }, [dispatch]);

  console.log('data', penggajian);
  console.log('penggajianList', penggajianList);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('kode_penggajian');
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

  const handleDetailPenggajian = (penggajian) => {
    console.log('DETAIL Penggajian LIST', penggajian);
    dispatch(setCurrentPenggajian(penggajian));
    window.localStorage.setItem('currentPenggajian', JSON.stringify(penggajian));

    if (penggajian.status_penggajian === '2') {
      window.localStorage.setItem('action', 'kirim_gaji');
    } else if (penggajian.status_penggajian !== '2') {
      window.localStorage.setItem('action', 'detail');
    }
  };

  const handleCreatePenggajian = () => {
    dispatch(resetPenggajian());
    window.localStorage.removeItem('currentPenggajian');
    window.localStorage.setItem('action', 'create');
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - penggajianList.length) : 0;

  const filteredPenggajian = applySortFilter(penggajianList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredPenggajian?.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  const title = 'Status Penggajian';

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: title }]}
        />
        <Card>
          <PenggajianListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <PenggajianListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={penggajianList?.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredPenggajian?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const kodePenggajian = row.kode_penggajian;
                    const waktuPembayaranGaji = row.waktu_pembayaran_gaji;
                    const awalPeriodePenggajian = row.awal_periode_penggajian;
                    const akhirPeriodePenggajian = row.akhir_periode_penggajian;
                    const keteranganPenggajian = row.keterangan_penggajian;
                    const generateDetail = row.generate_detail;
                    const generateLastUpdate = row.generate_last_updated;
                    const statusPenggajian = row.status_penggajian;
                    const namaStatusPenggajian = row.nama_status_penggajian;

                    const isItemSelected = selected.indexOf(kodePenggajian) !== -1;

                    return (
                      <TableRow
                        hover
                        key={kodePenggajian}
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
                            {kodePenggajian}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{waktuPembayaranGaji}</TableCell>
                        <TableCell align="left">{awalPeriodePenggajian}</TableCell>
                        <TableCell align="left">{akhirPeriodePenggajian}</TableCell>
                        <TableCell align="left">{namaStatusPenggajian}</TableCell>
                        <TableCell align="right">
                          <StatusPenggajianMoreMenu
                            onDetail={() => handleDetailPenggajian(row)}
                            role={choosenRole}
                            status={statusPenggajian}
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
            count={penggajianList?.length || 0}
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
    return array?.filter((mb) => mb.kode_penggajian.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}
