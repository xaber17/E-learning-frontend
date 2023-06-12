import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch, store } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: [],
  penggajian: [],
  slipGaji: {},
  isOpenModal: false,
  currentSlipGaji: {},
  message: '',
  status: 0,
  success: false,
};

const slice = createSlice({
  name: 'slipGaji',
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
      console.log('STATE SLIP GAJI ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },
    // GET SLIP GAJI
    getPenggajianByNipSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.penggajian = action.payload;

      console.log('STATE SLIP GAJI REDUX', state.penggajian);
      state.message = 'Berhasil Mengambil Data';
    },

    // GET SLIP GAJI
    getSlipGajiSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.slipGaji = action.payload;

      console.log('STATE SLIP GAJI REDUX', state.slipGaji);
      state.message = 'Berhasil Mengambil Data';
    },

    // SET CURRENT SLIP GAJI
    setCurrentSlipGajiSuccess(state, action) {
      state.isLoading = false;
      state.currentSlipGaji = action.payload;
      console.log('CURRENT SLIP GAJI', state.currentSlipGaji);
    },

    // RESET SLIP GAJI
    resetSlipGajiSuccess(state, action) {
      state.isLoading = false;
      state.currentSlipGaji = {};
      state.message = '';
      // state.createdSlipGaji = {};
      // state.updatedSlipGaji = {};
    },
  },
});

// Reducer
export default slice.reducer;

export function getPenggajianByNip() {
  return async () => {
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/slip-gaji/by-nip', null, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.getPenggajianByNipSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function getSlipGaji(kodePenggajian) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post(`/slip-gaji/detail/${kodePenggajian}`, null, header);
    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.getSlipGajiSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function setCurrentSlipGaji(currentSlipGaji) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentSlipGajiSuccess(currentSlipGaji));
    return a;
  };
}

export function resetSlipGaji() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetSlipGajiSuccess());
  };
}
