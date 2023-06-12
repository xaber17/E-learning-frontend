import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------
AnalyticsRole.propTypes = {
  data: PropTypes.array
};

// const CHART_DATA = [4344, 5435];

export default function AnalyticsRole({data, labels}) {
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      '#f94144',
      '#f3722c',
      '#f8961e',
      '#f9c74f',
      '#90be6d',
      '#43aa8b',
      '#577590',
      '#277da1',
      '#5d4b20',
    ],
    labels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: true } } },
    },
  });

  return (
    <Card>
      <CardHeader title="Role" />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="donut" series={data} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}
