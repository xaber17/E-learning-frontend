import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch, store } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: [],
  laporan: [],
  pegawai: [],
  isOpenModal: false,
  message: '',
  success: false,
};

const slice = createSlice({
  name: 'laporan',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      console.log('STATE LAPORAN ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },

    // GET LAPORAN
    getLaporanSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.laporan = action.payload;

      console.log('STATE LAPORAN REDUX', state.laporan);
      state.message = 'Berhasil Mengambil Data';
    },

    // GET PEGAWAI BY JABATAN
    getPegawaiByJabatanSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.pegawai = action.payload;

      console.log('STATE LAPORAN REDUX', state.pegawai);
      state.message = 'Berhasil Mengambil Data';
    },
  },
});

// Reducer
export default slice.reducer;

export function getLaporan(laporan) {
  return async () => {
    console.log(laporan);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/laporan', laporan, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.getLaporanSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function getPegawaiByJabatan(idJabatan) {
  return async () => {
    console.log(idJabatan);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/pegawai-by-jabatan', idJabatan, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.getPegawaiByJabatanSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
