import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
//
import { fNumber } from '../../../../utils/formatNumber';

import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------
AnalyticsTotalGajiBulanan.propTypes = {
  data: PropTypes.array
};

const CHART_DATA = [
  {
    name: 'User',
    type: 'line',
    data: [1,2,3,4,5,6,7,8,9,1,2,3],
  }
];

export default function AnalyticsTotalGajiBulanan({data}) {
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
      bar: { horizontal: false, barHeight: '28%', borderRadius: 2 },
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Okt',
        'Nov',
        'Des',
      ],
    },
  });

  return (
    <Card>
      <CardHeader title="Total Budget Gaji Bulanan"/>
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={data} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
