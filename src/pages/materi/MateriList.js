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
import useSettings from '../../hooks/useSettings';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { useDispatch, useSelector } from '../../redux/store';

import { getMateri, setCurrentMateri, resetMateri, deleteMateri } from '../../redux/slices/materi';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';

// sections
import { MateriListHead, MateriListToolbar, MateriMoreMenu } from '../../sections/@dashboard/materi/list';
import { DialogAnimate } from '../../components/animate';
import LoadingScreen from '../../components/LoadingScreen';
import SearchNotFound from '../../components/SearchNotFound';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  //   { id: 'idMateri', label: 'ID Kelas', alignRight: false },
  { id: 'judul', label: 'Judul', alignRight: false },
  { id: 'guru', label: 'Guru', alignRight: false },
  { id: 'deskripsi', label: 'Deskripsi', alignRight: false },
  { id: 'kelas', label: 'Kelas', alignRight: false },
  { id: '' },
];

const dummyMateri = [
  { judul: 'Materi A', guru: 'Lizza', kelas: 'X.IPA.1', deskripsi: 'Deskripsi' },
  { judul: 'Materi B', guru: 'Dhiya', kelas: 'X.IPS.1', deskripsi: 'Deskripsi' },
  { judul: 'Materi C', guru: 'Didi', kelas: 'X.IPS.2', deskripsi: 'Deskripsi' },
];

export default function MateriList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [list, setList] = useState();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteIdMateri, setDeleteIdMateri] = useState();

  let msg = '';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { materi } = useSelector((state) => state.materi);
  let materiList = [];
  try {
    materiList = materi?.data?.result;
    console.log('Materi list data: ', materiList);
  } catch (e) {
    console.log(e);
  }

  useEffect(async () => {
    setLoading(true);
    const action = window.localStorage.getItem('action');
    window.localStorage.removeItem('currentMateri');
    try {
      await dispatch(getMateri());
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - materiList.length) : 0;

  const filteredMateri = applySortFilter(materiList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredMateri.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleDeleteMateri = async (materiId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.localStorage.setItem('action', 'delete');
    dispatch(deleteMateri(materiId))
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          enqueueSnackbar('Berhasil menghapus data');
        }, 1000);

        setLoading(true);
        dispatch(getMateri());
        handleCloseModal();
        handleCloseErrorModal();
        setLoading(false);
      })
      .catch((e) => {
        console.log('ERROR', e);
        const error = e;
        Object.keys(error).forEach((key) => {
          console.log(error[key][0]); // 👉️ "Tom", "Chile"
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

  const handleCloseDetail = () => {
    setOpenDetail(false);
    window.location.reload();
  };

  const handleCreateMateri = () => {
    dispatch(resetMateri());
    window.localStorage.removeItem('currentMateri');
    window.localStorage.setItem('action', 'create');
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const handleOpenDeleteModal = (idMateri) => {
    setDeleteIdMateri(parseInt(idMateri, 10));
    setOpen(true);
  };

  const handleDetailMateri = (materi) => {
    console.log('UPDATE Materi LIST', materi);
    dispatch(setCurrentMateri(materi));
    window.localStorage.setItem('currentMateri', JSON.stringify(materi));
  };

  const handleUpdateMateri = (materi) => {
    console.log('UPDATE Materi LIST', materi);
    dispatch(setCurrentMateri(materi));
    window.localStorage.setItem('currentMateri', JSON.stringify(materi));
    window.localStorage.setItem('action', 'update');
  };

  return (
    <Page title="Materi">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Materi"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Materi' }]}
          action={
            <Button
              onClick={() => handleCreateMateri()}
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.materi.form}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tambah
            </Button>
          }
        />
        <Card>
          <MateriListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer>
              <Table>
                <MateriListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={materiList.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredMateri.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const idMateri = row.materi_id;
                    const judul = row.materi_name;
                    const guru = row.user_name;
                    const kelas = row.kelas_name;
                    const deskripsi = row.deskripsi;
                    const isItemSelected = selected.indexOf(idMateri) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idMateri}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                        </TableCell> */}
                        {/* <TableCell align="left">{idMateri}</TableCell> */}
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {judul}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{guru}</TableCell>
                        <TableCell align="left">{deskripsi}</TableCell>
                        <TableCell align="left">{kelas}</TableCell>
                        <TableCell align="right">
                          <MateriMoreMenu
                            onDetail={() => handleDetailMateri(row)}
                            onDelete={() => handleOpenDeleteModal(idMateri)}
                            onUpdate={() => handleUpdateMateri(row)}
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
            count={materiList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {/* <DialogAnimate open={openDetail} onClose={handleCloseDetail}>
          <DialogTitle>Konfirmasi Buka Data</DialogTitle>
          <DialogContent>
            <DialogContentText>Data akan terhapus secara permanen. Apakah anda yakin?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetail}>Kembali</Button>
            <Button onClick={() => handleDetailMateri(detailIdMateri)} autoFocus color="error">
              Yakin
            </Button>
          </DialogActions>
        </DialogAnimate> */}
        
        <DialogAnimate open={open} onClose={handleCloseModal}>
          <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
          <DialogContent>
            <DialogContentText>Data akan terhapus secara permanen. Apakah anda yakin?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Kembali</Button>
            <Button onClick={() => handleDeleteMateri(deleteIdMateri)} autoFocus color="error">
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
    return array?.filter((materi) => materi?.namaLengkap.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
