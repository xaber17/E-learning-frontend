import { paramCase, capitalCase } from 'change-case';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  Stack,
} from '@mui/material';

import { useDispatch, useSelector } from '../../redux/store';
import {
  getPenggajianDetail,
  kelolaStatusPenggajianDetail,
  resetPenggajianDetail,
} from '../../redux/slices/penggajian';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import LoadingScreen from '../../components/LoadingScreen';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { DialogAnimate } from '../../components/animate';
// sections
import {
  DetailStatusPenggajianListHead,
  DetailStatusPenggajianListToolbar,
} from '../../sections/@dashboard/statuspenggajian/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'nip', label: 'NIP', alignRight: false },
  { id: 'nama_lengkap', label: 'Nama', alignRight: false },
  { id: 'no_rekening', label: 'No. Rekening', alignRight: false },
  { id: 'nama_bank', label: 'Nama Bank', alignRight: false },
  { id: 'gaji_bersih', label: 'Gaji Bersih(Rp)', alignRight: false },
  { id: 'status_penggajian_detail', label: 'Status', alignRight: false },
];

// ----------------------------------------------------------------------

export default function StatusPenggajianDetail() {
  const { themeStretch } = useSettings();
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [kirimGaji, setKirimGaji] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  let msg = '';

  let currentData = {};
  try {
    currentData = JSON.parse(window.localStorage.getItem('currentPenggajian'));
  } catch (e) {
    console.log('ERROR', e);
  }
  const { penggajianDetail } = useSelector((state) => state.penggajian);
  let penggajianDetailList = [];
  try {
    penggajianDetailList = penggajianDetail?.data;
  } catch (e) {
    console.log(e);
  }
  useEffect(() => {
    setLoading(true);
    dispatch(getPenggajianDetail(currentData?.kode_penggajian));
    const kelolaStatus = window.localStorage.getItem('kelolaStatus');
    if (kelolaStatus === 'success') {
      enqueueSnackbar('Berhasil mengubah status penggajian');
      window.localStorage.removeItem('kelolaStatus');
    }
    setLoading(false);
  }, [dispatch]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const pdl = penggajianDetailList;
      const filterpdl = pdl.filter((x) => x.status_penggajian_detail === '3');
      const newSelecteds = filterpdl?.map((n) => n.id_penggajian_detail);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
    console.log(newSelected);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteUser = (userId) => {
    const deleteUser = penggajianDetailList?.filter((user) => user.id !== userId);
    setSelected([]);
    setKirimGaji(deleteUser);
  };

  const handleKirimPenggajian = (selected) => {
    // const selectedPenggajianDetail = penggajianDetailList?.filter((pd) => !selected.includes(pd.id_penggajian_detail));
    console.log(selected);
    setLoading(true);
    const submitData = {
      selected_penggajian_detail: selected,
    };
    dispatch(kelolaStatusPenggajianDetail(currentData?.kode_penggajian, submitData))
      .then((update) => {
        console.log(update);
        window.localStorage.setItem('kelolaStatus', 'success');
        window.location.reload();
        // dispatch(getPenggajianDetail(currentData?.kode_penggajian));

        // navigate(PATH_DASHBOARD.penggajian.list);
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
        setOpenErrorModal(true);
        setTimeout(() => {
          handleCloseErrorModal();
        }, 3000);
      });
    setSelected([]);
    setLoading(false);
  };

  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const handleBack = async () => {
    dispatch(resetPenggajianDetail());
    if (currentData) {
      window.localStorage.removeItem('currentPenggajian');
    }
    window.localStorage.removeItem('action');
    navigate(PATH_DASHBOARD.penggajian.list);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - penggajianDetailList?.length) : 0;

  const filteredPenggajianDetail = applySortFilter(penggajianDetailList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredPenggajianDetail?.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Status Penggajian Detail">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Status Penggajian Detail'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Status Penggajian', href: PATH_DASHBOARD.penggajian.root },
            { name: 'Detail Status Penggajian' },
          ]}
        />
        {/* <Card> */}
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Card>
            <DetailStatusPenggajianListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              onUpdate={() => handleKirimPenggajian(selected)}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <DetailStatusPenggajianListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={penggajianDetailList?.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredPenggajianDetail.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const kodePenggajian = row.kode_penggajian;
                      const idPenggajianDetail = row.id_penggajian_detail;
                      const nip = row.nip;
                      const namaLengkap = row.nama_lengkap;
                      const noRekening = row.no_rek;
                      const namaBank = row.nama_bank;
                      const gajiBersih = row.gaji_bersih;
                      const statusPenggajianDetail = row.status_penggajian_detail;
                      const namaStatusPenggajianDetail = row.nama_status_detail_penggajian;
                      const isItemSelected = selected.indexOf(idPenggajianDetail) !== -1;

                      return (
                        <TableRow
                          hover
                          key={idPenggajianDetail}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            {statusPenggajianDetail === '2' && (
                              <Checkbox checked={isItemSelected} onClick={() => handleClick(idPenggajianDetail)} />
                            )}
                          </TableCell>
                          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle2" noWrap>
                              {nip}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">{namaLengkap}</TableCell>
                          <TableCell align="left">{noRekening}</TableCell>
                          <TableCell align="left">{namaBank}</TableCell>
                          <TableCell align="left">{gajiBersih}</TableCell>
                          <TableCell align="left">{namaStatusPenggajianDetail}</TableCell>
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
              count={penggajianDetailList?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, page) => setPage(page)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Box>
              <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ p: 3 }}>
                <Button variant="contained" color="inherit" onClick={handleBack}>
                  Kembali
                </Button>
                <Box />
              </Stack>
            </Box>
          </Card>
          <DialogAnimate open={openErrorModal} onClose={handleCloseErrorModal}>
            <DialogTitle>Gagal mengubah data</DialogTitle>
            <DialogContent>
              <DialogContentText>{errorMessage}</DialogContentText>
            </DialogContent>
          </DialogAnimate>
        </Container>
        {/* </Card> */}
        {/* <DetailStatusPenggajian currentData={penggajianDetailList} /> */}
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
    return array.filter((_pd) => _pd?.id_penggajian_detail.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}
