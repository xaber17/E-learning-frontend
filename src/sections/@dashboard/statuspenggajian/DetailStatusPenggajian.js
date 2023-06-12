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

import { useDispatch, useSelector } from '../../../redux/store';

import {
  generatePenggajianDetail,
  getPenggajianDetail,
  updatePenggajianDetail,
  setCurrentPenggajianDetail,
} from '../../../redux/slices/penggajian';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// _mock_
import { _userList } from '../../../_mock';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { DialogAnimate } from '../../../components/animate';
import LoadingScreen from '../../../components/LoadingScreen';
// sections
import { DetailStatusPenggajianListHead, DetailStatusPenggajianListToolbar } from './list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'nip', label: 'NIP', alignRight: false },
  { id: 'nama_lengkap', label: 'Nama', alignRight: false },
  { id: 'no_rekening', label: 'No. Rekening', alignRight: false },
  { id: 'nama_bank', label: 'Nama Bank', alignRight: false },
  { id: 'gaji_bersih', label: 'Gaji Bersih (Rp)', alignRight: false },
];

// ----------------------------------------------------------------------

export default function DetailStatusPenggajian({ currentData }) {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [kirimGaji, setKirimGaji] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [penggajianDetailList, setCurrentPenggajianDetail] = useState(currentData.data);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = penggajianDetailList?.map((n) => n.id_penggajian_detail);
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

  const handleDeleteUser = (userId) => {
    const deleteUser = penggajianDetailList?.filter((user) => user.id !== userId);
    setSelected([]);
    setKirimGaji(deleteUser);
  };

  const handleKirimPenggajian = (selected) => {
    const selectedPenggajianDetail = penggajianDetailList?.filter((pd) => !selected.includes(pd.id_penggajian_detail));
    setSelected([]);
    setKirimGaji(selectedPenggajianDetail);
  };

  const currency = (val) => {
    const format = val.toString().split('').reverse().join('');
    const convert = format.match(/\d{1,3}/g);
    const rupiah = convert.join('.').split('').reverse().join('');
    const besaran = `Rp ${rupiah}`;

    return besaran;
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - penggajianDetailList?.length) : 0;

  const filteredPenggajianDetail = applySortFilter(penggajianDetailList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredPenggajianDetail?.length && Boolean(filterName);

  return (
    <Page title="Detail Status Penggajian">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <DetailStatusPenggajianListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onUpdate={() => handleKirimPenggajian(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DetailStatusPenggajianListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={penggajianDetailList?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredPenggajianDetail.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const kodePenggajian = row.kode_penggajian;
                    const idPenggajianDetail = row.id_penggajian_detail;
                    const nip = row.nip;
                    const namaLengkap = row.nama_lengkap;
                    const noRekening = row.no_rek;
                    const namaBank = row.nama_bank;
                    const gajiPokokBulan = currency(row.gaji_pokok_bulan);
                    const jenisPegawaiBulan = row.jenis_pegawai_bulan;
                    const metodePajakBulan = row.metode_pajak_bulan;
                    const tunjanganBulan = currency(row.tunjangan_bulan);
                    const totalTunjanganBpjs = currency(row.total_tunjangan_bpjs);
                    const bonusBulan = currency(row.bonus_bulan);
                    const pengurangan = currency(row.total_pengurangan);
                    const pph = currency(row.pph_gaji_thr);
                    const pemotongan = currency(row.pemotongan_bulan);
                    const gantiRugi = currency(row.ganti_rugi);
                    const pinjaman = currency(row.pinjaman);
                    const denda = currency(row.denda);
                    const gajiBersih = currency(row.gaji_bersih);
                    const isItemSelected = selected.indexOf(idPenggajianDetail) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idPenggajianDetail}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(idPenggajianDetail)} />
                        </TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {nip}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{namaLengkap}</TableCell>
                        <TableCell align="left">{noRekening}</TableCell>
                        <TableCell align="left">{namaBank}</TableCell>
                        <TableCell align="left">{gajiBersih}</TableCell>
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
            count={penggajianDetailList?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
    return array.filter((_pd) => _pd?.id_penggajian_detail.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}
