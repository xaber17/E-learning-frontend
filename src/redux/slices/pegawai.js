import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch, store } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: [],
  pegawai: [],
  dataInduk: {},
  isOpenModal: false,
  currentPegawai: {},
  message: '',
  status: 0,
  success: false,
  createdPegawai: {},
  updatedPegawai: {},
  deletedPegawai: {},
};

const slice = createSlice({
  name: 'pegawai',
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
      console.log('STATE PEGAWAI ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },

    // GET PEGAWAI
    getPegawaiSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.pegawai = action.payload;

      console.log('STATE PEGAWAI REDUX', state.pegawai);
      state.message = 'Berhasil Mengambil Data';
    },

    // GET DATA AUTH
    getDataIndukSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.dataInduk = action.payload;

      console.log('STATE DATA INDUK REDUX', state.dataInduk);
      state.message = 'Berhasil Mengambil Data';
    },

    // CREATE PEGAWAI
    createPegawaiSuccess(state, action) {
      const newPegawai = action.payload;
      state.isLoading = false;
      state.createdPegawai = newPegawai;
      state.message = 'Berhasil Menambah Data';
    },

    // UPDATE EVENT
    updatePegawaiSuccess(state, action) {
      const updatePegawai = action.payload;
      state.isLoading = false;
      state.updatedPegawai = updatePegawai;
      state.message = 'Berhasil Mengubah Data';
    },

    // DELETE EVENT
    deletePegawaiSuccess(state, action) {
      state.deletedPegawai = action.payload;
      state.isLoading = false;
      state.message = 'Berhasil Menghapus Data';
    },

    // SET CURRENT PEGAWAI
    setCurrentPegawaiSuccess(state, action) {
      state.isLoading = false;
      state.currentPegawai = action.payload;
      console.log('CURRENT PEGAWAI', state.currentPegawai);
    },

    // RESET PEGAWAI
    resetPegawaiSuccess(state, action) {
      state.isLoading = false;
      state.currentPegawai = {};
      state.message = '';
      // state.createdPegawai = {};
      // state.updatedPegawai = {};
    },
  },
});

// Reducer
export default slice.reducer;

export function getPegawai() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      console.log(accessToken);
      const header = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get('/pegawai', header);
      console.log('redux getPegawai', response);
      window.localStorage.setItem('pegawaiList', JSON.stringify(response.data.data));
      dispatch(slice.actions.getPegawaiSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getDataInduk() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      console.log(accessToken);
      const header = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.post('/pegawai-auth', null, header);
      console.log('redux getDataInduk', response);
      window.localStorage.setItem('dataInduk', JSON.stringify(response.data.data));
      dispatch(slice.actions.getDataIndukSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function setCurrentPegawai(currentPegawai) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentPegawaiSuccess(currentPegawai));
    return a;
  };
}

export function resetPegawai() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetPegawaiSuccess());
  };
}

export function updatePegawai(nip, updatePegawai) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/pegawai/${nip}`, updatePegawai, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updatePegawaiSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
