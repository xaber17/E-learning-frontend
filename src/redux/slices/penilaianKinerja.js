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
  penilaianKinerja: [],
  isOpenModal: false,
  currentPenilaianKinerja: {},
  message: '',
  status: 0,
  success: false,
  createdPenilaianKinerja: {},
  updatedPenilaianKinerja: {},
  deletedPenilaianKinerja: {},
  bawahan: [],
  bagian: [],
  jabatan: [],
};

const slice = createSlice({
  name: 'penilaianKinerja',
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
      console.log('STATE PENILAIAN KINERJA ERROR', state.error);
      state.message = 'Terjadi Kesalahan'
    },

    // GET PENILAIAN KINERJA
    getPenilaianKinerjaSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.penilaianKinerja = action.payload;

      console.log('STATE PENILAIAN KINERJA REDUX', state.penilaianKinerja);
      state.message = 'Berhasil Mengambil Data'
    },

    // CREATE PENILAIAN KINERJA
    createPenilaianKinerjaSuccess(state, action) {
      const newPenilaianKinerja = action.payload;
      state.isLoading = false;
      state.createdPenilaianKinerja = newPenilaianKinerja;
      state.message = 'Berhasil Menambah Data'
    },

   
    // SET CURRENT PENILAIAN KINERJA
    setCurrentPenilaianKinerjaSuccess(state, action) {
      state.isLoading = false;
      state.currentPenilaianKinerja = action.payload;
      console.log('CURRENT PENILAIAN KINERJA', state.currentPenilaianKinerja);
    },

    // RESET PENILAIAN KINERJA
    resetPenilaianKinerjaSuccess(state, action) {
      state.isLoading = false;
      state.currentPenilaianKinerja = {};
      state.message = ''
      // state.createdPenilaianKinerja = {};
      // state.updatedPenilaianKinerja = {};
    },

     // GET BAWAHAN
     getBawahanSuccess(state, action) {
        console.log(state);
        console.log(action);
        state.isLoading = false;
        state.bawahan = action.payload.data;
        state.bagian = action.payload.bagian;
        state.jabatan = action.payload.jabatan;

        state.message = 'Berhasil Mengambil Data'
      },
  },
});

// Reducer
export default slice.reducer;

export async function getPenilaianKinerja() {
  // return async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get('/penilaian-kinerja', header);
    console.log('redux getPenilaianKinerja', response);
    window.localStorage.setItem('penilaianKinerjaList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getPenilaianKinerjaSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export function createPenilaianKinerja(newPenilaianKinerja) {
  return async () => {
    console.log(newPenilaianKinerja);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/penilaian-kinerja', newPenilaianKinerja, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.createPenilaianKinerjaSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function setCurrentPenilaianKinerja(currentPenilaianKinerja) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentPenilaianKinerjaSuccess(currentPenilaianKinerja));
    return a;
  };
}

export function resetPenilaianKinerja() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetPenilaianKinerjaSuccess());
  };
}

export async function getBawahan() {
    // return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      console.log(accessToken);
      const header = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.post('/penilaian-kinerja/bawahan', null, header);
      console.log('redux getBawahan', response);
      window.localStorage.setItem('bawahanList', JSON.stringify(response.data.data));
      window.localStorage.setItem('bagianBawahanList', JSON.stringify(response.data.bagian));
      window.localStorage.setItem('jabatanBawahanList', JSON.stringify(response.data.jabatan));

      dispatch(slice.actions.getBawahanSuccess(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
    // };
  }

