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
  currentUser: {},
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
      console.log('STATE UJIAN ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },

    // GET UJIAN
    getUjianSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.ujian = action.payload;

      console.log('STATE UJIAN REDUX', state.ujian);
      state.message = 'Berhasil Mengambil Data';
    },

    // CREATE UJIAN
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

    // SET CURRENT UJIAN
    setCurrentUjianSuccess(state, action) {
      state.isLoading = false;
      state.currentUjian = action.payload;
      console.log('CURRENT UJIAN DI UJIAN', state.currentUjian);
    },

    // RESET UJIAN
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
    const response = await axios.get('/ujian', header);
    console.log('redux getUsers', response);
    window.localStorage.setItem('ujianList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getUjianSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export async function getUjianActive() {
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
    const response = await axios.post('/user/active', null, header);
    console.log('redux getUjian', response);
    window.localStorage.setItem('ujianList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getUjianSuccess(response.data));
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
    const response = await axios.post('/ujian', newUjian, header);

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

    const response = await axios.post(`/ujian/update/${ujianId}`, updateUjian, header);

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

    const response = await axios.delete(`/ujian/delete/${ujianId}`, header);
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