import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch, store } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: [],
  notifikasi: [],
  isOpenModal: false,
  message: '',
  status: 0,
  success: false,
};

const slice = createSlice({
  name: 'notifikasi',
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
      console.log('STATE NOTIFIKASI ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },
    // GET NOTIFIKASI
    getNotifikasiSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.notifikasi = action.payload;

      console.log('STATE NOTIFIKASI REDUX', state.notifikasi);
      state.message = 'Berhasil Mengambil Data';
    },

    // GET NOTIFIKASI
    getNotifikasiByAuthSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.notifikasi = action.payload;

      console.log('STATE NOTIFIKASI REDUX', state.notifikasi);
      state.message = 'Berhasil Mengambil Data';
    },

    // UPDATE NOTIFIKASI
    updateNotifikasiSuccess(state, action){
        console.log(state);
        console.log(action);
        state.notifikasi = action.payload;

        console.log('STATE NOTIFIKASI REDUX', state.notifikasi);
        state.message = 'Berhasil Mengambil Data';
    },
  },
});

// Reducer
export default slice.reducer;

export function getNotifikasiByAuth() {
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
    const response = await axios.post('/notifikasi/by-auth', null, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.getNotifikasiByAuthSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function getNotifikasi() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get('/notifikasi', header);
    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.getNotifikasiSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function updateNotifikasi() {
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
      const response = await axios.post('/notifikasi/update', null, header);
  
      const status = response.status;
      const data = response.data;
  
      let a = null;
  
      if (status === 200) {
        a = dispatch(slice.actions.updateNotifikasiSuccess(data));
      } else {
        a = dispatch(slice.actions.hasError(response));
      }
  
      return a;
    };
  }




