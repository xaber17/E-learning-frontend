import React from 'react';
import { PDFViewer, Page, Text, View, Document, StyleSheet, Image, Font, Line, Svg } from '@react-pdf/renderer';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
} from '@mui/material';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';
import logoTelescoope from '../../assets/appLogo.jpeg';
import ttdGeneralManager from '../../assets/ttd_gm_telescoope.png';

// ----------------------------------------------------------------------
Font.register({
  family: 'Raleway',
  fonts: [
    {
      src: 'http://fonts.gstatic.com/s/raleway/v28/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaooCPNLA3JC9c.ttf',
    },
    {
      src: 'http://fonts.gstatic.com/s/raleway/v28/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvoooCPNLA3JC9c.ttf',
      fontWeight: 'medium',
    },
    {
      src: 'http://fonts.gstatic.com/s/raleway/v28/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pYCPNLA3JC9c.ttf',
      fontWeight: 'bold',
    },
  ],
});

export default function LaporanPegawaiPerTahunPdf({ currentData, waktu }) {
  console.log('CURRENT DATA LAPORAN', currentData);
  let rupiah = '';
  const currency = (val) => {
    const round = Math.round(val);
    const format = round.toString().split('').reverse().join('');
    const convert = format.match(/\d{1,3}/g);
    if (convert) {
      rupiah = convert.join('.').split('').reverse().join('');
    } else {
      rupiah = 0;
    }
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

  const stylesPdf = StyleSheet.create({
    page: {
      backgroundColor: '#FFFFFF',
      padding: 36,
    },
    header: {
      marginBottom: 20,
      // padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      // flexGrow: 1,
    },
    section: {
      marginTop: 4,
    },
    image: {
      width: 100,
      height: 44,
    },
    rightAlign: {
      alignItems: 'flex-end',
    },
    centerAlign: {
      alignItems: 'center',
      textAlign: 'center',
    },
    leftAlign: {
      alignItems: 'flex-start',
    },
    heading: {
      fontSize: 24,
      fontFamily: 'Raleway',
      fontWeight: 'bold',
    },
    headingDesc: {
      fontSize: 12,
      fontFamily: 'Raleway',
      fontWeight: 'bold',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rowItemSum: {
      width: '50%',
      flexDirection: 'row',
    },
    rowItem: {
      width: '50%',
      flexDirection: 'row',
      marginBottom: 0.5,
    },
    label: {
      fontSize: 10,
      fontFamily: 'Raleway',
      fontWeight: 'medium',
      width: '40%',
    },
    value: {
      fontSize: 10,
      fontFamily: 'Raleway',
      fontWeight: 'medium',
      width: '60%',
    },
    th: {
      fontSize: 10,
      fontFamily: 'Raleway',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    tdLabel: {
      fontSize: 10,
      fontFamily: 'Raleway',
      width: '60%',
    },
    tdValue: {
      fontSize: 10,
      fontFamily: 'Raleway',
      width: '40%',
      textAlign: 'right',
    },
    companyDetail: {
      // position: 'fixed',
      bottom: 0,
      // alignItems: 'flex-end',
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
      marginTop: 35,
    },
    companyName: {
      fontSize: 12,
      fontFamily: 'Raleway',
      fontWeight: 'bold',
    },
    companyAddress: {
      fontSize: 12,
      fontFamily: 'Raleway',
    },
    ttd: {
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    ttdCap: {
      width: 140,
      height: 60,
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      margin: 'auto',
      flexDirection: 'row',
    },
    tableColSm: {
      width: '7%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColMd: {
      width: '8%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColLg: {
      width: '25%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColFull: {
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCell: {
      margin: 'auto',
      fontSize: 8,
    },
    tableTitleCell: {
      textAlign: 'left',
      fontSize: 8,
      fontFamily: 'Raleway',
      fontWeight: 'bold',
    },
    seperatorCell: {
      textAlign: 'left',
      fontSize: 8,
      fontFamily: 'Raleway',
      fontWeight: 'bold',
      marginHorizontal: 10,
    },
  });

  // Create Document Component
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={stylesPdf.page} orientation="landscape">
        <View style={stylesPdf.header}>
          <View style={stylesPdf.leftAlign}>
            <Image style={stylesPdf.image} src={logoTelescoope} />
            <Text style={stylesPdf.headingDesc}>{currentData?.kode_penggajian}</Text>
          </View>
          <View style={stylesPdf.centerAlign}>
            <Text style={stylesPdf.headingDesc}>LAPORAN PENGGAJIAN PEGAWAI</Text>
            <Text style={stylesPdf.headingDesc}>TAHUN {currentData?.waktu}</Text>
          </View>
          <View style={stylesPdf.rightAlign}>
            <Text style={stylesPdf.headingDesc}>{'      '}</Text>
            <Text style={stylesPdf.headingDesc}>{'      '}</Text>
          </View>
        </View>

        {/* DETAIL PEGAWAI */}
        <View style={stylesPdf.section}>
          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.label}>Nama Pegawai</Text>
              <Text style={stylesPdf.value}>: {currentData?.nama_lengkap}</Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.label}>Bagian/Jabatan</Text>
              <Text style={stylesPdf.value}>: {currentData?.nama_bagian}</Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.label}>Kode Tarif PTKP</Text>
              <Text style={stylesPdf.value}>: {currentData?.kode_tarifptkp}</Text>
            </View>
          </View>
          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.label}>NIP</Text>
              <Text style={stylesPdf.value}>: {currentData?.nip}</Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.label}>Jabatan</Text>
              <Text style={stylesPdf.value}>: {currentData?.nama_jabatan}</Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.label}>No. NPWP</Text>
              <Text style={stylesPdf.value}>: {currentData?.no_npwp}</Text>
            </View>
          </View>
        </View>

        {/* TABLE */}
        <View style={stylesPdf.section}>
          <View style={stylesPdf.table}>
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>BULAN</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>JAN</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>FEB</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>MAR</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>APR</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>MEI</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>JUN</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>JUL</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>AGU</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>SEP</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>OKT</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>NOV</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>DES</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>SETAHUN</Text>
              </View>
            </View>

            {/* JENIS PEGAWAI */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>JENIS PEGAWAI</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.januari.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.februari.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.maret.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.april.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.mei.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.juni.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.juli.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.agustus.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.september.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.oktober.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.november.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.desember.jenis_pegawai_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currentData?.tahunan.jenis_pegawai}</Text>
              </View>
            </View>

            {/* METODE PAJAK */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>METODE PAJAK</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.januari.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.februari.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.maret.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.april.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.mei.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.juni.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.juli.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.agustus.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.september.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.oktober.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.november.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.desember.metode_pajak_bulan}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currentData?.tahunan.metode_pajak}</Text>
              </View>
            </View>

            {/* JUMLAH ABSENSi */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>HARI KEHADIRAN</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.januari.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.februari.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.maret.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.april.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.mei.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.juni.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.juli.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.agustus.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.september.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.oktober.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.november.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.desember.jumlah_absensi}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currentData?.tahunan.kehadiran}</Text>
              </View>
            </View>

            {/* JAM LEMBUR HARI LIBUR */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>JAM LEMBUR HARI LIBUR</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.januari.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.februari.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.maret.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.april.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.mei.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.juni.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.juli.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.agustus.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.september.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.oktober.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.november.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.desember.jam_lembur_harilibur}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currentData?.tahunan.lembur_harilibur_setahun} </Text>
              </View>
            </View>

            {/* JAM LEMBUR HARI KERJA */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>JAM LEMBUR HARI KERJA</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.januari.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.februari.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.maret.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.april.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.mei.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.juni.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.juli.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.agustus.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.september.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.oktober.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.november.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currentData?.desember.jam_lembur_harikerja}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}> {currentData?.tahunan.lembur_harikerja_setahun}</Text>
              </View>
            </View>

            {/* SEPARATOR */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColFull}>
                <Text style={stylesPdf.seperatorCell}>PENDAPATAN</Text>
              </View>
            </View>

            {/* GAJI POKOK */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>GAJI POKOK</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.gaji_pokok_bulan)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.gaji_pokok_setahun)} </Text>
              </View>
            </View>

            {/* TUNJANGAN BPJS TK */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>TUNJANGAN BPJS TK</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.nominal_tun_bpjstk)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.tunjangan_bpjstk_setahun)}</Text>
              </View>
            </View>

            {/* TUNJANGAN BPJS KES. */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>TUNJANGAN BPJS KES.</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.nominal_tun_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.tunjangan_bpjskes_setahun)} </Text>
              </View>
            </View>

            {/* TUNJANGAN TRANSPOR DAN MAKAN */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>TUNJANGAN TRANSPOR DAN MAKAN</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.nominal_tun_transpormakan)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.tunjangan_transpor_setahun)}</Text>
              </View>
            </View>

            {/* TUNJANGAN LEMBUR */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>TUNJANGAN LEMBUR</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.nominal_tun_lembur)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.tunjangan_lembur_setahun)} </Text>
              </View>
            </View>

            {/* TUNJANGAN PAJAK */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>TUNJANGAN PAJAK</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.nominal_tun_pajak)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}> {currency(currentData?.tahunan.tunjangan_pajak_setahun)}</Text>
              </View>
            </View>

            {/* TUNJANGAN NATURA */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>TUNJANGAN NATURA</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.nominal_tun_natura)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.tunjangan_natura_setahun)} </Text>
              </View>
            </View>

            {/* TUNJANGAN LAIN */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>TUNJANGAN LAIN</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.nominal_tun_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.tunjangan_lain_setahun)} </Text>
              </View>
            </View>

            {/* BONUS/THR */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>BONUS/THR</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.bonus_setahun)} </Text>
              </View>
            </View>

            {/* TUNJANGAN PAJAK ATAS BONUS/THR */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>TUNJANGAN PAJAK ATAS BONUS/THR</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}> {currency(currentData?.tahunan.tunjangan_pajak_bonus_setahun)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={stylesPdf.section}>
          <View style={stylesPdf.row}>
            <View style={stylesPdf.companyDetail}>
              <Text style={stylesPdf.companyName}>PT Solusi Integrasi Teknologi</Text>
              <Text style={stylesPdf.companyAddress}>
                Jl. Menjangan Raya No. 8, Kel. Pondok Ranji, Kec. Ciputat Timur
              </Text>
              <Text style={stylesPdf.companyAddress}>Kota Tangerang Selatan, Banten 15412</Text>
            </View>
            <View style={stylesPdf.ttd}>
              <Text style={stylesPdf.companyAddress}>
                {'Tangerang Selatan, '} {currentData?.dateNow} {currentData?.monthNow} {currentData?.yearNow}
              </Text>
              <Image style={stylesPdf.ttdCap} src={ttdGeneralManager} />
              <Text style={stylesPdf.companyAddress}>Muhammad Taqwa Aziz</Text>
              <Text style={stylesPdf.companyAddress}>Manajer HRD</Text>
            </View>
          </View>
        </View>

        <View style={stylesPdf.section} break>
          <View style={stylesPdf.table}>
            {/* TOTAL PENDAPATAN */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>TOTAL PENDAPATAN</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.total_pendapatan)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.total_pendapatan_setahun)}</Text>
              </View>
            </View>
            {/* SEPARATOR */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColFull}>
                <Text style={stylesPdf.seperatorCell}>POTONGAN</Text>
              </View>
            </View>

            {/* BIAYA BPJS TK */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>BIAYA BPJS TK</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.biaya_bpjs_tk)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.biaya_bpjs_tk)} </Text>
              </View>
            </View>

            {/* BIAYA BPJS KES. */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>BIAYA BPJS KES.</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.biaya_bpjs_kes)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.biaya_bpjs_kes)}</Text>
              </View>
            </View>

            {/* PPh 21 */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>PPh 21</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.pph_21)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.sum_pph)}</Text>
              </View>
            </View>

            {/* DENDA */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>DENDA</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.denda)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}> {currency(currentData?.tahunan.denda_setahun)}</Text>
              </View>
            </View>

            {/* GANTI RUGI */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>GANTI RUGI</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.ganti_rugi)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.ganti_rugi_setahun)} </Text>
              </View>
            </View>

            {/* PINJAMAN */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>PINJAMAN</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.pinjaman)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.pinjaman_setahun)}</Text>
              </View>
            </View>

            {/* POTONGAN LAIN */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>POTONGAN LAIN</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.potongan_lain)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.potongan_lain_setahun)} </Text>
              </View>
            </View>

            {/* TOTAL POTONGAN */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>TOTAL POTONGAN</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.total_potongan)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}> {currency(currentData?.tahunan.total_potongan_setahun)}</Text>
              </View>
            </View>

            {/* GAJI BERSIH */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>GAJI BERSIH</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.gaji_bersih)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.gaji_bersih_setahun)}</Text>
              </View>
            </View>

            {/* PPh 21 DITANGGUNG */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>PPh 21 DITANGGUNG</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.pph21_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.pph21_dit_setahun)} </Text>
              </View>
            </View>

            {/* BPJS KES 4% DITANGGUNG */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>BPJS Kes. DITANGGUNG</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.nominal_dit_bpjskes)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.bpjs_kes_dit)} </Text>
              </View>
            </View>

            {/* BPJS JP DITANGGUNG */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>BPJS JP DITANGGUNG</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.nominal_dit_bpjsjp)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.bpjs_jp_dit)} </Text>
              </View>
            </View>

            {/* BPJS JHT DITANGGUNG */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>BPJS JHT DITANGGUNG</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.nominal_dit_bpjsjht)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.bpjs_jht_dit)} </Text>
              </View>
            </View>

            {/* ANGGARAN GAJI */}
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableTitleCell}>ANGGARAN GAJI</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.januari.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.februari.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.maret.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.april.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.mei.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juni.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.juli.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.agustus.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.september.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.oktober.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.november.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.desember.budget_gaji)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCell}>{currency(currentData?.tahunan.budget_gaji_setahun)}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* FOOTER */}
        <View style={stylesPdf.section}>
          <View style={stylesPdf.row}>
            <View style={stylesPdf.companyDetail}>
              <Text style={stylesPdf.companyName}>PT Solusi Integrasi Teknologi</Text>
              <Text style={stylesPdf.companyAddress}>
                Jl. Menjangan Raya No. 8, Kel. Pondok Ranji, Kec. Ciputat Timur
              </Text>
              <Text style={stylesPdf.companyAddress}>Kota Tangerang Selatan, Banten 15412</Text>
            </View>
            <View style={stylesPdf.ttd}>
              <Text style={stylesPdf.companyAddress}>
                {'Tangerang Selatan, '} {currentData?.dateNow} {currentData?.monthNow} {currentData?.yearNow}
              </Text>
              <Image style={stylesPdf.ttdCap} src={ttdGeneralManager} />
              <Text style={stylesPdf.companyAddress}>{currentData?.nama_manhrd}</Text>
              <Text style={stylesPdf.companyAddress}>Manajer HRD</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  return (
    <FormProvider>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <PDFViewer fileName={'laporan-pegawai-per-tahun.pdf'} style={{ width: '100%', height: 500 }}>
              <MyDocument />
            </PDFViewer>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
