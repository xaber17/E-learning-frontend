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
  masterTarifPtkp: [],
  isOpenModal: false,
  currentMasterTarifPtkp: {},
  message: '',
  status: 0,
  success: false,
  createdMasterTarifPtkp: {},
  updatedMasterTarifPtkp: {},
  deletedMasterTarifPtkp: {},
};

const slice = createSlice({
  name: 'masterTarifPtkp',
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
      console.log('STATE MASTER TARIF PTKP ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },

    // GET MASTER TARIF PTKP
    getMasterTarifPtkpSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.masterTarifPtkp = action.payload;

      console.log('STATE MASTER TARIF PTKP REDUX', state.masterTarifPtkp);
      state.message = 'Berhasil Mengambil Data';
    },

    // CREATE MASTER TARIF PTKP
    createMasterTarifPtkpSuccess(state, action) {
      const newMasterTarifPtkp = action.payload;
      state.isLoading = false;
      state.createdMasterTarifPtkp = newMasterTarifPtkp;
      state.message = 'Berhasil Menambah Data';
    },

    // UPDATE EVENT
    updateMasterTarifPtkpSuccess(state, action) {
      const updateMasterTarifPtkp = action.payload;
      state.isLoading = false;
      state.updatedMasterTarifPtkp = updateMasterTarifPtkp;
      state.message = 'Berhasil Mengubah Data';
    },

    // DELETE EVENT
    deleteMasterTarifPtkpSuccess(state, action) {
      state.deletedMasterTarifPtkp = action.payload;
      state.isLoading = false;
      state.message = 'Berhasil Menghapus Data';
    },

    // SET CURRENT MASTER TARIF PTKP
    setCurrentMasterTarifPtkpSuccess(state, action) {
      state.isLoading = false;
      state.currentMasterTarifPtkp = action.payload;
      console.log('CURRENT MASTER TARIF PTKP', state.currentMasterTarifPtkp);
    },

    // RESET MASTER TARIF PTKP
    resetMasterTarifPtkpSuccess(state, action) {
      state.isLoading = false;
      state.currentMasterTarifPtkp = {};
      state.message = '';
      // state.createdMasterTarifPtkp = {};
      // state.updatedMasterTarifPtkp = {};
    },
  },
});

// Reducer
export default slice.reducer;

export async function getMasterTarifPtkp() {
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
    const response = await axios.get('/master-tarifptkp', header);
    console.log('redux getMasterTarifPtkp', response);
    window.localStorage.setItem('masterTarifPtkpList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getMasterTarifPtkpSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export async function getMasterTarifPtkpActive() {
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
    const response = await axios.post('/master-tarifptkp/active', null, header);
    console.log('redux getMasterTarifPtkp', response);
    window.localStorage.setItem('masterTarifPtkpList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getMasterTarifPtkpSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export function createMasterTarifPtkp(newMasterTarifPtkp) {
  return async () => {
    console.log(newMasterTarifPtkp);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/master-tarifptkp', newMasterTarifPtkp, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.createMasterTarifPtkpSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function setCurrentMasterTarifPtkp(currentMasterTarifPtkp) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentMasterTarifPtkpSuccess(currentMasterTarifPtkp));
    return a;
  };
}

export function resetMasterTarifPtkp() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetMasterTarifPtkpSuccess());
  };
}

export function updateMasterTarifPtkp(idTarifPtkp, updateMasterTarifPtkp) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/master-tarifptkp/${idTarifPtkp}`, updateMasterTarifPtkp, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updateMasterTarifPtkpSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function deleteMasterTarifPtkp(idTarifPtkp) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.delete(`/master-tarifptkp/${idTarifPtkp}`, header);
    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.deleteMasterTarifPtkpSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
