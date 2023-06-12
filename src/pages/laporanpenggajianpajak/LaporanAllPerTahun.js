import { sentenceCase } from 'change-case';
import { useSnackbar } from 'notistack';
import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { DownloadTableExcel } from 'react-export-table-to-excel';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  Container,
  Typography,
  TableContainer,
  Stack,
  TablePagination,
  Paper,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { DialogAnimate } from '../../components/animate';
// sections
import {
  LaporanPenggajianPajakListHead,
  LaporanPenggajianPajakListToolbar,
  LaporanPenggajianPajakMoreMenu,
} from '../../sections/@dashboard/laporanpenggajianpajak';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'nip', label: 'NIP', alignRight: false },
  { id: 'nama_lengkap', label: 'Nama Pegawai', alignRight: false },
  { id: 'jenis_pegawai', label: 'Jenis Pegawai', alignRight: false },
  { id: 'metode_pajak', label: 'Metode Pajak', alignRight: false },
  { id: 'gaji_pokok_setahun', label: 'Gaji Pokok', alignRight: false },
  { id: 'tunjangan_setahun', label: 'Tunjangan Tidak Tetap', alignRight: false },
  { id: 'total_tunjangan_bpjs', label: 'Tunjangan BPJS', alignRight: false },
  { id: 'bonus_setahun', label: 'Bonus/THR', alignRight: false },
  { id: 'total_pengurangan', label: 'Pengurangan', alignRight: false },
  { id: 'pph_gaji_thr', label: 'PPh 21', alignRight: false },
  { id: 'selisih', label: 'Selisih PPh 21 Tahunan', alignRight: false },
  { id: 'pemotongan_setahun', label: 'Pemotongan', alignRight: false },
  { id: 'ganti_rugi', label: 'Ganti Rugi', alignRight: false },
  { id: 'pinjaman', label: 'Pinjaman', alignRight: false },
  { id: 'denda', label: 'Denda', alignRight: false },
  { id: 'potongan', label: 'Potongan', alignRight: false },
  { id: 'gaji_bersih', label: 'Gaji Bersih', alignRight: false },
];
// ----------------------------------------------------------------------
export default function LaporanAllPerTahun({ currentData, waktu }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nip');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(currentData?.data_tahunan.length);

  const tableRef = useRef(null);

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

  const currency = (val) => {
    const round = Math.round(val);
    const format = round.toString().split('').reverse().join('');
    const convert = format.match(/\d{1,3}/g);
    const rupiah = convert.join('.').split('').reverse().join('');
    const besaran = `Rp ${rupiah}`;

    return besaran;
  };

  const selisihParse = (val) => {
    const round = Math.round(val);
    let value = 0;
    if (round < 0) {
      value = round * -1;
    } else if (round > 0) {
      value = round;
    }
    const format = value.toString().split('').reverse().join('');
    const convert = format.match(/\d{1,3}/g);
    const rupiah = convert.join('.').split('').reverse().join('');

    let besaran = `Rp 0`;
    if (round < 0 || round === 0) {
      besaran = `Rp ${rupiah}`;
    } else if (round > 0) {
      besaran = `- Rp ${rupiah}`;
    }

    return besaran;
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - currentData?.data_tahunan.length) : 0;

  const filteredLaporan = applySortFilter(currentData?.data_tahunan, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredLaporan?.length && Boolean(filterName);

  const notFound = filteredLaporan?.length === 0;

  const titleExcel = `Laporan Penggajian Seluruh Pegawai-${waktu}`;

  const sheetExcel = waktu;

  const currentLength = currentData?.data_tahunan.length || 0;

  console.log(currentLength);

  const rowsOption = [5, 10, 25, 50, 100, currentLength];

  rowsOption.sort((a, b) => {
    return a - b;
  });

  console.log(rowsOption);

  return (
    <Card>
      <Box>
        <Stack alignItems="flex-end" sx={{ m: 3 }}>
          <DownloadTableExcel filename={titleExcel} sheet={sheetExcel} currentTableRef={tableRef.current}>
            <Button variant="contained">Unduh</Button>
          </DownloadTableExcel>
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'grid',
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
        }}
      >
        <Box sx={{ m: 1 }} flexDirection={'column'}>
          <Typography>Budget Gaji: {currency(currentData?.budget_gaji_tahunan)}</Typography>
        </Box>

        <Box sx={{ m: 1 }} flexDirection={'column'}>
          <Typography>Potongan: {currency(currentData?.potongan_tahunan)} </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
        }}
      >
        <Box sx={{ m: 1 }} flexDirection={'column'}>
          <Typography>Tunjangan BPJS Kesehatan: {currency(currentData?.bpjs_kes_tahunan)}</Typography>
        </Box>

        <Box sx={{ m: 1 }} flexDirection={'column'}>
          <Typography>Tunjangan BPJS Ketenagakerjaan: {currency(currentData?.bpjs_ket_tahunan)}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
        }}
      >
        <Box sx={{ m: 1 }} flexDirection={'column'}>
          <Typography>PPh 21: {currency(currentData?.pph_tahunan)}</Typography>
        </Box>

        <Box sx={{ m: 1 }} flexDirection={'column'}>
          <Typography>Gaji Bersih: {currency(currentData?.gaji_bersih_tahunan)}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
        }}
      >
        <Box sx={{ m: 1 }} flexDirection={'column'}>
          <Typography>Selisih PPh: {selisihParse(currentData?.selisih_tahunan)}</Typography>
        </Box>

        <Box sx={{ m: 1 }} flexDirection={'column'}>
          <Typography>{'  '}</Typography>
        </Box>
      </Box>

      <LaporanPenggajianPajakListToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
      />

      <Scrollbar>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader ref={tableRef}>
            <LaporanPenggajianPajakListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={currentData?.data_tahunan.length}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {filteredLaporan?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const nip = row.nip;
                const namaLengkap = row.nama_lengkap;
                const gajiPokokSetahun = currency(row.gaji_pokok_setahun);
                const jenisPegawai = row.jenis_pegawai;
                const metodePajak = row.metode_pajak;
                const tunjangan = currency(row.tunjangan_setahun);
                const totalTunjanganBpjs = currency(row.total_tunjangan_bpjs_setahun);
                const bonusBulan = currency(row.bonus_setahun);
                const pengurangan = currency(row.total_pengurangan_setahun);
                const pph = currency(row.pph_setahun);
                const selisih = selisihParse(row.selisih);
                const pemotongan = currency(row.pemotongan_setahun);
                const gantiRugi = currency(row.ganti_rugi_setahun);
                const pinjaman = currency(row.pinjaman_setahun);
                const denda = currency(row.denda_setahun);
                const potongan = currency(row.potongan_setahun);
                const gajiBersih = currency(row.gaji_bersih_setahun);

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
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" noWrap>
                        {nip}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">{namaLengkap}</TableCell>
                    <TableCell align="left">{jenisPegawai}</TableCell>
                    <TableCell align="left">{metodePajak}</TableCell>
                    <TableCell align="left">{gajiPokokSetahun}</TableCell>
                    <TableCell align="left">{tunjangan}</TableCell>
                    <TableCell align="left">{totalTunjanganBpjs}</TableCell>
                    <TableCell align="left">{bonusBulan}</TableCell>
                    <TableCell align="left">{pengurangan}</TableCell>
                    <TableCell align="left">{pph}</TableCell>
                    <TableCell align="left">{selisih}</TableCell>
                    <TableCell align="left">{pemotongan}</TableCell>
                    <TableCell align="left">{gantiRugi}</TableCell>
                    <TableCell align="left">{pinjaman}</TableCell>
                    <TableCell align="left">{denda}</TableCell>
                    <TableCell align="left">{potongan}</TableCell>
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
            {notFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <Paper>
                      <Typography gutterBottom align="center" variant="subtitle1">
                        Data tidak Tersedia
                      </Typography>
                    </Paper>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
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
        rowsPerPageOptions={rowsOption}
        component="div"
        count={currentData?.data_tahunan.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, page) => setPage(page)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
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
