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
  masterBagian: [],
  isOpenModal: false,
  currentMasterBagian: {},
  message: '',
  status: 0,
  success: false,
  createdMasterBagian: {},
  updatedMasterBagian: {},
  deletedMasterBagian: {},
};

const slice = createSlice({
  name: 'masterBagian',
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
      console.log('STATE MASTER BAGIAN ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },

    // GET MASTER BAGIAN
    getMasterBagianSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.masterBagian = action.payload;

      console.log('STATE MASTER BAGIAN REDUX', state.masterBagian);
      state.message = 'Berhasil Mengambil Data';
    },

    // CREATE MASTER BAGIAN
    createMasterBagianSuccess(state, action) {
      const newMasterBagian = action.payload;
      state.isLoading = false;
      state.createdMasterBagian = newMasterBagian;
      state.message = 'Berhasil Menambah Data';
    },

    // UPDATE EVENT
    updateMasterBagianSuccess(state, action) {
      const updateMasterBagian = action.payload;
      state.isLoading = false;
      state.updatedMasterBagian = updateMasterBagian;
      state.message = 'Berhasil Mengubah Data';
    },

    // DELETE EVENT
    deleteMasterBagianSuccess(state, action) {
      state.deletedMasterBagian = action.payload;
      state.isLoading = false;
      state.message = 'Berhasil Menghapus Data';
    },

    // SET CURRENT MASTER BAGIAN
    setCurrentMasterBagianSuccess(state, action) {
      state.isLoading = false;
      state.currentMasterBagian = action.payload;
      console.log('CURRENT MASTER BAGIAN', state.currentMasterBagian);
    },

    // RESET MASTER BAGIAN
    resetMasterBagianSuccess(state, action) {
      state.isLoading = false;
      state.currentMasterBagian = {};
      state.message = '';
      // state.createdMasterBagian = {};
      // state.updatedMasterBagian = {};
    },
  },
});

// Reducer
export default slice.reducer;

export async function getMasterBagian() {
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
    const response = await axios.get('/master-bagian', header);
    console.log('redux getMasterBagian', response);
    window.localStorage.setItem('penggajianList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getMasterBagianSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export async function getMasterBagianActive() {
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
    const response = await axios.post('/master-bagian/active', null, header);
    console.log('redux getMasterBagian', response);
    window.localStorage.setItem('penggajianList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getMasterBagianSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export function createMasterBagian(newMasterBagian) {
  return async () => {
    console.log(newMasterBagian);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/master-bagian', newMasterBagian, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.createMasterBagianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function setCurrentMasterBagian(currentMasterBagian) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentMasterBagianSuccess(currentMasterBagian));
    return a;
  };
}

export function resetMasterBagian() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetMasterBagianSuccess());
  };
}

export function updateMasterBagian(idBagian, updateMasterBagian) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/master-bagian/${idBagian}`, updateMasterBagian, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updateMasterBagianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function deleteMasterBagian(idBagian) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.delete(`/master-bagian/${idBagian}`, header);
    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.deleteMasterBagianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
