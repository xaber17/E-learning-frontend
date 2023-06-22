import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { MenuItem, IconButton } from '@mui/material';
// routes
import useAuth from '../../../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';

// ----------------------------------------------------------------------

UjianMoreMenu.propTypes = {
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  view: PropTypes.func,
  role: PropTypes.string,
  menu: PropTypes.string,
};

export default function UjianMoreMenu({ onDelete, view, onUpdate, role, menu }) {
  const [open, setOpen] = useState(null);

  const { user } = useAuth();

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

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>
      {user.role === 'siswa' ? (
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
          <MenuItem onClick={view} component={RouterLink} to={PATH_DASHBOARD.ujianSiswa.form}>
            <Iconify icon={'mdi:form-select'} sx={{ ...ICON }} />
            Lihat Detail
          </MenuItem>
          {/* <MenuItem onClick={onUpdate} component={RouterLink} to={PATH_DASHBOARD.ujian.form}>
            <Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />
            Ubah
          </MenuItem> */}
        </MenuPopover>
      ) : (
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
          {menu === 'Hasil Ujian' ? (
            <MenuItem onClick={onUpdate} component={RouterLink} to={PATH_DASHBOARD.ujian.hasilForm}>
              <Iconify icon={'icon-park-outline:check-correct'} sx={{ ...ICON }} />
              Koreksi
            </MenuItem>
          ) : (
            <>
              <MenuItem onClick={view} component={RouterLink} to={PATH_DASHBOARD.ujian.hasil}>
                <Iconify icon={'mdi:form-select'} sx={{ ...ICON }} />
                Lihat Hasil
              </MenuItem>
              <MenuItem onClick={onUpdate} component={RouterLink} to={PATH_DASHBOARD.ujian.form}>
                <Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />
                Ubah
              </MenuItem>
              <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
                <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
                Hapus
              </MenuItem>
            </>
          )}
        </MenuPopover>
      )}
    </>
  );
}
