import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, InputAdornment, Button } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';

import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------

DetailStatusPenggajianListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDeleteUsers: PropTypes.func,
};

export default function DetailStatusPenggajianListToolbar({ numSelected, filterName, onFilterName, onUpdate }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? 'primary.main' : 'text.primary',
          bgcolor: isLight ? 'primary.lighter' : 'primary.dark',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <InputStyle
          stretchStart={240}
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder="Search Penggajian"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Dikirim">
          {/* <IconButton onClick={onDeleteUsers}>
            <Iconify icon={"ci:transfer"} />
          </IconButton> */}
          <Button
          onClick={onUpdate}
            variant="contained"
            //   component={RouterLink}
            //   to={PATH_DASHBOARD.slipGaji.detail}
            startIcon={<Iconify icon={'ci:transfer'} />}
          >
            Dikirim
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon={'ic:round-filter-list'} />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
