import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
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
} from '@mui/material';

import { useDispatch, useSelector } from '../../redux/store';

import { getPenggajianByNip, getSlipGaji, setCurrentSlipGaji } from '../../redux/slices/slipGaji';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { DialogAnimate } from '../../components/animate';
import LoadingScreen from '../../components/LoadingScreen';
// sections
import { SlipGajiListHead, SlipGajiListToolbar, SlipGajiMoreMenu } from '../../sections/@dashboard/slipgaji/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'kode_penggajian', label: 'Kode Penggajian', alignRight: false },
  { id: 'bulan_penggajian', label: 'Bulan', alignRight: false },
  { id: 'tahu_penggajian', label: 'Tahun', alignRight: false },
  { id: 'status_penggajian_detail', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function SlipGajiList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const { penggajian } = useSelector((state) => state.slipGaji);
  let penggajianList = [];
  try {
    penggajianList = penggajian.data;
    console.log(penggajianList);
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    setLoading(true);
    window.localStorage.removeItem('currentKodePenggajian');
    try {
      dispatch(getPenggajianByNip());
    } catch (e) {
      console.log('ERROR', e);
    }
    setLoading(false);
  }, [dispatch]);

  const [users, setUsers] = useState(_userList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteUser = (userId) => {
    const deleteUser = penggajianList.filter((user) => user.id !== userId);
    setSelected([]);
    setUsers(deleteUser);
  };

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = penggajianList.filter((user) => !selected.includes(user.name));
    setSelected([]);
    setUsers(deleteUsers);
  };

  const handleDetail = (data) => {
    console.log(data);
    // dispatch(getSlipGajiDetail(kode));
    // window.localStorage.removeItem('currentAbsensi');
    window.localStorage.setItem('currentKodePenggajian', data);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - penggajianList.length) : 0;

  const filteredPenggajian = applySortFilter(penggajianList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredPenggajian?.length && Boolean(filterName);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Page title="Slip Gaji">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Slip Gaji"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Slip Gaji' }]}
        />

        <Card>
          <SlipGajiListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SlipGajiListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={penggajianList?.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredPenggajian?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const kodePenggajian = row.kode_penggajian;
                    const bulan = row.bulan_penggajian;
                    const tahun = row.tahun_penggajian;
                    const status = row.status_penggajian_detail;
                    const namaStatus = row.nama_status_penggajian_detail;

                    const isItemSelected = selected.indexOf(kodePenggajian) !== -1;

                    return (
                      <TableRow
                        hover
                        key={kodePenggajian}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {kodePenggajian}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{bulan}</TableCell>
                        <TableCell align="left">{tahun}</TableCell>
                        <TableCell align="left">{namaStatus}</TableCell>
                        <TableCell align="right">
                          <SlipGajiMoreMenu onDetail={() => handleDetail(kodePenggajian)} />
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
            count={penggajianList?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
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
    return array?.filter((mb) => mb?.kode_penggajian.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}
