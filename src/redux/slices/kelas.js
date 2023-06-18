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
  kelas: [],
  isOpenModal: false,
  currentKelas: {},
  message: '',
  status: 0,
  success: false,
  createdKelas: {},
  updatedKelas: {},
  deletedKelas: {},
};

const slice = createSlice({
  name: 'kelas',
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
      console.log('STATE KELAS ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },

    // GET KELAS
    getKelasSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.kelas = action.payload;

      console.log('STATE KELAS REDUX', state.kelas);
      state.message = 'Berhasil Mengambil Data';
    },

    // CREATE KELAS
    createKelasSuccess(state, action) {
      const newKelas = action.payload;
      state.isLoading = false;
      state.createdKelas = newKelas;
      state.message = 'Berhasil Menambah Data';
    },

    // UPDATE EVENT
    updateKelasSuccess(state, action) {
      const updateKelas = action.payload;
      state.isLoading = false;
      state.updatedKelas = updateKelas;
      state.message = 'Berhasil Mengubah Data';
    },

    // DELETE EVENT
    deleteKelasSuccess(state, action) {
      state.deletedKelas = action.payload;
      state.isLoading = false;
      state.message = 'Berhasil Menghapus Data';
    },

    // SET CURRENT KELAS
    setCurrentKelasSuccess(state, action) {
      state.isLoading = false;
      state.currentKelas = action.payload;
      console.log('CURRENT KELAS DI KELAS', state.currentKelas);
    },

    // RESET KELAS
    resetKelasSuccess(state, action) {
      state.isLoading = false;
      state.currentKelas = {};
      state.message = '';
    },
  },
});

// Reducer
export default slice.reducer;

export async function getKelas() {
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
    const response = await axios.get('/kelas/all', header);
    console.log('Success redux getKelas', response);
    window.localStorage.setItem('kelasList', JSON.stringify(response.data));
    dispatch(slice.actions.getKelasSuccess(response));
    console.log('dibawah kelas')
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export function createKelas(newKelas) {
  return async () => {
    console.log(newKelas);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/kelas', newKelas, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.createKelasSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function setCurrentKelas(currentKelas) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentKelasSuccess(currentKelas));
    return a;
  };
}

export function resetKelas() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetKelasSuccess());
  };
}

export function updateKelas(kelasId, updateKelas) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.patch(`/kelas/update/${kelasId}`, updateKelas, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updateKelasSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function deleteKelas(kelasId) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.delete(`/kelas/delete/${kelasId}`, header);
    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.deleteKelasSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
