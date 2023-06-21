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
  ujian: [],
  isOpenModal: false,
  currentUjian: {},
  message: '',
  status: 0,
  success: false,
  createdUjian: {},
  updatedUjian: {},
  deletedUjian: {},
};

const slice = createSlice({
  name: 'ujian',
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
    getUjianSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.ujian = action.payload;

      console.log('STATE KELAS REDUX', state.ujian);
      state.message = 'Berhasil Mengambil Data';
    },

    // CREATE KELAS
    createUjianSuccess(state, action) {
      const newUjian = action.payload;
      state.isLoading = false;
      state.createdUjian = newUjian;
      state.message = 'Berhasil Menambah Data';
    },

    // UPDATE EVENT
    updateUjianSuccess(state, action) {
      const updateUjian = action.payload;
      state.isLoading = false;
      state.updatedUjian = updateUjian;
      state.message = 'Berhasil Mengubah Data';
    },

    // DELETE EVENT
    deleteUjianSuccess(state, action) {
      state.deletedUjian = action.payload;
      state.isLoading = false;
      state.message = 'Berhasil Menghapus Data';
    },

    // SET CURRENT KELAS
    setCurrentUjianSuccess(state, action) {
      state.isLoading = false;
      state.currentUjian = action.payload;
      console.log('CURRENT Ujian DI Ujian', state.currentUjian);
    },

    // RESET KELAS
    resetUjianSuccess(state, action) {
      state.isLoading = false;
      state.currentUjian = {};
      state.message = '';
    },
  },
});

// Reducer
export default slice.reducer;

export async function getUjian() {
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
    const response = await axios.get('/soal/all', header);
    console.log('redux getUjian', response);
    window.localStorage.setItem('ujianList', JSON.stringify(response?.data));
    dispatch(slice.actions.getUjianSuccess(response));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export function createUjian(newUjian) {
  return async () => {
    console.log(newUjian);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/soal', newUjian, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.createUjianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function setCurrentUjian(currentUjian) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentUjianSuccess(currentUjian));
    return a;
  };
}

export function resetUjian() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetUjianSuccess());
  };
}

export function updateUjian(ujianId, updateUjian) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.patch(`/soal/update/${ujianId}`, updateUjian, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updateUjianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function deleteUjian(ujianId) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.delete(`/soal/delete/${ujianId}`, header);
    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.deleteUjianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
