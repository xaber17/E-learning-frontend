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
  masterJabatan: [],
  isOpenModal: false,
  currentMasterJabatan: {},
  message: '',
  status: 0,
  success: false,
  createdMasterJabatan: {},
  updatedMasterJabatan: {},
  deletedMasterJabatan: {}
};

const slice = createSlice({
  name: 'masterJabatan',
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
      console.log('STATE ERROR', state.error);
      state.message = 'Terjadi Kesalahan'
    },

    // GET MASTER JABATAN
    getMasterJabatanSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.masterJabatan = action.payload;

      console.log('STATE MASTER JABATAN REDUX', state.masterJabatan);
      state.message = 'Berhasil Mengambil Data'
    },

    // CREATE MASTER JABATAN
    createMasterJabatanSuccess(state, action) {
      const newMasterJabatan = action.payload;
      state.isLoading = false;
      state.createdMasterJabatan = newMasterJabatan;
      state.message = 'Berhasil Menambah Data'
    },

    // UPDATE EVENT
    updateMasterJabatanSuccess(state, action) {
      const updateMasterJabatan = action.payload;
      state.isLoading = false;
      state.updatedMasterJabatan = updateMasterJabatan;
      state.message = 'Berhasil Mengubah Data'
    },

    // DELETE EVENT
    deleteMasterJabatanSuccess(state, action) {
     state.deletedMasterJabatan = action.payload;
     state.isLoading = false;
     state.message = 'Berhasil Menghapus Data'
    },

    // SET CURRENT MASTER JABATAN
    setCurrentMasterJabatanSuccess(state, action) {
      state.isLoading = false;
      state.currentMasterJabatan = action.payload;
      console.log('CURRENT MASTER JABATAN', state.currentMasterJabatan);
    },

    // RESET MASTER JABATAN
    resetMasterJabatanSuccess(state, action) {
      state.isLoading = false;
      state.currentMasterJabatan = {};
      state.message = ''
      // state.createdMasterJabatan = {};
      // state.updatedMasterJabatan = {};
    },
  },
});

// Reducer
export default slice.reducer;

export async function getMasterJabatan() {
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
    const response = await axios.get('/jabatan', header);
    console.log('redux getMasterJabatan', response);
    window.localStorage.setItem('strukturList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getMasterJabatanSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export async function getMasterJabatanActive() {
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
    const response = await axios.post('/jabatan/active', null, header);
    console.log('redux getMasterJabatan', response);
    window.localStorage.setItem('strukturList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getMasterJabatanSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export function createMasterJabatan(newMasterJabatan) {
  return async () => {
    console.log(newMasterJabatan);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/jabatan', newMasterJabatan, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.createMasterJabatanSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function setCurrentMasterJabatan(currentMasterJabatan) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentMasterJabatanSuccess(currentMasterJabatan));
    return a;
  };
}

export function resetMasterJabatan() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetMasterJabatanSuccess());
  };
}

export function updateMasterJabatan(idJabatan, updateMasterJabatan) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/jabatan/${idJabatan}`, updateMasterJabatan, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updateMasterJabatanSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function deleteMasterJabatan(idJabatan) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.delete(`/jabatan/${idJabatan}`, header);
    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.deleteMasterJabatanSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
