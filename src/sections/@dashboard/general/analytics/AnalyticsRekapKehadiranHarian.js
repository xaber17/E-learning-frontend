import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
// utils
import { fNumber } from '../../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

// const CHART_DATA = [{ data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380] }];

AnalyticsRekapKehadiranHarian.propTypes = {
  data: PropTypes.array
};

export default function AnalyticsRekapKehadiranHarian({data}) {
  const theme = useTheme();
  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 },
    },
    xaxis: {
      categories: [
        'Hadir',
        'Absen',
        'Izin',
        'Sakit',
      ],
    },

  });

  return (
    <Card>
      <CardHeader title="Rekap Kehadiran Harian" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={data} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
