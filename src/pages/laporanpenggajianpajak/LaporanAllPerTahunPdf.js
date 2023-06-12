import React from 'react';
import { PDFViewer, Page, Text, View, Document, StyleSheet, Image, Font, Line, Svg } from '@react-pdf/renderer';
import { Card, Grid } from '@mui/material';
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

export default function LaporanAllPerBulanPdf({ currentData, waktu }) {
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
      padding: 24,
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
      fontSize: 6,
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
      width: '5%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColMd: {
      width: '6%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColLg: {
      width: '26%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColXl: {
      width: '31%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      paddingVertical: '5',
    },
    tableColFull: {
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCellRight: {
      //   margin: 'auto',
      fontFamily: 'Raleway',
      fontSize: 7,
      textAlign: 'right',
    },
    tableCellRightSm: {
      //   margin: 'auto',
      fontFamily: 'Raleway',
      fontSize: 6,
      textAlign: 'right',
      fontWeight: 'bold',
    },
    tableCellCenter: {
      //   margin: 'auto',
      fontFamily: 'Raleway',
      fontSize: 7,
      textAlign: 'center',
    },
    tableCellLeft: {
      //   margin: 'auto',
      fontFamily: 'Raleway',
      fontSize: 7,
      textAlign: 'left',
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

  const data = currentData?.data_tahunan;

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
            <Text style={stylesPdf.headingDesc}>LAPORAN PENGGAJIAN</Text>
            <Text style={stylesPdf.headingDesc}>TAHUN {currentData?.tahun}</Text>
          </View>
          <View style={stylesPdf.rightAlign}>
            <Text style={stylesPdf.headingDesc}>{'      '}</Text>
            <Text style={stylesPdf.headingDesc}>{'      '}</Text>
          </View>
        </View>

        {/* TABLE */}
        <View style={stylesPdf.section}>
          <View style={stylesPdf.table}>
            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>NIP</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>Nama Pegawai</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>Kehadiran</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>Jam Lembur Hari Kerja</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>Jam Lembur Hari Libur</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>Gaji Pokok</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>Tunjangan Tidak Tetap</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>Tunjangan BPJS</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>Bonus/THR</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>Tunjangan atas Bonus/THR</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>PPh 21</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>Total Potongan</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>Gaji Bersih</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>PPh 21 Ditanggung</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>BPJS KES Ditanggung</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>BPJS JP Ditanggung</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.th}>BPJS JHT Ditanggung</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>Anggaran Gaji</Text>
              </View>
              {/* <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.th}>Selisih PPh 21 Tahunan</Text>
              </View> */}
            </View>

            {data.map((row) => (
              <View style={stylesPdf.tableRow}>
                <View style={stylesPdf.tableColSm}>
                  <Text style={stylesPdf.tableCellCenter}>{row?.nip}</Text>
                </View>
                <View style={stylesPdf.tableColMd}>
                  <Text style={stylesPdf.tableCellLeft}>{row?.nama_lengkap}</Text>
                </View>
                <View style={stylesPdf.tableColSm}>
                  <Text style={stylesPdf.tableCellCenter}>{row?.jumlah_absensi}</Text>
                </View>
                <View style={stylesPdf.tableColSm}>
                  <Text style={stylesPdf.tableCellCenter}>{row?.jumlah_lembur_harilibur}</Text>
                </View>
                <View style={stylesPdf.tableColSm}>
                  <Text style={stylesPdf.tableCellCenter}>{row?.jumlah_lembur_harilibur}</Text>
                </View>
                <View style={stylesPdf.tableColMd}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.gaji_pokok_setahun)}</Text>
                </View>
                <View style={stylesPdf.tableColMd}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.tunjangan_tidak_tetap)}</Text>
                </View>
                <View style={stylesPdf.tableColMd}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.tunjangan_tetap)}</Text>
                </View>
                <View style={stylesPdf.tableColMd}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.bonus_setahun)}</Text>
                </View>
                <View style={stylesPdf.tableColSm}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.tunjangan_pajak_bonus_setahun)}</Text>
                </View>
                <View style={stylesPdf.tableColSm}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.sum_pph)}</Text>
                </View>
                <View style={stylesPdf.tableColMd}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.total_potongan_setahun)}</Text>
                </View>
                <View style={stylesPdf.tableColMd}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.gaji_bersih_setahun)}</Text>
                </View>
                <View style={stylesPdf.tableColMd}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.pph_21_ditanggung)}</Text>
                </View>
                <View style={stylesPdf.tableColMd}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.bpjskes_dit)}</Text>
                </View>
                <View style={stylesPdf.tableColSm}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.bpjsjp_dit)}</Text>
                </View>
                <View style={stylesPdf.tableColSm}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.bpjsjht_dit)}</Text>
                </View>
                <View style={stylesPdf.tableColMd}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.budget_gaji_setahun)}</Text>
                </View>
                {/* <View style={stylesPdf.tableColMd}>
                  <Text style={stylesPdf.tableCellRight}>{currency(row?.selisih)}</Text>
                </View> */}
              </View>
            ))}

            <View style={stylesPdf.tableRow}>
              <View style={stylesPdf.tableColLg}>
                <Text style={stylesPdf.th}>TOTAL</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.gaji_pokok)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.tunjangan_tidak_tetap)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.tunjangan_tetap)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.bonus_thr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.nominal_tun_pajak_bonusthr)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.pph_tahunan)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.potongan_tahunan)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.gaji_bersih_tahunan)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.pph_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.bpjs_kes_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.bpjs_jp_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColSm}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.bpjs_jht_ditanggung)}</Text>
              </View>
              <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.budget_gaji_tahunan)}</Text>
              </View>
              {/* <View style={stylesPdf.tableColMd}>
                <Text style={stylesPdf.tableCellRightSm}>{currency(currentData?.selisih_tahunan)}</Text>
              </View> */}
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
            <PDFViewer fileName={'laporan-per-bulan.pdf'} style={{ width: '100%', height: 500 }}>
              <MyDocument />
            </PDFViewer>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
