import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch, store } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: [],
  materi: [],
  isOpenModal: false,
  currentMateri: {},
  message: '',
  status: 0,
  success: false,
  createdMateri: {},
  updatedMateri: {},
  deletedMateri: {},
};

const slice = createSlice({
  name: 'materi',
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
      console.log('STATE MATERI ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },

    // GET MATERI
    getMateriSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.materi = action.payload;

      console.log('STATE Materi REDUX', state.materi);
      state.message = 'Berhasil Mengambil Data';
    },

    getMateriDetailSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.materiDetail = action.payload;

      console.log('STATE Materi Detail REDUX', state.materiDetail);
      state.message = 'Berhasil Mengambil Data';
    },

    // CREATE Materi
    createMateriSuccess(state, action) {
      const newMateri = action.payload;
      state.isLoading = false;
      state.createdMateri = newMateri;
      state.message = 'Berhasil Menambah Data';
    },

    // UPDATE EVENT
    updateMateriSuccess(state, action) {
      const updateMateri = action.payload;
      state.isLoading = false;
      state.updatedMateri = updateMateri;
      state.message = 'Berhasil Mengubah Data';
    },

    // DELETE EVENT
    deleteMateriSuccess(state, action) {
      state.deletedMateri = action.payload;
      state.isLoading = false;
      state.message = 'Berhasil Menghapus Data';
    },

    // SET CURRENT MATERI
    setCurrentMateriSuccess(state, action) {
      state.isLoading = false;
      state.currentMateri = action.payload;
      console.log('CURRENT MATERI DI MATERI', state.currentMateri);
    },

    // RESET MATERI
    resetMateriSuccess(state, action) {
      state.isLoading = false;
      state.currentMateri = {};
      state.message = '';
    },
  },
});

// Reducer
export default slice.reducer;

export async function getMateriDetail(materiId) {
  // return async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log('materi id di redux', materiId);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get(`/upload-file/${materiId}`, header);
    console.log('success redux getMateri', response);
    window.localStorage.setItem('materiDetail', JSON.stringify(response.data));
    dispatch(slice.actions.getMateriDetailSuccess(response));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export async function getMateri() {
  // return async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const accessToken = window.localStorage.getItem('accessToken');
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get('/materi/all', header);
    console.log('success redux getMateriDetail', response);
    window.localStorage.setItem('materiList', JSON.stringify(response.data));
    dispatch(slice.actions.getMateriSuccess(response));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export function createMateri(newMateri) {
  return async () => {
    console.log("Data New Materi: ", newMateri);
    console.log("Data New File: ", newMateri.file.preview);
    window.localStorage.setItem(newMateri.materi_name, newMateri?.file?.preview);
    dispatch(slice.actions.startLoading());
    // try {
    const formData = new FormData();
    formData.append('file', newMateri.file);
    formData.append('materi_name', newMateri.materi_name);
    formData.append('deskripsi', newMateri.deskripsi);
    formData.append('kelas_id', newMateri.kelas_id);
    const accessToken = window.localStorage.getItem('accessToken');
    console.log('Access Token di Axios: ', accessToken);
    console.log('Data Sebelum dikirim axios: ', formData)
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
      },
    };
    const response = await axios.post('/upload-file/materi', formData, header);

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

export function setCurrentMateri(currentMateri) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentMateriSuccess(currentMateri));
    return a;
  };
}

export function resetMateri() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetMateriSuccess());
  };
}

export function updateMateri(materiId, updateMateri) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.patch(`/materi/update/${materiId}`, updateMateri, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updateMateriSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function deleteMateri(materiId) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log('Materi Id to delete: ', materiId);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.delete(`/materi/delete/${materiId}`, header);
    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.deleteMateriSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
