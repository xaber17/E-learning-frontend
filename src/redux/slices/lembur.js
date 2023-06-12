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
  lembur: [],
  isOpenModal: false,
  currentLembur: {},
  message: '',
  status: 0,
  success: false,
  createdLembur: {},
  updatedLembur: {},
  deletedLembur: {},
  bagian: [],
  jabatan: [],
};

const slice = createSlice({
  name: 'lembur',
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
      console.log('STATE LEMBUR ERROR', state.error);
      state.message = 'Terjadi Kesalahan'
    },

    // GET LEMBUR
    getLemburSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.lembur = action.payload;

      console.log('STATE LEMBUR REDUX', state.lembur);
      state.message = 'Berhasil Mengambil Data'
    },

    // CREATE LEMBUR
    createLemburSuccess(state, action) {
      const newLembur = action.payload;
      state.isLoading = false;
      state.createdLembur = newLembur;
      state.message = 'Berhasil Menambah Data'
    },

   
    // SET CURRENT LEMBUR
    setCurrentLemburSuccess(state, action) {
      state.isLoading = false;
      state.currentLembur = action.payload;
      console.log('CURRENT LEMBUR', state.currentLembur);
    },

    // RESET LEMBUR
    resetLemburSuccess(state, action) {
      state.isLoading = false;
      state.currentLembur = {};
      state.message = ''
      // state.createdLembur = {};
      // state.updatedLembur = {};
    },
  },
});

// Reducer
export default slice.reducer;

export async function getLembur() {
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
    const response = await axios.get('/lembur', header);
    console.log('redux getLembur', response);
    window.localStorage.setItem('lemburList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getLemburSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export function createLembur(newLembur) {
  return async () => {
    console.log(newLembur);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/lembur', newLembur, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.createLemburSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function setCurrentLembur(currentLembur) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentLemburSuccess(currentLembur));
    return a;
  };
}

export function resetLembur() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetLemburSuccess());
  };
}

