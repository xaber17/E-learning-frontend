import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';
import { noCase } from 'change-case';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';

import { useDispatch, useSelector } from '../../../redux/store';
import { updateNotifikasi, getNotifikasiByAuth } from '../../../redux/slices/notifikasi';
// utils
import { fToNow } from '../../../utils/formatTime';
// _mock_

// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const dispatch = useDispatch();

  const { notifikasi } = useSelector((state) => state.notifikasi);
  console.log('notifikasi', notifikasi);
  useEffect(() => {
    dispatch(getNotifikasiByAuth()).catch((err) => {
      console.log('ERROR', err);
    });
  }, [dispatch]);

  let notifikasiListUnread = [];
  let notifikasiListRead = [];
  try {
    notifikasiListUnread = notifikasi?.data_unread;
    notifikasiListRead = notifikasi?.data_read;
  } catch (e) {
    console.log(e);
  }

  const totalUnRead = notifikasi?.unread || 0;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    dispatch(updateNotifikasi())
      .then((data) => {
        console.log('data update notifikasi', data);
        dispatch(getNotifikasiByAuth());
        setOpen(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        {totalUnRead > 0 ? (
          <Badge badgeContent={totalUnRead} color="error">
            <Iconify icon="eva:bell-fill" width={20} height={20} />
          </Badge>
        ) : (
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        )}
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Anda memiliki {totalUnRead} notifikasi belum dibaca
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButtonAnimate color="primary">
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButtonAnimate>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notifikasiListUnread?.map((notification) => (
              <ListItemButton
                sx={{
                  py: 1.5,
                  px: 2.5,
                  mt: '1px',
                  bgcolor: 'action.selected',
                }}
              >
                <ListItemText
                  primary={
                    <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                      {notification?.deskripsi}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
                      {fToNow(notification?.created_at)}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifikasiListRead?.map((notification) => (
              <ListItemButton
                sx={{
                  py: 1.5,
                  px: 2.5,
                  mt: '1px',
                }}
              >
                <ListItemText
                  primary={
                    <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                      {notification?.deskripsi}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
                      {fToNow(notification?.created_at)}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Scrollbar>
        <Divider sx={{ borderStyle: 'dashed' }} />
      </MenuPopover>
    </>
  );
}
