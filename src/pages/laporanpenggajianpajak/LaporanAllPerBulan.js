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
  { id: 'gaji_pokok_bulan', label: 'Gaji Pokok', alignRight: false },
  { id: 'tunjangan_bulan', label: 'Tunjangan Tidak Tetap', alignRight: false },
  { id: 'total_tunjangan_bpjs', label: 'Tunjangan BPJS', alignRight: false },
  { id: 'bonus_bulan', label: 'Bonus/THR', alignRight: false },
  { id: 'total_pengurangan', label: 'Pengurangan', alignRight: false },
  { id: 'pph_gaji_thr', label: 'PPh 21', alignRight: false },
  { id: 'pemotongan_bulan', label: 'Pemotongan', alignRight: false },
  { id: 'ganti_rugi', label: 'Ganti Rugi', alignRight: false },
  { id: 'pinjaman', label: 'Pinjaman', alignRight: false },
  { id: 'denda', label: 'Denda', alignRight: false },
  { id: 'potongan', label: 'Potongan', alignRight: false },
  { id: 'gaji_bersih', label: 'Gaji Bersih', alignRight: false },
  { id: '' },
];
// ----------------------------------------------------------------------
export default function LaporanAllPerBulan({ currentData, waktu }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nip');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(currentData.bulanan.length);

  const tableRef = useRef(null);

  console.log(tableRef);

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - currentData.bulanan.length) : 0;

  const filteredLaporan = applySortFilter(currentData.bulanan, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredLaporan?.length && Boolean(filterName);

  const notFound = filteredLaporan?.length === 0;

  const titleExcel = `Laporan Penggajian Seluruh Pegawai-${waktu}`;

  const sheetExcel = waktu;

  const currentLength = currentData?.bulanan.length || 0;

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

      <LaporanPenggajianPajakListToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
      />

      <Scrollbar>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Box
            sx={{
              display: 'grid',
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Box sx={{ m: 1 }} flexDirection={'column'}>
              <Typography>Budget Gaji: {currency(currentData.budget_gaji)}</Typography>
            </Box>

            <Box sx={{ m: 1 }} flexDirection={'column'}>
              <Typography>Potongan: {currency(currentData.potongan)} </Typography>
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
              <Typography>Tunjangan BPJS Kesehatan: {currency(currentData.tunjangan_bpjs_kes)}</Typography>
            </Box>

            <Box sx={{ m: 1 }} flexDirection={'column'}>
              <Typography>Tunjangan BPJS Ketenagakerjaan: {currency(currentData.tunjangan_bpjs_ket)}</Typography>
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
              <Typography>PPh 21: {currency(currentData.pph)}</Typography>
            </Box>

            <Box sx={{ m: 1 }} flexDirection={'column'}>
              <Typography>Gaji Bersih: {currency(currentData.gaji_bersih)}</Typography>
            </Box>
          </Box>
          <Table stickyHeader ref={tableRef}>
            <LaporanPenggajianPajakListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={currentData?.bulanan.length}
              onRequestSort={handleRequestSort}
            />

            <TableBody>
              {filteredLaporan?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const kodePenggajian = row.kode_penggajian;
                const nip = row.nip;
                const namaLengkap = row.nama_lengkap;
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
                const potongan = currency(row.potongan);
                const gajiBersih = currency(row.gaji_bersih);

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
                    <TableCell align="left">{jenisPegawaiBulan === 'tetap' ? 'Tetap' : 'Tidak Tetap'}</TableCell>
                    <TableCell align="left">
                      {metodePajakBulan === 'gross' ? 'Gross' : [metodePajakBulan === 'grossup' ? 'Gross Up' : 'Nett']}
                    </TableCell>
                    <TableCell align="left">{gajiPokokBulan}</TableCell>
                    <TableCell align="left">{tunjanganBulan}</TableCell>
                    <TableCell align="left">{totalTunjanganBpjs}</TableCell>
                    <TableCell align="left">{bonusBulan}</TableCell>
                    <TableCell align="left">{pengurangan}</TableCell>
                    <TableCell align="left">{pph}</TableCell>
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
        count={currentData?.bulanan.length || 0}
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
