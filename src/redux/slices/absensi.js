import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch, store } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: [],
  absensi: [],
  indexValidasi: [],
  isOpenModal: false,
  currentAbsensi: {},
  message: '',
  status: 0,
  success: false,
  createdAbsensi: {},
  updatedAbsensi: {},
  deletedAbsensi: {},
  validAbsensi: {},
  tolakAbsensi: {}
};

const slice = createSlice({
  name: 'absensi',
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
      console.log('STATE ABSENSI ERROR', state.error);
      state.message = 'Terjadi Kesalahan'
    },

    // GET ABSENSI
    getAbsensiSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.absensi = action.payload;

      console.log('STATE ABSENSI REDUX', state.absensi);
      state.message = 'Berhasil Mengambil Data'
    },

      // GET VALIDASI ABSENSI
      getIndexValidasiAbsensiSuccess(state, action) {
        console.log(state);
        console.log(action);
        state.isLoading = false;
        state.indexValidasi = action.payload;
  
        console.log('STATE INDEX VALIDASI ABSENSI REDUX', state.indexValidasi);
        state.message = 'Berhasil Mengambil Data'
      },

    // CREATE ABSENSI
    createAbsensiSuccess(state, action) {
      const newAbsensi = action.payload;
      state.isLoading = false;
      state.createdAbsensi = newAbsensi;
      state.message = 'Berhasil Menambah Data'
    },

    // UPDATE EVENT
    updateAbsensiSuccess(state, action) {
      const updateAbsensi = action.payload;
      state.isLoading = false;
      state.updatedAbsensi = updateAbsensi;
      state.message = 'Berhasil Mengubah Data'
    },

    validasiAbsensiSuccess(state, action) {
      const validasiAbsensi = action.payload;
      state.isLoading = false;
      state.validAbsensi = validasiAbsensi;
      state.message = 'Berhasil Mengubah Data'
    },

    tolakValidasiAbsensiSuccess(state, action) {
      const tolakAbsensi = action.payload;
      state.isLoading = false;
      state.tolakAbsensi = tolakAbsensi;
      state.message = 'Berhasil Mengubah Data'
    },

    // DELETE EVENT
    deleteAbsensiSuccess(state, action) {
     state.deletedAbsensi = action.payload;
     state.isLoading = false;
     state.message = 'Berhasil Menghapus Data'
    },

    // SET CURRENT ABSENSI
    setCurrentAbsensiSuccess(state, action) {
      state.isLoading = false;
      state.currentAbsensi = action.payload;
      console.log('CURRENT ABSENSI', state.currentAbsensi);
    },

    // RESET ABSENSI
    resetAbsensiSuccess(state, action) {
      state.isLoading = false;
      state.currentAbsensi = {};
      state.message = ''
      // state.createdAbsensi = {};
      // state.updatedAbsensi = {};
    },
  },
});

// Reducer
export default slice.reducer;

export function getAbsensi() {
  return async dispatch => {
  dispatch(slice.actions.startLoading());
  try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get('/absensi', header);
    console.log('redux getAbsensi', response);
    window.localStorage.setItem('absensiList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getAbsensiSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  };
}

export function getIndexValidasiAbsensi() {
  return async dispatch => {
  dispatch(slice.actions.startLoading());
  try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get('/validasi-absensi', header);
    console.log('redux getIndexValidasiAbsensi', response);
    window.localStorage.setItem('absensiList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getIndexValidasiAbsensiSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  };
}

export function createAbsensi(newAbsensi) {
  return async () => {
    console.log(newAbsensi);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/absensi', newAbsensi, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.createAbsensiSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function setCurrentAbsensi(currentAbsensi) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentAbsensiSuccess(currentAbsensi));
    return a;
  };
}

export function resetAbsensi() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetAbsensiSuccess());
  };
}

export function updateAbsensi(idAbsensi, updateAbsensi) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/absensi/${idAbsensi}`, updateAbsensi, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updateAbsensiSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function deleteAbsensi(idAbsensi) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.delete(`/absensi/${idAbsensi}`, header);
    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.deleteAbsensiSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function validasiAbsensi(idAbsensi, updateAbsensi) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/validasi-absensi/valid/${idAbsensi}`, updateAbsensi, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.validasiAbsensiSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function tolakValidasiAbsensi(idAbsensi, updateAbsensi) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/validasi-absensi/tolak/${idAbsensi}`, updateAbsensi, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.tolakValidasiAbsensiSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
