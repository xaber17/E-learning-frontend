import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch, store } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: [],
  gajiPokokTunjangan: [],
  isOpenModal: false,
  currentGajiPokokTunjangan: {},
  message: '',
  status: 0,
  success: false,
  updatedGajiPokokTunjangan: {},
};

const slice = createSlice({
  name: 'gajiPokokTunjangan',
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
    getGajiPokokTunjanganSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.gajiPokokTunjangan = action.payload;

      console.log('STATE PEGAWAI REDUX', state.gajiPokokTunjangan);
      state.message = 'Berhasil Mengambil Data';
    },

    // UPDATE EVENT
    updateGajiPokokTunjanganSuccess(state, action) {
      const updateGajiPokokTunjangan = action.payload;
      state.isLoading = false;
      state.updatedGajiPokokTunjangan = updateGajiPokokTunjangan;
      state.message = 'Berhasil Mengubah Data';
    },

    // SET CURRENT PEGAWAI
    setCurrentGajiPokokTunjanganSuccess(state, action) {
      state.isLoading = false;
      state.currentGajiPokokTunjangan = action.payload;
      console.log('CURRENT PEGAWAI', state.currentGajiPokokTunjangan);
    },

    // RESET PEGAWAI
    resetGajiPokokTunjanganSuccess(state, action) {
      state.isLoading = false;
      state.currentGajiPokokTunjangan = {};
      state.message = '';
      // state.createdGajiPokokTunjangan = {};
      // state.updatedGajiPokokTunjangan = {};
    },
  },
});

// Reducer
export default slice.reducer;

export function getGajiPokokTunjangan() {
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
      const response = await axios.get('/gaji-pokok-tunjangan', header);
      console.log('redux getGajiPokokTunjangan', response);
      window.localStorage.setItem('gajiPokokTunjanganList', JSON.stringify(response.data.data));
      dispatch(slice.actions.getGajiPokokTunjanganSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function setCurrentGajiPokokTunjangan(currentGajiPokokTunjangan) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentGajiPokokTunjanganSuccess(currentGajiPokokTunjangan));
    return a;
  };
}

export function resetGajiPokokTunjangan() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetGajiPokokTunjanganSuccess());
  };
}

export function updateGajiPokokTunjangan(nip, updateGajiPokokTunjangan) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/gaji-pokok-tunjangan/${nip}`, updateGajiPokokTunjangan, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updateGajiPokokTunjanganSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
