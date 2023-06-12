import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Button,
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
  getGajiPokokTunjangan,
  setCurrentGajiPokokTunjangan,
  resetGajiPokokTunjangan,
} from '../../redux/slices/gajiPokokTunjangan';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
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
  GajiPokokTunjanganMoreMenu,
  GajiPokokTunjanganListHead,
  GajiPokokTunjanganListToolbar,
} from '../../sections/@dashboard/gajipokoktunjangan/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'nama_lengkap', label: 'Nama Lengkap', alignRight: false },
  { id: 'nip', label: 'NIP', alignRight: false },
  { id: 'bagian', label: 'Bagian', alignRight: false },
  { id: 'jabatan', label: 'Jabatan', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function GajiPokokTunjanganList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [list, setList] = useState();
  const [open, setOpen] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { gajiPokokTunjangan } = useSelector((state) => state.gajiPokokTunjangan);
  let gajiPokokTunjanganList = [];
  try {
    gajiPokokTunjanganList = gajiPokokTunjangan.data;
    console.log(gajiPokokTunjanganList);
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    const action = window.localStorage.getItem('action');
    window.localStorage.removeItem('currentGajiPokokTunjangan');
    console.log('action', action);
    try {
      dispatch(getGajiPokokTunjangan());
    } catch (e) {
      console.log(e);
    }
    if (action === 'update') {
      enqueueSnackbar('Berhasil mengubah data');
      window.localStorage.removeItem('action');
    }
    setLoading(false);
  }, [dispatch]);

  console.log(gajiPokokTunjangan);
  console.log(list);

  // const [gajiPokokTunjanganList, setGajiPokokTunjanganList] = useState(gajiPokokTunjangan.data);
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

  const handleUpdateGajiPokokTunjangan = (gajiPokokTunjangan) => {
    console.log('UPDATE Gaji Pokok dan Tunjangan LIST', gajiPokokTunjangan);
    dispatch(setCurrentGajiPokokTunjangan(gajiPokokTunjangan));
    window.localStorage.setItem('currentGajiPokokTunjangan', JSON.stringify(gajiPokokTunjangan));
    window.localStorage.setItem('action', 'update');
  };

  const handleCloseModal = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - gajiPokokTunjanganList.length) : 0;

  const filteredGajiPokokTunjangan = applySortFilter(gajiPokokTunjanganList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredGajiPokokTunjangan?.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Gaji Pokok dan Tunjangan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Gaji Pokok dan Tunjangan"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Gaji Pokok dan Tunjangan' }]}
        />
        <Card>
          <GajiPokokTunjanganListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <GajiPokokTunjanganListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={gajiPokokTunjanganList?.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredGajiPokokTunjangan
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const idGajiPokokTunjangan = row.id_gajipokok_tunjangan;
                      const namaLengkap = row.nama_lengkap;
                      const nip = row.nip;
                      const namaBagian = row.nama_bagian;
                      const namaJabatan = row.nama_jabatan;
                      const waktuPenilaian = row.waktu_penilaian;

                      const isItemSelected = selected.indexOf(idGajiPokokTunjangan) !== -1;

                      return (
                        <TableRow
                          hover
                          key={idGajiPokokTunjangan}
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
                          <TableCell align="right">
                            <GajiPokokTunjanganMoreMenu onUpdate={() => handleUpdateGajiPokokTunjangan(row)} />
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
            count={gajiPokokTunjanganList?.length || 0}
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
