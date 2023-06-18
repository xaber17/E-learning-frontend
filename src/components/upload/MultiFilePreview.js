import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import { List, Stack, Button, IconButton, ListItemText, ListItem } from '@mui/material';
// utils
import { fData } from '../../utils/formatNumber';
//
import Image from '../Image';
import Iconify from '../Iconify';
import { varFade } from '../animate';

// ----------------------------------------------------------------------

const getFileData = (file) => {
  if (typeof file === 'string') {
    return {
      key: file,
    };
  }
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.preview,
  };
};

// ----------------------------------------------------------------------

MultiFilePreview.propTypes = {
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
};

export default function MultiFilePreview({ files, onRemove, onRemoveAll }) {
  const hasFile = files.length > 0;

  return (
    <>
      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        <AnimatePresence>
          {files.map((file) => {
            const { key, name, size, preview } = getFileData(file);

            return (
              <ListItem
                key={key}
                component={m.div}
                {...varFade().inRight}
                sx={{
                  my: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: 0.75,
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Iconify icon={'eva:file-fill'} sx={{ width: 28, height: 28, color: 'text.secondary', mr: 2 }} />

                <ListItemText
                  primary={isString(file) ? file : name}
                  secondary={isString(file) ? '' : fData(size || 0)}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />

                <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                  <Iconify icon={'eva:close-fill'} />
                </IconButton>
              </ListItem>
            );
          })}
        </AnimatePresence>
      </List>
    </>
  );
}
