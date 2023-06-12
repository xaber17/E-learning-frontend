import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, MobileDatePicker } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  TextField,
  Slider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TablePagination,
  Checkbox,
} from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries, roles, _userList } from '../../../_mock';
// components
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
// List
import { PenggajianDetailListHead, PenggajianDetailListToolbar, PenggajianDetailMoreMenu } from './list';

// ----------------------------------------------------------------------

InputPenggajianDetail.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

const statusUser = [
  { id: 1, code: 'aktif', label: 'Aktif' },
  { id: 2, code: 'tidakAktif', label: 'Tidak Aktif' },
];

const statusPegawai = [
  { id: 1, code: 'tetap', label: 'Pegawai Tetap' },
  { id: 2, code: 'tidakTetap', label: 'Pegawai Tidak Tetap/Tenaga Kerja Lepas' },
];

const metodePajak = [
  { id: 1, code: 'nett', label: 'Nett' },
  { id: 2, code: 'gross', label: 'Gross' },
  { id: 3, code: 'grossup', label: 'Gross Up' },
];

const tarifPtkp = [
  {
    id: 1,
    kodePtkp: 'TK/0',
    besaranPtkp: 54000000,
    keteranganPtkp: 'Wajib Pajak Tidak Kawin Tanpa Tanggungan',
    statusPtkp: 'aktif',
  },
];

const TABLE_HEAD = [
  { id: 'namaPegawai', label: 'Nama', alignRight: false },
  { id: 'nip', label: 'NIP', alignRight: false },
  { id: 'gajiPokok', label: 'Gaji Pokok', alignRight: false },
  // { id: 'tunjanganTetap', label: 'Tunjangan Tetap', alignRight: false },
  { id: 'tunjanganTransporDanMakan', label: 'Tunjangan Transpor dan Makan', alignRight: false },
  { id: 'tunjanganLain', label: 'Tunjangan Lain', alignRight: false },
  { id: 'bonusThr', label: 'Bonus/THR', alignRight: false },
  // { id: 'pengurangan', label: 'Pengurangan', alignRight: false },
  // { id: 'gajiBersih', label: 'Gaji Bersih', alignRight: false },
  // { id: '' },
];

export default function InputPenggajianDetail({ isEdit, currentUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const PenggajianDetailSchema = Yup.object().shape({
    nameLengkap: Yup.string().required('Nama Lengkap wajib diisi'),
    email: Yup.string().required('Email wajib diisi').email(),
    password: Yup.string().required('Kata Sandi wajib diisi'),
    retypePassword: Yup.string().required('Ketik Ulang Kata Sandi wajib diisi'),
    role: Yup.string().required('Role wajib dipilih'),
    statusUsers: Yup.mixed().required('Status wajib dipilih'),
  });

  const theme = useTheme();
  const { themeStretch } = useSettings();

  const [users, setUsers] = useState(_userList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const defaultValues = useMemo(
    () => ({
      namaLengkap: currentUser?.namaLengkap || '',
      email: currentUser?.email || '',
      role: currentUser?.role || '',
      password: currentUser?.password || '',
      statusUsers: currentUser?.statusUser || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(PenggajianDetailSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.user.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = users.map((n) => n.name);
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
    const deleteUser = users.filter((user) => user.id !== userId);
    setSelected([]);
    setUsers(deleteUser);
  };

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = users.filter((user) => !selected.includes(user.name));
    setSelected([]);
    setUsers(deleteUsers);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  const [generate, setGenerate] = useState(false);

  const onGenerate = () => {
    try {
      setGenerate(false);
      setTimeout(() => {
        setGenerate(true);
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
              }}
            >
              <Controller
                name="waktuPembayaranGaji"
                control={control}
                render={({ field }) => (
                  <MobileDatePicker
                    {...field}
                    label="Waktu Pembayaran Gaji"
                    inputFormat="dd/MM/yyyy"
                    views={['day', 'month', 'year']}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                )}
              />
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Controller
                  name="awalPeriode"
                  control={control}
                  render={({ field }) => (
                    <MobileDatePicker
                      {...field}
                      label="Awal Periode"
                      inputFormat="dd/MM/yyyy"
                      views={['day', 'month', 'year']}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  )}
                />
                <Controller
                  name="akhirPeriode"
                  control={control}
                  render={({ field }) => (
                    <MobileDatePicker
                      {...field}
                      label="Akhir Periode"
                      inputFormat="dd/MM/yyyy"
                      views={['day', 'month', 'year']}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  )}
                />
              </Box>
              <RHFTextField name="keteranganPenggajian" label="Keterangan Penggajian" multiline rows={4} />
              <Box
                sx={{
                  justifyContent: 'flex-end',
                  display: 'flex',
                  columnGap: 1,
                  rowGap: 1,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
                }}
              >
                <Button variant="contained" onClick={onGenerate}>
                  Generate Penggajian
                </Button>
              </Box>
              {generate && (
                <Card>
                  <Box>
                    <PenggajianDetailListToolbar
                      numSelected={selected.length}
                      filterName={filterName}
                      onFilterName={handleFilterByName}
                      onDeleteUsers={() => handleDeleteMultiUser(selected)}
                    />

                    <Scrollbar>
                      <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                          <PenggajianDetailListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={users.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                          />
                          <TableBody>
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                              const { id, name, role, status, company, avatarUrl, isVerified } = row;
                              const isItemSelected = selected.indexOf(name) !== -1;

                              return (
                                <TableRow
                                  hover
                                  key={id}
                                  tabIndex={-1}
                                  role="checkbox"
                                  selected={isItemSelected}
                                  aria-checked={isItemSelected}
                                >
                                  {/* <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                            </TableCell> */}
                                  <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle2" noWrap>
                                      {name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">{company}</TableCell>
                                  <TableCell align="left">{company}</TableCell>
                                  <TableCell align="left">{company}</TableCell>
                                  <TableCell align="left">{company}</TableCell>
                                  <TableCell align="left">{company}</TableCell>
                                  {/* <TableCell align="left">{role}</TableCell> */}
                                  {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>
                                  <TableCell align="left">
                                    <Label
                                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                      color={(status === 'banned' && 'error') || 'success'}
                                    >
                                      {sentenceCase(status)}
                                    </Label>
                                  </TableCell>

                                  <TableCell align="right">
                                    <PenggajianDetailMoreMenu />
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
                      count={users.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={(e, page) => setPage(page)}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Box>

                  <Box
                    sx={{
                      justifyContent: 'space-between',
                      display: 'flex',
                      columnGap: 1,
                      rowGap: 1,
                      gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                    }}
                  >
                    <Stack alignItems="flex-start" sx={{ mt: 3 }}>
                      <Button sx={{ m: 1 }} variant="contained" color="inherit">
                        Kembali
                      </Button>
                    </Stack>

                    <Stack
                      alignItems="flex-end"
                      sx={{
                        mt: 3,
                        justifyContent: 'space-between',
                        display: 'inline',
                        columnGap: 1,
                        rowGap: 1,
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                      }}
                    >
                      <LoadingButton
                        sx={{ m: 1 }}
                        type="submit"
                        variant="outlined"
                        color="inherit"
                        loading={isSubmitting}
                      >
                        Simpan Draft
                      </LoadingButton>
                      <LoadingButton sx={{ m: 1 }} type="submit" variant="contained" loading={isSubmitting}>
                        Simpan dan Pesetujuan
                      </LoadingButton>
                    </Stack>
                  </Box>
                </Card>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
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
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
