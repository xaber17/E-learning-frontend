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
  hasil: [],
  isOpenModal: false,
  currentHasil: {},
  message: '',
  status: 0,
  success: false,
  createdHasil: {},
  updatedHasil: {},
  deletedHasil: {},
};

const slice = createSlice({
  name: 'hasil',
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
      console.log('STATE HASIL ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },

    // GET HASIL
    getHasilSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.hasil = action.payload;

      console.log('STATE HASIL REDUX', state.hasil);
      state.message = 'Berhasil Mengambil Data';
    },

    // CREATE HASIL
    createHasilSuccess(state, action) {
      const newHasil = action.payload;
      state.isLoading = false;
      state.createdHasil = newHasil;
      state.message = 'Berhasil Menambah Data';
    },

    // UPDATE EVENT
    updateHasilSuccess(state, action) {
      const updateHasil = action.payload;
      state.isLoading = false;
      state.updatedHasil = updateHasil;
      state.message = 'Berhasil Mengubah Data';
    },

    // DELETE EVENT
    deleteHasilSuccess(state, action) {
      state.deletedHasil = action.payload;
      state.isLoading = false;
      state.message = 'Berhasil Menghapus Data';
    },

    // SET CURRENT HASIL
    setCurrentHasilSuccess(state, action) {
      state.isLoading = false;
      state.currentHasil = action.payload;
      console.log('CURRENT Hasil DI Hasil', state.currentHasil);
    },

    // RESET HASIL
    resetHasilSuccess(state, action) {
      state.isLoading = false;
      state.currentHasil = {};
      state.message = '';
    },
  },
});

// Reducer
export default slice.reducer;

export async function getHasil(body) {
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
    const response = await axios.post('/jawaban/all', body, header);
    console.log('redux getHasil', response);
    window.localStorage.setItem('hasilList', JSON.stringify(response.data));
    dispatch(slice.actions.getHasilSuccess(response));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export function createHasil(newHasil) {
  return async () => {
    console.log(newHasil);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/hasil', newHasil, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.createHasilSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function setCurrentHasil(currentHasil) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentHasilSuccess(currentHasil));
    return a;
  };
}

export function resetHasil() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetHasilSuccess());
  };
}

export function updateHasil(hasilId, updateHasil) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.patch(`/soal/update/${hasilId}`, updateHasil, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updateHasilSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function deleteHasil(hasilId) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.delete(`/soal/delete/${hasilId}`, header);
    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.deleteHasilSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
