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
  Link,
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
import useAuth from '../../hooks/useAuth';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { useDispatch, useSelector } from '../../redux/store';

import { getHasil, setCurrentHasil, resetHasil, deleteHasil } from '../../redux/slices/hasil';

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
  //   { id: 'idHasil', label: 'ID Kelas', alignRight: false },
  { id: 'siswa', label: 'Nama Siswa', alignRight: false },
  { id: 'kelas', label: 'Kelas', alignRight: false },
  { id: 'nilai', label: 'Nilai', alignRight: false },
  { id: '' },
];

const dummyHasil = [
  { siswa: 'Siswa A', kelas: 'X.IPA.1', nilai: '80' },
  { siswa: 'Siswa B', kelas: 'X.IPS.1', nilai: '90' },
  { siswa: 'Siswa C', kelas: 'X.IPS.2', nilai: '75' },
];

export default function HasilUjian() {
  const title = 'Hasil Ujian';
  const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [list, setList] = useState();
  const [open, setOpen] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteIdHasil, setDeleteIdHasil] = useState();
  let msg = '';
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { hasil } = useSelector((state) => state.hasil);
  let hasilList = [];
  try {
    hasilList = hasil?.data?.result;
    console.log('HASIL LIST', hasilList);
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    setLoading(true);
    const action = window.localStorage.getItem('action');
    window.localStorage.removeItem('currentHasil');
    const curr = JSON.parse(window.localStorage.getItem('soalId'));
    try {
      const body = {
        soalId: curr.soal_id,
      };
      dispatch(getHasil(body));
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - hasilList.length) : 0;

  const filteredHasil = applySortFilter(hasilList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredHasil.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleDeleteHasil = async (hasilId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.localStorage.setItem('action', 'delete');
    dispatch(deleteHasil(hasilId))
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          enqueueSnackbar('Berhasil menghapus data');
        }, 1000);

        setLoading(true);
        dispatch(getHasil());
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

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const handleOpenDeleteModal = (idHasil) => {
    setDeleteIdHasil(parseInt(idHasil, 10));
    setOpen(true);
  };

  const handleUpdateHasil = (hasil) => {
    console.log('UPDATE USER LIST', hasil);
    dispatch(setCurrentHasil(hasil));
    window.localStorage.setItem('currentHasil', JSON.stringify(hasil));
    window.localStorage.setItem('action', 'update');
  };

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Ujian', href: PATH_DASHBOARD.ujian.list },
            { name: title },
          ]}
          // action={
          //   <Button
          //     //   onClick={() => handleCreateHasil()}
          //     variant="contained"
          //     component={RouterLink}
          //     to={PATH_DASHBOARD.ujian.form}
          //     startIcon={<Iconify icon={'eva:plus-fill'} />}
          //   >
          //     Tambah
          //   </Button>
          // }
        />
        <Card>
          <UjianListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            // onDeleteHasil={() => handleDeleteMultiHasil(selected)}
          />

          <Scrollbar>
            <TableContainer>
              <Table>
                <UjianListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={hasilList.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredHasil.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const idHasil = row.idHasil;
                    const siswa = row.siswa;
                    const kelas = row.kelas;
                    const nilai = row.nilai;
                    const isItemSelected = selected.indexOf(idHasil) !== -1;

                    return (
                      <TableRow
                        hover
                        key={idHasil}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                        </TableCell> */}
                        {/* <TableCell align="left">{idHasil}</TableCell> */}
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {siswa}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{kelas}</TableCell>
                        <TableCell align="left">{nilai}</TableCell>
                        <TableCell align="right">
                          <UjianMoreMenu
                            onDelete={() => handleOpenDeleteModal(idHasil)}
                            role={user.role}
                            menu={title}
                          />
                        </TableCell>
                        {/* <TableCell align="left">{userRole}</TableCell> */}
                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                        {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={statusHasil === 'non-aktif' ? 'error' : 'success'}
                          >
                            {statusHasil === 'non-aktif' ? 'Non Aktif' : 'Aktif'}
                          </Label>
                        </TableCell> */}

                        {/* <TableCell align="right">
                          <UjianMoreMenu
                            // onUpdate={() => handleUpdateHasil(row)}  => handle detail ujian
                            onDelete={() => handleOpenDeleteModal(idHasil)}
                            onUpdate={() => handleUpdateHasil(row)}
                          />
                        </TableCell> */}
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
            count={hasilList.length}
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
            <Button onClick={() => handleDeleteHasil(deleteIdHasil)} autoFocus color="error">
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
    return array?.filter((_hasil) => _hasil?.namaLengkap.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
