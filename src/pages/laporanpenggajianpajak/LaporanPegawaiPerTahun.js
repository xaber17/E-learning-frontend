import { sentenceCase } from 'change-case';
import { useSnackbar } from 'notistack';
import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDownloadExcel } from 'react-export-table-to-excel';
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
  { id: '', label: ' ', alignRight: false },
  { id: 'januari', label: 'Januari', alignRight: false },
  { id: 'februrari', label: 'Februrari', alignRight: false },
  { id: 'maret', label: 'Maret', alignRight: false },
  { id: 'april', label: 'April', alignRight: false },
  { id: 'mei', label: 'Mei', alignRight: false },
  { id: 'juni', label: 'Juni', alignRight: false },
  { id: 'juli', label: 'Juli', alignRight: false },
  { id: 'agustus', label: 'Agustus', alignRight: false },
  { id: 'september', label: 'September', alignRight: false },
  { id: 'oktober', label: 'Oktober', alignRight: false },
  { id: 'november', label: 'November', alignRight: false },
  { id: 'desember', label: 'Desember', alignRight: false },
  { id: 'setahun', label: 'Setahun', alignRight: false },
];
// ----------------------------------------------------------------------
export default function LaporanPegawaiPerTahun({ currentData, waktu }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nip');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Laporan Penggajian Pegawai Per Tahun-${currentData?.nama_lengkap}-${waktu}`,
    sheet: waktu,
  });

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.secondary,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const SumTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.secondary,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      backgroundColor: '#F8F3D4',
      minWidth: '50px',
      left: 0,
      position: 'sticky',
    },
  }));

  const TotalTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.secondary,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      backgroundColor: '#FFDE7D',
      minWidth: '50px',
      left: 0,
      position: 'sticky',
    },
  }));

  const StickyTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.secondary,
      color: theme.palette.common.white,
      left: 0,
      position: 'sticky',
      zIndex: theme.zIndex.appBar + 2,
    },
    [`&.${tableCellClasses.body}`]: {
      backgroundColor: '#ddd',
      minWidth: '50px',
      left: 0,
      position: 'sticky',
      // zIndex: theme.zIndex.appBar,
    },
  }));

  const OtherTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.secondary,
      color: theme.palette.common.white,
      left: 0,
      position: 'sticky',
      zIndex: theme.zIndex.appBar + 2,
    },
    [`&.${tableCellClasses.body}`]: {
      backgroundColor: '#BBE1FA',
      minWidth: '50px',
      left: 0,
      position: 'sticky',
      // zIndex: theme.zIndex.appBar,
    },
  }));

  const PenguranganTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.secondary,
      color: theme.palette.common.white,
      left: 0,
      position: 'sticky',
      zIndex: theme.zIndex.appBar + 2,
    },
    [`&.${tableCellClasses.body}`]: {
      backgroundColor: '#F6416C',
      minWidth: '50px',
      left: 0,
      position: 'sticky',
      // zIndex: theme.zIndex.appBar,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#ddd',
  }));

  const SumTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#F8F3D4',
  }));

  const TotalTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#FFDE7D',
  }));

  const BPJSTKTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#FFD3B6',
  }));

  const BPJSKesTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#BDD2B6',
  }));

  const OtherTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#BBE1FA',
  }));

  const PenguranganTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#F6416C',
  }));

  const PphTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#3282B8',
  }));

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  // const handleFilterByName = (filterName) => {
  //   setFilterName(filterName);
  //   setPage(0);
  // };

  const currency = (val) => {
    const round = Math.round(val);
    const format = round.toString().split('').reverse().join('');
    const convert = format.match(/\d{1,3}/g);
    const rupiah = convert.join('.').split('').reverse().join('');
    const besaran = `Rp ${rupiah}`;

    return besaran;
  };

  return (
    <Card>
      <Box
        sx={{
          display: 'grid',
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
          p: 3,
        }}
      >
        <Typography variant="subtitle2">Nama: {currentData?.nama_lengkap}</Typography>
        <Typography variant="subtitle2">NPWP: {currentData?.no_npwp}</Typography>
        <Typography variant="subtitle2">NIP: {currentData?.nip}</Typography>
      </Box>
      <Box>
        <Stack alignItems="flex-end" sx={{ m: 3 }}>
          <Button variant="contained" onClick={onDownload}>
            Unduh
          </Button>
        </Stack>
      </Box>

      <Scrollbar>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader ref={tableRef}>
            <LaporanPenggajianPajakListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={currentData?.length}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              <>
                <TableRow>
                  <StickyTableCell align="left">Jenis Pegawai</StickyTableCell>
                  <TableCell align="left">{currentData?.januari.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.februari.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.maret.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.april.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.mei.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.juni.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.juli.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.agustus.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.september.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.oktober.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.november.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.desember.jenis_pegawai_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.tahunan.jenis_pegawai || ' - '}</TableCell>
                </TableRow>
                <TableRow>
                  <StickyTableCell align="left">Metode Pajak</StickyTableCell>
                  <TableCell align="left">{currentData?.januari.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.februari.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.maret.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.april.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.mei.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.juni.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.juli.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.agustus.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.september.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.oktober.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.november.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.desember.metode_pajak_bulan || ' - '}</TableCell>
                  <TableCell align="left">{currentData?.tahunan.metode_pajak || ' - '}</TableCell>
                </TableRow>
                <TableRow>
                  <StickyTableCell align="left">Gaji Pokok</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.gaji_pokok_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.gaji_pokok_setahun || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <StickyTableCell align="left">Tunjangan Transpor & Makan</StickyTableCell>
                  <TableCell align="left">
                    {currency(currentData?.januari.tunjangan_transpor_makan_sebulan || 0)}
                  </TableCell>
                  <TableCell align="left">
                    {currency(currentData?.februari.tunjangan_transpor_makan_sebulan || 0)}
                  </TableCell>
                  <TableCell align="left">
                    {currency(currentData?.maret.tunjangan_transpor_makan_sebulan || 0)}
                  </TableCell>
                  <TableCell align="left">
                    {currency(currentData?.april.tunjangan_transpor_makan_sebulan || 0)}
                  </TableCell>
                  <TableCell align="left">{currency(currentData?.mei.tunjangan_transpor_makan_sebulan || 0)}</TableCell>
                  <TableCell align="left">
                    {currency(currentData?.juni.tunjangan_transpor_makan_sebulan || 0)}
                  </TableCell>
                  <TableCell align="left">
                    {currency(currentData?.juli.tunjangan_transpor_makan_sebulan || 0)}
                  </TableCell>
                  <TableCell align="left">
                    {currency(currentData?.agustus.tunjangan_transpor_makan_sebulan || 0)}
                  </TableCell>
                  <TableCell align="left">
                    {currency(currentData?.september.tunjangan_transpor_makan_sebulan || 0)}
                  </TableCell>
                  <TableCell align="left">
                    {currency(currentData?.oktober.tunjangan_transpor_makan_sebulan || 0)}
                  </TableCell>
                  <TableCell align="left">
                    {currency(currentData?.november.tunjangan_transpor_makan_sebulan || 0)}
                  </TableCell>
                  <TableCell align="left">
                    {currency(currentData?.desember.tunjangan_transpor_makan_sebulan || 0)}
                  </TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.tunjangan_transpor_setahun || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <StickyTableCell align="left">Tunjangan Lembur</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.tunjangan_lembur || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.tunjangan_lembur_setahun || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <StickyTableCell align="left">Tunjangan Natura</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.tunjangan_natura || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.tunjangan_natura_setahun || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <StickyTableCell align="left">Tunjangan Lain</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.tunjangan_lain || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.tunjangan_lain_setahun || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <StickyTableCell align="left">Tunjangan Pajak</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.tunjangan_pajak || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.tunjangan_pajak_setahun || 0)}</TableCell>
                </TableRow>
                <SumTableRow>
                  <SumTableCell align="left">Pendapatan Rutin</SumTableCell>
                  <StyledTableCell align="left">{currency(currentData?.januari.pendapatan_rutin || 0)}</StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.pendapatan_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.maret.pendapatan_rutin || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.april.pendapatan_rutin || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.mei.pendapatan_rutin || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juni.pendapatan_rutin || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juli.pendapatan_rutin || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.agustus.pendapatan_rutin || 0)}</StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.pendapatan_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.oktober.pendapatan_rutin || 0)}</StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.pendapatan_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.pendapatan_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.tahunan.pendapatan_rutin_setahun || 0)}
                  </StyledTableCell>
                </SumTableRow>
                <BPJSTKTableRow>
                  <StickyTableCell align="left">Tunjangan BPJS Ketenagakerjaan JP (2%)</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.nominal_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.tunjangan_bpjs_jp_setahun || 0)}</TableCell>
                </BPJSTKTableRow>
                <BPJSTKTableRow>
                  <StickyTableCell align="left">Tunjangan BPJS Ketenagakerjaan JHT (1%)</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.nominal_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.tunjangan_bpjs_jht_setahun || 0)}</TableCell>
                </BPJSTKTableRow>
                <BPJSTKTableRow>
                  <StickyTableCell align="left">Tunjangan BPJS Ketenagakerjaan JKM (0,3%)</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.nominal_bpjs_jkm || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.tunjangan_bpjs_jkm_setahun || 0)}</TableCell>
                </BPJSTKTableRow>
                <BPJSTKTableRow>
                  <StickyTableCell align="left">Tunjangan BPJS Ketenagakerjaan JKK (0,24%)</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.nominal_bpjs_jkk || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.tunjangan_bpjs_jkk_setahun || 0)}</TableCell>
                </BPJSTKTableRow>
                <BPJSKesTableRow>
                  <StickyTableCell align="left">Tunjangan BPJS Kesehatan (1%)</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.nominal_bpjs_kes || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.tunjangan_bpjs_kes_setahun || 0)}</TableCell>
                </BPJSKesTableRow>
                <BPJSKesTableRow>
                  <StickyTableCell align="left">Tunjangan BPJS Kesehatan Perusahaan(4%)</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.nominal_bpjs_kes_perusahaan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.nominal_bpjs_kes_perusahaan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.nominal_bpjs_kes_perusahaan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.nominal_bpjs_kes_perusahaan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.nominal_bpjs_kes_perusahaan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.nominal_bpjs_kes_perusahaan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.nominal_bpjs_kes_perusahaan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.nominal_bpjs_kes_perusahaan || 0)}</TableCell>
                  <TableCell align="left">
                    {currency(currentData?.september.nominal_bpjs_kes_perusahaan || 0)}
                  </TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.nominal_bpjs_kes_perusahaan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.nominal_bpjs_kes_perusahaan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.nominal_bpjs_kes_perusahaan || 0)}</TableCell>
                  <TableCell align="left">
                    {currency(currentData?.tahunan.tunjangan_bpjs_kes_perusahaan_setahun || 0)}
                  </TableCell>
                </BPJSKesTableRow>
                <SumTableRow>
                  <SumTableCell align="left">Total Tunjangan BPJS</SumTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.januari.total_tunjangan_bpjs || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.total_tunjangan_bpjs || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.maret.total_tunjangan_bpjs || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.april.total_tunjangan_bpjs || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.mei.total_tunjangan_bpjs || 0)}</StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juni.total_tunjangan_bpjs || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juli.total_tunjangan_bpjs || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.agustus.total_tunjangan_bpjs || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.total_tunjangan_bpjs || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.oktober.total_tunjangan_bpjs || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.total_tunjangan_bpjs || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.total_tunjangan_bpjs || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.tahunan.total_tunjangan_bpjs_setahun || 0)}
                  </StyledTableCell>
                </SumTableRow>
                <TotalTableRow>
                  <TotalTableCell align="left">Penghasilan Bruto</TotalTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.januari.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.maret.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.april.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.mei.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juni.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juli.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.agustus.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.oktober.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.penghasilan_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.tahunan.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                </TotalTableRow>
                <TableRow>
                  <StickyTableCell align="left">Bonus/THR</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.bonus_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.bonus_setahun || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <StickyTableCell align="left">Tunjangan Pajak Bonus/THR</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.tunjangan_pajak_bonus_thr || 0)}</TableCell>
                  <TableCell align="left">
                    {currency(currentData?.tahunan.tunjangan_pajak_bonus_setahun || 0)}
                  </TableCell>
                </TableRow>
                <SumTableRow>
                  <SumTableCell align="left">Pendapatan Tidak Rutin</SumTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.januari.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.maret.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.april.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.mei.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juni.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juli.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.agustus.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.oktober.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.pendapatan_tidak_rutin || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.tahunan.pendapatan_tidak_rutin_setahun || 0)}
                  </StyledTableCell>
                </SumTableRow>
                <TotalTableRow>
                  <TotalTableCell align="left">Penghasilan & Bonus/THR Bruto</TotalTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.januari.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.maret.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.april.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.mei.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juni.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juli.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.agustus.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.oktober.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.penghasilan_thr_bruto_sebulan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.tahunan.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                </TotalTableRow>
                <BPJSTKTableRow>
                  <StickyTableCell align="left">Biaya BPJS Ketenagakerjaan(JP)</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.biaya_bpjs_jp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.biaya_bpjs_jp_setahun || 0)}</TableCell>
                </BPJSTKTableRow>
                <BPJSTKTableRow>
                  <StickyTableCell align="left">Biaya BPJS Ketenagakerjaan(JHT)</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.biaya_bpjs_jht || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.biaya_bpjs_jht_setahun || 0)}</TableCell>
                </BPJSTKTableRow>
                <OtherTableRow>
                  <StickyTableCell align="left">Biaya Jabatan</StickyTableCell>
                  <TableCell align="left">{currency(currentData?.januari.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.biaya_jabatan_sebulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.biaya_jabatan_setahun || 0)}</TableCell>
                </OtherTableRow>
                <TotalTableRow>
                  <TotalTableCell align="left">Pengurangan</TotalTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.januari.total_pengurangan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.total_pengurangan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.maret.total_pengurangan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.april.total_pengurangan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.mei.total_pengurangan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juni.total_pengurangan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juli.total_pengurangan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.agustus.total_pengurangan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.total_pengurangan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.oktober.total_pengurangan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.total_pengurangan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.total_pengurangan || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.tahunan.total_pengurangan_setahun || 0)}
                  </StyledTableCell>
                </TotalTableRow>
                <OtherTableRow>
                  <StickyTableCell align="left">Penghasilan Bruto (Disetahunkan)</StickyTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.januari.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.maret.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.april.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.mei.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juni.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juli.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.agustus.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.oktober.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.penghasilan_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {/* {currency(currentData?.tahunan.penghasilan_bruto_setahun || 0)} */}
                  </StyledTableCell>
                </OtherTableRow>
                <OtherTableRow>
                  <StickyTableCell align="left">Penghasilan & Bonus/THR Bruto (Disetahunkan) </StickyTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.januari.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.maret.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.april.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.mei.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juni.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juli.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.agustus.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.oktober.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.penghasilan_thr_bruto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {/* {currency(currentData?.tahunan.total_pengurangan_setahun || 0)} */}
                  </StyledTableCell>
                </OtherTableRow>
                <StyledTableRow>
                  <StickyTableCell align="left">Penghasilan Netto (Disetahunkan) </StickyTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.januari.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.maret.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.april.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.mei.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juni.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juli.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.agustus.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.oktober.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.tahunan.pendapatan_netto_setahun || 0)}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StickyTableCell align="left">Penghasilan & Bonus/THR Netto (Disetahunkan) </StickyTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.januari.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.maret.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.april.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.mei.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juni.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.juli.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.agustus.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.oktober.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.tahunan.pendapatan_netto_thr_setahun || 0)}
                  </StyledTableCell>
                </StyledTableRow>
                <SumTableRow>
                  <SumTableCell align="left">Tarif PTKP</SumTableCell>
                  <TableCell align="left">{currency(currentData?.januari.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.besaran_tarifptkp || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.besaran_tarifptkp || 0)}</TableCell>
                </SumTableRow>
                <StyledTableRow>
                  <StickyTableCell align="left">Penghasilan Kena Pajak(PKP)</StickyTableCell>
                  <StyledTableCell align="left">{currency(currentData?.januari.pkp_gaji_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.pkp_gaji_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.maret.pkp_gaji_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.april.pkp_gaji_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.mei.pkp_gaji_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juni.pkp_gaji_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juli.pkp_gaji_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.agustus.pkp_gaji_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.pkp_gaji_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.oktober.pkp_gaji_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.pkp_gaji_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.pkp_gaji_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.tahunan.pkp_gaji_setahun || 0)}</StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StickyTableCell align="left">Penghasilan & Bonus/THR Kena Pajak(PKP)</StickyTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.januari.pkp_bonus_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.februari.pkp_bonus_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.maret.pkp_bonus_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.april.pkp_bonus_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.mei.pkp_bonus_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juni.pkp_bonus_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juli.pkp_bonus_setahun || 0)}</StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.agustus.pkp_bonus_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.september.pkp_bonus_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.oktober.pkp_bonus_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.november.pkp_bonus_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.desember.pkp_bonus_setahun || 0)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.tahunan.pkp_bonus_setahun || 0)}
                  </StyledTableCell>
                </StyledTableRow>

                <OtherTableRow>
                  <OtherTableCell align="left">PPh 21</OtherTableCell>
                  <StyledTableCell align="left">{currency(currentData?.januari.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.februari.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.maret.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.april.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.mei.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juni.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juli.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.agustus.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.september.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.oktober.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.november.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.desember.pph_gaji_thr || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.tahunan.pph_setahun || 0)}</StyledTableCell>
                </OtherTableRow>

                {currentData?.tahunan.selisih < 0 ? (
                  <SumTableRow>
                    <SumTableCell align="left">Lebih Bayar</SumTableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left">{currency(currentData?.tahunan.lebih_bayar || 0)}</TableCell>
                  </SumTableRow>
                ) : (
                  <SumTableRow>
                    <SumTableCell align="left">Kurang Bayar</SumTableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="left">{currency(currentData?.tahunan.kurang_bayar || 0)}</TableCell>
                  </SumTableRow>
                )}
                <PenguranganTableRow>
                  <PenguranganTableCell align="left">Pemotongan</PenguranganTableCell>
                  <TableCell align="left">{currency(currentData?.januari.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.pemotongan_bulan || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.pemotongan_setahun || 0)}</TableCell>
                </PenguranganTableRow>

                <PenguranganTableRow>
                  <PenguranganTableCell align="left">Pinjaman</PenguranganTableCell>
                  <TableCell align="left">{currency(currentData?.januari.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.pinjaman || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.pinjaman_setahun || 0)}</TableCell>
                </PenguranganTableRow>
                <PenguranganTableRow>
                  <PenguranganTableCell align="left">Ganti Rugi</PenguranganTableCell>
                  <TableCell align="left">{currency(currentData?.januari.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.ganti_rugi || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.ganti_rugi_setahun || 0)}</TableCell>
                </PenguranganTableRow>
                <PenguranganTableRow>
                  <PenguranganTableCell align="left">Denda</PenguranganTableCell>
                  <TableCell align="left">{currency(currentData?.januari.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.februari.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.maret.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.april.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.mei.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juni.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.juli.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.agustus.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.september.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.oktober.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.november.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.desember.denda || 0)}</TableCell>
                  <TableCell align="left">{currency(currentData?.tahunan.denda_setahun || 0)}</TableCell>
                </PenguranganTableRow>

                <TotalTableRow>
                  <TotalTableCell align="left">Potongan</TotalTableCell>
                  <StyledTableCell align="left">{currency(currentData?.januari.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.februari.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.maret.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.april.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.mei.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juni.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juli.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.agustus.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.september.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.oktober.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.november.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.desember.potongan || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.tahunan.potongan_setahun || 0)}</StyledTableCell>
                </TotalTableRow>

                <TotalTableRow>
                  <TotalTableCell align="left">Gaji Bersih</TotalTableCell>
                  <StyledTableCell align="left">{currency(currentData?.januari.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.februari.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.maret.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.april.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.mei.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juni.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.juli.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.agustus.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.september.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.oktober.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.november.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">{currency(currentData?.desember.gaji_bersih || 0)}</StyledTableCell>
                  <StyledTableCell align="left">
                    {currency(currentData?.tahunan.gaji_bersih_setahun || 0)}
                  </StyledTableCell>
                </TotalTableRow>
              </>
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
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
