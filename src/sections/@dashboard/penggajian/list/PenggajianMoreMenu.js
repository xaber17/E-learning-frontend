import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { MenuItem, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';

// ----------------------------------------------------------------------

PenggajianMoreMenu.propTypes = {
  onDetail: PropTypes.func,
};

export default function PenggajianMoreMenu({ onDetail, role, status }) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  let label = '';

  if (role === 'manhrd') {
    if (status === '1') {
      label = 'Persetujuan';
    } else if (status !== '1') {
      label = 'Detail';
    }
  } else if (role === 'gm') {
    if (status === '2') {
      label = 'Verifikasi';
    } else if (status !== '2') {
      label = 'Detail';
    }
  } else if (role === 'stafpayroll') {
    label = 'Detail';
  } else if (role === 'stafinv') {
    label = 'Detail';
  }

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem
          onClick={onDetail}
          component={RouterLink}
          to={role === 'stafinv' ? PATH_DASHBOARD.penggajian.status : PATH_DASHBOARD.penggajian.form}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />
          {label}
        </MenuItem>
      </MenuPopover>
    </>
  );
}
