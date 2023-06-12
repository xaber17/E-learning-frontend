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
  getAbsensi,
  setCurrentAbsensi,
  resetAbsensi,
  deleteAbsensi,
  getIndexValidasiAbsensi,
  tolakValidasiAbsensi,
  validasiAbsensi,
} from '../../redux/slices/absensi';
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
import { AbsensiListHead, AbsensiListToolbar, AbsensiMoreMenu } from '../../sections/@dashboard/absensi/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'nama_lengkap', label: 'Nama Lengkap', alignRight: false },
  { id: 'nip', label: 'NIP', alignRight: false },
  { id: 'waktu_masuk', label: 'Masuk', alignRight: false },
  { id: 'waktu_keluar', label: 'Keluar', alignRight: false },
  { id: 'keterangan_absensi', label: 'Keterangan Pekerjaan', alignRight: false },
  { id: 'jenis_absensi', label: 'Jenis Absensi', alignRight: false },
  { id: 'status_absensi', label: 'Status Absensi', alignRight: false },
  { id: '' },
];
// ----------------------------------------------------------------------

export default function AbsensiValidation() {
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const [open, setOpen] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteIdAbsensi, setDeleteIdAbsensi] = useState();
  let msg = '';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { absensi } = useSelector((state) => state.absensi);
  let absensiList = [];
  try {
    absensiList = JSON.parse(window.localStorage.getItem('absensiList'));
  } catch (e) {
    console.log(e);
  }
  // const [absensiList, setAbsensiList] = useState(absensi.data);

  useEffect(() => {
    const action = window.localStorage.getItem('action');
    window.localStorage.removeItem('currentAbsensi');
    try {
      dispatch(getIndexValidasiAbsensi());
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
    } else if (action === 'validasi'){
        enqueueSnackbar('Berhasil memvalidasi data');
        window.localStorage.removeItem('action');
    } else if (action === 'tolak') {
        enqueueSnackbar('Berhasil menolak data');
        window.localStorage.removeItem('action');
    }
    setLoading(false);
  }, [dispatch]);

  console.log('data', absensi);
  console.log('absensiList', absensiList);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('status_absensi');
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

  const handleDeleteAbsensi = async (idAbsensi) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.localStorage.setItem('action', 'delete');
    dispatch(deleteAbsensi(idAbsensi))
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          enqueueSnackbar('Berhasil menghapus data');
        }, 1000);

        setLoading(true);
        dispatch(getAbsensi());
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

  const handleValidasi = (data) => {
    console.log('DATA VALID', data);
    dispatch(validasiAbsensi(data.id_absensi, data));
    window.localStorage.setItem('action', 'validasi');
    window.location.reload();
  };

  const handleTolakValidasi = (data) => {
    console.log('DATA TOLAK', data);
    dispatch(tolakValidasiAbsensi(data.id_absensi, data));
    window.localStorage.setItem('action', 'tolak');
    window.location.reload();
  };

  const handleOpenDeleteModal = (idAbsensi) => {
    setDeleteIdAbsensi(parseInt(idAbsensi, 10));
    setOpen(true);
  };

  const handleDeleteMultiAbsensi = (selected) => {
    const deleteAbsensi = absensiList.filter((absensi) => !selected.includes(absensi.nama_absensi));
    setSelected([]);
    // setAbsensiList(deleteAbsensi);
  };

  const handleUpdateAbsensi = (absensi) => {
    console.log('UPDATE MASTER BAGIAN LIST', absensi);
    dispatch(setCurrentAbsensi(absensi));
    window.localStorage.setItem('currentAbsensi', JSON.stringify(absensi));
    window.localStorage.setItem('action', 'update');
  };

  const handleCreateAbsensi = () => {
    dispatch(resetAbsensi());
    window.localStorage.removeItem('currentAbsensi');
    window.localStorage.setItem('action', 'create');
  };

  const handleCloseModal = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - absensiList?.length) : 0;

  const filteredAbsensi = applySortFilter(absensiList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredAbsensi?.length && Boolean(filterName);

  // console.log("filteredAbsensi", filteredAbsensi);

  if (loading) {
    return <LoadingScreen />;
  }

  function Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <Page title="Validasi Absensi">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Validasi Absensi"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Validasi Absensi' }]}
        />
        <Card>
          <AbsensiListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteAbsensi={() => handleDeleteMultiAbsensi(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <AbsensiListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={absensiList?.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredAbsensi?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const idAbsensi = row.id_absensi;
                    const nip = row.nip;
                    const namaPegawai = row.nama_lengkap;
                    const waktuMasuk = row.waktu_masuk;
                    const waktuKeluar = row.waktu_keluar;
                    const keteranganAbsensi = row.keterangan_absensi;
                    const jenisAbsensi = row.jenis_absensi;
                    const namaJenisAbsensi = row.nama_jenis_absensi;
                    const statusAbsensi = row.status_absensi;
                    const namaStatusAbsensi = row.nama_status_absensi;
                    const isItemSelected = selected.indexOf(idAbsensi) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idAbsensi}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                        </TableCell> */}
                        <TableCell align="left">{namaPegawai}</TableCell>
                        <TableCell align="left">{nip}</TableCell>
                        <TableCell align="left">{waktuMasuk}</TableCell>
                        <TableCell align="left">{waktuKeluar}</TableCell>
                        <TableCell align="left">{keteranganAbsensi}</TableCell>
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(() => {
                              if (jenisAbsensi === 'hadir') return 'success';
                              if (jenisAbsensi === 'sakit') return 'error';
                              if (jenisAbsensi === 'izin') return 'secondary';
                              return 'warning';
                            })()}
                          >
                            {Capitalize(jenisAbsensi)}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{namaStatusAbsensi}</TableCell>
                        {statusAbsensi === 'belum_divalidasi' ? (
                          <TableCell align="center">
                            <Button color="primary" variant="contained" onClick={() => handleValidasi(row)}>
                              Validasi
                            </Button>
                            <Button color="error" variant="contained" onClick={() => handleTolakValidasi(row)}>
                              Tolak Validasi
                            </Button>
                          </TableCell>
                        ) : (
                          <TableCell align="right"> </TableCell>
                        )}
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
            count={absensiList?.length || 0}
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
            <Button onClick={() => handleDeleteAbsensi(deleteIdAbsensi)} autoFocus color="error">
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
    return array?.filter((mb) => mb.nama_absensi.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}
