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

// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { DialogAnimate } from '../../../components/animate';
import LoadingScreen from '../../../components/LoadingScreen';
// sections
import { PenggajianDetailListHead, PenggajianDetailListToolbar, PenggajianDetailMoreMenu } from './list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'nip', label: 'NIP', alignRight: false },
  { id: 'nama_lengkap', label: 'Nama Pegawai', alignRight: false },
  { id: 'jumlah_absensi', label: 'Jumlah Kehadiran', alignRight: false },
  { id: 'jam_lembur_harikerja', label: 'Jam Lembur Kerja', alignRight: false },
  { id: 'jam_lembur_harikerja', label: 'Jam Lembur Libur', alignRight: false },
  { id: 'jenis_pegawai', label: 'Jenis Pegawai', alignRight: false },
  { id: 'metode_pajak', label: 'Metode Pajak', alignRight: false },
  { id: 'gaji_pokok_bulan', label: 'Gaji Pokok', alignRight: false },
  { id: 'tunjangan_tidak_tetap', label: 'Tunjangan Tidak Tetap', alignRight: false },
  { id: 'tunjangan_tetap', label: 'Tunjangan BPJS', alignRight: false },
  { id: 'bonus_thr', label: 'Bonus/THR', alignRight: false },
  { id: 'nominal_tun_pajak_bonusthr', label: 'Tunjangan Pajak atas Bonus/THR', alignRight: false },
  { id: 'pengurangan', label: 'Pengurangan(Pajak)', alignRight: false },
  { id: 'pph_21', label: 'PPh21', alignRight: false },
  { id: 'total_potongan', label: 'Total Potongan', alignRight: false },
  { id: 'gaji_bersih', label: 'Gaji Bersih', alignRight: false },
  { id: 'budget_gaji', label: 'Budget Gaji', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function PenggajianDetailList({ currentData, action }) {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [openErrorModal, setOpenErrorModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

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

  const handleTunjanganLain = (penggajianDetail) => {
    console.log('UPDATE TUNJANGAN LAIN LIST', penggajianDetail);
    dispatch(setCurrentPenggajianDetail(penggajianDetail));
    window.localStorage.setItem('currentPenggajianDetail', JSON.stringify(penggajianDetail));
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const currency = (val) => {
    const format = val.toString().split('').reverse().join('');
    const convert = format.match(/\d{1,3}/g);
    const rupiah = convert.join('.').split('').reverse().join('');
    const besaran = `Rp ${rupiah}`;

    return besaran;
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - currentData.length) : 0;

  const filteredPenggajian = applySortFilter(currentData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredPenggajian?.length && Boolean(filterName);

  return (
    <>
      <PenggajianDetailListToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
      />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <PenggajianDetailListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={currentData?.length}
              // numSelected={selected.length}
              onRequestSort={handleRequestSort}
              // onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredPenggajian?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const kodePenggajian = row.kode_penggajian;
                const nip = row.nip;
                const namaLengkap = row.nama_lengkap;
                const jumlahAbsensi = row.jumlah_absensi;
                const jamLemburLibur = row.jam_lembur_harilibur;
                const jamLemburKerja = row.jam_lembur_harikerja;
                const jenisPegawaiBulan = row.jenis_pegawai_bulan;
                const metodePajakBulan = row.metode_pajak_bulan;
                const gajiPokokBulan = currency(row.gaji_pokok_bulan);
                const tunjanganTidakTetap = currency(row.tunjangan_tidak_tetap);
                const tunjanganTetap = currency(row.tunjangan_tetap);
                const bonusThr = currency(row.bonus_thr);
                const tunjanganPajakBonusThr = currency(row.nominal_tun_pajak_bonusthr);
                const pengurangan = currency(row.pengurangan_sebulan);
                const pph21 = currency(row.pph_21);
                const totalPotongan = currency(row.total_potongan);
                const gajiBersih = currency(row.gaji_bersih);
                const budgetGaji = currency(row.budget_gaji);
                const isItemSelected = selected.indexOf(nip) !== -1;

                return (
                  <TableRow
                    hover
                    key={nip}
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
                        {nip}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">{namaLengkap}</TableCell>
                    <TableCell align="left">{jumlahAbsensi}</TableCell>
                    <TableCell align="left">{jamLemburKerja}</TableCell>
                    <TableCell align="left">{jamLemburLibur}</TableCell>
                    <TableCell align="left">{jenisPegawaiBulan === 'tetap' ? 'Tetap' : 'Tidak Tetap'}</TableCell>
                    <TableCell align="left">
                      {metodePajakBulan === 'gross' ? 'Gross' : [metodePajakBulan === 'grossup' ? 'Gross Up' : 'Nett']}
                    </TableCell>
                    <TableCell align="left">{gajiPokokBulan}</TableCell>
                    <TableCell align="left">{tunjanganTidakTetap}</TableCell>
                    <TableCell align="left">{tunjanganTetap}</TableCell>
                    <TableCell align="left">{bonusThr}</TableCell>
                    <TableCell align="left">{tunjanganPajakBonusThr}</TableCell>
                    <TableCell align="left">{pengurangan}</TableCell>
                    <TableCell align="left">{pph21}</TableCell>
                    <TableCell align="left">{totalPotongan}</TableCell>
                    <TableCell align="left">{gajiBersih}</TableCell>
                    <TableCell align="left">{budgetGaji}</TableCell>
                    {action === 'update' && (
                      <TableCell align="right">
                        <PenggajianDetailMoreMenu onDetail={() => handleTunjanganLain(row)} />
                      </TableCell>
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
        count={currentData?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, page) => setPage(page)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <DialogAnimate open={openErrorModal} onClose={handleCloseErrorModal}>
        <DialogTitle>Gagal menambah data</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
      </DialogAnimate>
    </>
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
