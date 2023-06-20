import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import Page from '../../components/Page';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { useDispatch, useSelector } from '../../redux/store';

import { getUjian, setCurrentUjian, resetUjian, deleteUjian } from '../../redux/slices/ujian';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';

// sections
import { DialogAnimate } from '../../components/animate';
import LoadingScreen from '../../components/LoadingScreen';
import SearchNotFound from '../../components/SearchNotFound';
import { UjianListHead, UjianListToolbar, UjianMoreMenu } from '../../sections/@dashboard/ujian/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  //   { id: 'idUjian', label: 'ID Kelas', alignRight: false },
  { id: 'nama', label: 'Nama', alignRight: false },
  { id: 'kelas', label: 'Kelas', alignRight: false },
  { id: 'tipe', label: 'Tipe', alignRight: false },
  { id: 'deadline', label: 'Deadline', alignRight: false },
  { id: '' },
];

const dummyUjian = [
  { nama: 'Ujian A', kelas: 'X.IPA.1', deadline: 'Deadline' },
  { nama: 'Ujian B', kelas: 'X.IPS.1', deadline: 'Deadline' },
  { nama: 'Ujian C', kelas: 'X.IPS.2', deadline: 'Deadline' },
];

export default function UjianList() {
  const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [list, setList] = useState();
  const [open, setOpen] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteIdUjian, setDeleteIdUjian] = useState();
  let msg = '';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { ujian } = useSelector((state) => state.ujian);
  let ujianList = [];
  try {
    ujianList = ujian?.data?.result || [];
    console.log('Ujian list data: ', ujianList);
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const action = window.localStorage.getItem('action');
      window.localStorage.removeItem('currentUjian');
      try {
        await dispatch(getUjian());
      } catch (e) {
        console.log('ERROR', e);
      }

      if (action === 'delete') {
        enqueueSnackbar('Berhasil menghapus data');
        window.localStorage.removeItem('action');
      } else if (action === 'create') {
        enqueueSnackbar('Berhasil menambah data');
        window.localStorage.removeItem('action');
      } else if (action === 'update') {
        enqueueSnackbar('Berhasil mengubah data');
        window.localStorage.removeItem('action');
      }

      setLoading(false);
    })();
  }, [dispatch]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('noInduk');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ujianList.length) : 0;

  const filteredUjian = applySortFilter(ujianList, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUjian.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleDeleteUjian = async (ujianId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.localStorage.setItem('action', 'delete');
    dispatch(deleteUjian(ujianId))
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          enqueueSnackbar('Berhasil menghapus data');
        }, 1000);

        setLoading(true);
        dispatch(getUjian());
        handleCloseModal();
        handleCloseErrorModal();
        setLoading(false);
      })
      .catch((e) => {
        console.log('ERROR', e);
        const error = e;
        Object.keys(error).forEach((key) => {
          console.log(error[key][0]);
          const errMessage = error[key][0];

          msg = msg.concat(errMessage);
        });

        console.log('ERROR MESSAGE', msg);
        setErrorMessage(msg);
        handleCloseModal();
        setOpenErrorModal(true);
        handleCloseErrorModal();
      });
  };

  const handleCloseModal = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const handleOpenDeleteModal = (idUjian) => {
    setDeleteIdUjian(parseInt(idUjian, 10));
    setOpen(true);
  };

  const handleUpdateUjian = (ujian) => {
    console.log('UPDATE UJIAN LIST', ujian);
    dispatch(setCurrentUjian(ujian));
    window.localStorage.setItem('currentUjian', JSON.stringify(ujian));
    window.localStorage.setItem('action', 'update');
  };

  return (
    <Page title="Ujian">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Ujian"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Ujian' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.ujian.form}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tambah
            </Button>
          }
        />
        <Card>
          <UjianListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer>
              <Table>
                <UjianListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={ujianList.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUjian.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const idUjian = row.soal_id;
                    const nama = row.soal_name;
                    const isItemSelected = selected.indexOf(idUjian) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idUjian}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {nama}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{row.kelas_name}</TableCell>
                        <TableCell align="left">{row.tipe_soal}</TableCell>
                        <TableCell align="left">{row.deadline}</TableCell>
                        <TableCell align="right">
                          <UjianMoreMenu
                            onDelete={() => handleOpenDeleteModal(idUjian)}
                            onUpdate={() => handleUpdateUjian(row)}
                            // role={user.role}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={ujianList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <DialogAnimate open={open} onClose={handleCloseModal}>
          <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
          <DialogContent>
            <DialogContentText>Data akan terhapus secara permanen. Apakah anda yakin?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Kembali</Button>
            <Button onClick={() => handleDeleteUjian(deleteIdUjian)} autoFocus color="error">
              Yakin
            </Button>
          </DialogActions>
        </DialogAnimate>

        <DialogAnimate open={openErrorModal} onClose={handleCloseErrorModal}>
          <DialogTitle>Gagal menambah data</DialogTitle>
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
          </DialogContent>
        </DialogAnimate>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array?.filter((_ujian) => _ujian?.namaLengkap.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
