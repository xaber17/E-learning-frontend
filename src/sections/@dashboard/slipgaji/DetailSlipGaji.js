// import PropTypes from 'prop-types';
// import * as Yup from 'yup';
// import { useCallback, useEffect, useMemo } from 'react';
// import { useSnackbar } from 'notistack';
// import { useNavigate } from 'react-router-dom';
import React from 'react';
import { PDFViewer, Page, Text, View, Document, StyleSheet, Image, Font, Line, Svg } from '@react-pdf/renderer';

// form
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, InputAdornment } from '@mui/material';
// utils
// import { fData } from '../../../../utils/formatNumber';
// routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
// import { countries, roles } from '../../../../_mock';
// components
// import Label from '../../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import logoTelescoope from '../../../assets/appLogo.jpeg';
import ttdGeneralManager from '../../../assets/ttd_gm_telescoope.png';

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

export default function DetailSlipGaji({ currentData }) {
  console.log('CURRENT DATA SLIP GAJI', currentData);

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
  });

  // Create Document Component
  const MyDocument = () => (
    <Document>
      <Page size="B5" style={stylesPdf.page} orientation="landscape">
        <View style={stylesPdf.header}>
          <View style={stylesPdf.leftAlign}>
            <Image style={stylesPdf.image} src={logoTelescoope} />
            <Text style={stylesPdf.headingDesc}>{currentData.kode_penggajian}</Text>
          </View>
          <View style={stylesPdf.rightAlign}>
            <Text style={stylesPdf.heading}>PAYSLIP</Text>
            <Text style={stylesPdf.headingDesc}>
              {currentData.nama_bulan} {currentData.tahun}
            </Text>
          </View>
        </View>

        {/* DETAIL PEGAWAI */}
        <View style={stylesPdf.section}>
          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.label}>NPWP</Text>
              <Text style={stylesPdf.value}>: {currentData.no_npwp}</Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.label}>Bagian/Jabatan</Text>
              <Text style={stylesPdf.value}>
                : {currentData.nama_bagian}/{currentData.nama_jabatan}
              </Text>
            </View>
          </View>
          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.label}>Nama/NIP</Text>
              <Text style={stylesPdf.value}>
                : {currentData.nama_lengkap}/{currentData.nip}
              </Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.label}>Jenis Pegawai/Pajak</Text>
              <Text style={stylesPdf.value}>
                : {currentData.nama_jenis_pegawai}/{currentData.nama_metode_pajak}
              </Text>
            </View>
          </View>
        </View>

        {/* DETAIL GAJI */}
        <View style={stylesPdf.section}>
          {/* table header */}
          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.th}>PENDAPATAN</Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.th}>POTONGAN</Text>
            </View>
          </View>

          <Svg height="10" width="745">
            <Line x1="0" y1="0" x2="745" y2="0" strokeWidth={2} stroke="#000000" />
          </Svg>

          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Gaji Pokok</Text>
              <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>
                {currency(currentData?.gaji_pokok_bulan || 0)}
              </Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Biaya BPJS TK</Text>
              <Text style={stylesPdf.tdValue}>{currency(currentData?.biaya_bpjs_tk || 0)}</Text>
            </View>
          </View>

          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Tunjangan Transpor dan Makan</Text>
              <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>
                {currency(currentData?.nominal_tun_transpormakan || 0)}
              </Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Biaya BPJS Kesehatan</Text>
              <Text style={stylesPdf.tdValue}>{currency(currentData?.biaya_bpjs_kes || 0)}</Text>
            </View>
          </View>

          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Tunjangan Lembur</Text>
              <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>
                {currency(currentData?.nominal_tun_lembur || 0)}
              </Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>PPh 21</Text>
              <Text style={stylesPdf.tdValue}>{currency(currentData?.pph_21 || 0)}</Text>
            </View>
          </View>

          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Tunjangan Natura</Text>
              <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>
                {currency(currentData?.nominal_tun_natura || 0)}
              </Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Denda</Text>
              <Text style={stylesPdf.tdValue}>{currency(currentData?.denda || 0)}</Text>
            </View>
          </View>

          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Tunjangan Lain</Text>
              <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>{currency(currentData?.nominal_tun_lain || 0)}</Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Ganti Rugi</Text>
              <Text style={stylesPdf.tdValue}>{currency(currentData?.ganti_rugi || 0)}</Text>
            </View>
          </View>
          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Tunjangan Pajak</Text>
              <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>{currency(currentData.nominal_tun_pajak)}</Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Pinjaman</Text>
              <Text style={stylesPdf.tdValue}>{currency(currentData.pinjaman)}</Text>
            </View>
          </View>

          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Tunjangan Pajak atas Bonus/THR</Text>
              <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>
                {currency(currentData.nominal_tun_pajak_bonusthr)}
              </Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Potongan Lain</Text>
              <Text style={stylesPdf.tdValue}>{currency(currentData.potongan_lain)}</Text>
            </View>
          </View>

          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Tunjangan BPJS TK</Text>
              <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>{currency(currentData.nominal_tun_bpjstk)}</Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}> </Text>
              <Text style={stylesPdf.tdValue}> </Text>
            </View>
          </View>

          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Tunjangan BPJS Kesehatan</Text>
              <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>
                {currency(currentData?.nominal_tun_bpjskes || 0)}
              </Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}> </Text>
              <Text style={stylesPdf.tdValue}> </Text>
            </View>
          </View>

          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>Bonus/THR</Text>
              <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>{currency(currentData?.bonus_thr || 0)}</Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}> </Text>
              <Text style={stylesPdf.tdValue}> </Text>
            </View>
          </View>

          <View style={stylesPdf.row}>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>
                {currentData.metode_pajak_bulan === 'nett' ? 'PPh 21 Ditanggung' : ' '}
              </Text>
              <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>
                {currentData.metode_pajak_bulan === 'nett' ? currency(currentData?.pph_ditanggung || 0) : ' '}
              </Text>
            </View>
            <View style={stylesPdf.rowItem}>
              <Text style={stylesPdf.tdLabel}>{'Pembulatan'}</Text>
              <Text style={stylesPdf.tdValue}>{currency(currentData?.pembulatan || 0)}</Text>
            </View>
          </View>

          <View style={stylesPdf.section}>
            <View style={stylesPdf.row}>
              <View style={stylesPdf.rowItem}>
                <Text style={[stylesPdf.th, { width: '60%' }]}>TOTAL PENDAPATAN</Text>
                <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>
                  {currency(currentData?.total_pendapatan || 0)}
                </Text>
              </View>
              <View style={stylesPdf.rowItem}>
                <Text style={[stylesPdf.th, { width: '60%' }]}>TOTAL POTONGAN</Text>
                <Text style={stylesPdf.tdValue}>{currency(currentData?.total_potongan)}</Text>
              </View>
            </View>

            <Svg height="10" width="745">
              <Line x1="0" y1="0" x2="745" y2="0" strokeWidth={2} stroke="#000000" />
            </Svg>

            <View style={stylesPdf.row}>
              <View style={stylesPdf.rowItemSum}>
                <Text style={[stylesPdf.th, { width: '60%' }]}>Gaji Bersih</Text>
                <Text style={[stylesPdf.tdValue, { marginRight: 30 }]}>{currency(currentData?.gaji_bersih || 0)}</Text>
              </View>
              <View style={stylesPdf.rowItemSum}>
                <Text style={[stylesPdf.th, { width: '60%' }]}>{''}</Text>
                <Text style={stylesPdf.tdValue}>{''}</Text>
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
                {'Tangerang Selatan, '} {currentData.tanggal} {currentData.nama_bulan} {currentData.tahun}
              </Text>
              <Image style={stylesPdf.ttdCap} src={ttdGeneralManager} />
              <Text style={stylesPdf.companyAddress}>Muhammad Taqwa Aziz</Text>
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
            <PDFViewer fileName={'payslip.pdf'} style={{ width: '100%', height: 500 }}>
              <MyDocument />
            </PDFViewer>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>

    // <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    //   <Grid container spacing={3}>
    //     <Grid item xs={12}>
    //       <Card sx={{ p: 3 }}>
    //         <Box
    //           sx={{
    //             display: 'grid',
    //             columnGap: 2,
    //             rowGap: 3,
    //             gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
    //           }}
    //         >
    //           <RHFTextField name="kodePtkp" label="Kode PTKP" />
    //           <RHFTextField
    //               name="besaranPtkp"
    //               label="Besaran(Rp)"
    //               placeholder="0.00"
    //               value={getValues('besaranPtkp') === 0 ? '' : getValues('besaranPtkp')}
    //               onChange={(event) => setValue('besaranPtkp', Number(event.target.value))}
    //               InputLabelProps={{ shrink: true }}
    //               InputProps={{
    //                 startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
    //                 type: 'number',
    //               }}
    //             />
    //           <RHFTextField name="keteranganPtkp" label="Keterangan" />

    //           <RHFSelect name="statusPtkp" label="Status PTKP" placeholder="Status PTKP">
    //             <option value="" />
    //             {statusPtkp.map((option) => (
    //               <option key={option.code} value={option.label}>
    //                 {option.label}
    //               </option>
    //             ))}
    //           </RHFSelect>
    //         </Box>

    //         <Stack alignItems="flex-end" sx={{ mt: 3 }}>
    //           <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
    //             {'Simpan'}
    //           </LoadingButton>
    //         </Stack>
    //       </Card>
    //     </Grid>
    //   </Grid>
    // </FormProvider>
  );
}
