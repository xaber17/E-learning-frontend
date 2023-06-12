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
  penggajian: [],
  isOpenModal: false,
  currentPenggajian: {},
  currentPenggajianDetail: {},
  message: '',
  status: 0,
  success: false,
  createdPenggajian: {},
  updatedPenggajianDetail: {},
  updatedPenggajian: {},
  deletedPenggajian: {},
  bawahan: [],
  bagian: [],
  jabatan: [],
  penggajianDetail: [],
};

const slice = createSlice({
  name: 'penggajian',
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
      console.log('STATE PENGGAJIAN ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },

    // GET PENGGAJIAN
    getPenggajianSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.penggajian = action.payload;

      console.log('STATE PENGGAJIAN REDUX', state.penggajian);
      state.message = 'Berhasil Mengambil Data';
    },

    // CREATE PENGGAJIAN
    createPenggajianSuccess(state, action) {
      const newPenggajian = action.payload;
      state.isLoading = false;
      state.createdPenggajian = newPenggajian;
      state.message = 'Berhasil Menambah Data';
    },

    // GET PENGGAJIAN DETAIL
    getPenggajianDetailSuccess(state, action) {
      const penggajianDetail = action.payload;
      state.isLoading = false;
      state.penggajianDetail = penggajianDetail;
      state.message = 'Berhasil mengambil data Penggajian Detail';
    },

    // GENERATE PENGGAJIAN DETAIL
    generatePenggajianDetailSuccess(state, action) {
      const penggajianDetail = action.payload;
      state.isLoading = false;
      state.penggajianDetail = penggajianDetail;
      state.message = 'Berhasil Generate Penggajian Detail';
    },

    // UPDATE PENGGAJIAN DETAIL
    updatePenggajianDetailSuccess(state, action) {
      const updatePenggajianDetail = action.payload;
      state.isLoading = false;
      state.updatedPenggajianDetail = updatePenggajianDetail;
      state.message = 'Berhasil Mengubah Data';
    },

    // SET CURRENT PENGGAJIAN
    setCurrentPenggajianSuccess(state, action) {
      state.isLoading = false;
      state.currentPenggajian = action.payload;
      console.log('CURRENT PENGGAJIAN', state.currentPenggajian);
    },

    // SET CURRENT PENGGAJIAN DETAIL
    setCurrentPenggajianDetailSuccess(state, action) {
      state.isLoading = false;
      state.currentPenggajianDetail = action.payload;
      console.log('CURRENT PENGGAJIAN', state.currentPenggajianDetail);
    },

    // RESET PENGGAJIAN
    resetPenggajianSuccess(state, action) {
      state.isLoading = false;
      state.currentPenggajian = {};
      state.message = '';
      // state.createdPenggajian = {};
      // state.updatedPenggajian = {};
    },

    // RESET PENGGAJIAN DETAIL
    resetPenggajianDetailSuccess(state, action) {
      state.isLoading = false;
      state.currentPenggajianDetail = {};
      state.message = '';
      // state.createdPenggajian = {};
      // state.updatedPenggajian = {};
    },

    updatePenggajianSuccess(state, action) {
      const updatePenggajian = action.payload;
      state.isLoading = false;
      state.updatedPenggajian = updatePenggajian;
      state.message = 'Berhasil Mengubah Data';
    },

    validasiPenggajianSuccess(state, action) {
      const penggajian = action.payload;
      state.isLoading = false;
      state.penggajian = penggajian;
      state.message = 'Berhasil Melakukan Validasi Data';
    },

    verifikasiPenggajianSuccess(state, action) {
      const penggajian = action.payload;
      state.isLoading = false;
      state.penggajian = penggajian;
      state.message = 'Berhasil Melakukan Verifikasi Data';
    },

    persetujuanPenggajianSuccess(state, action) {
      const penggajian = action.payload;
      state.isLoading = false;
      state.penggajian = penggajian;
      state.message = 'Berhasil Melakukan Persetujuan Data';
    },

    tolakPenggajianSuccess(state, action) {
      const penggajian = action.payload;
      state.isLoading = false;
      state.penggajian = penggajian;
      state.message = 'Berhasil Melakukan Tolak Data';
    },

    kelolaStatusPenggajianDetailSuccess(state, action) {
      const updatedPenggajianDetail = action.payload;
      state.isLoading = false;
      state.updatedPenggajianDetail = updatedPenggajianDetail;
      state.message = 'Berhasil Melakukan Kelola Status';
    },
  },
});

// Reducer
export default slice.reducer;

export async function getPenggajian() {
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
    const response = await axios.get('/penggajian', header);
    console.log('redux getPenggajian', response);
    window.localStorage.setItem('penggajianList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getPenggajianSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export function createPenggajian(newPenggajian) {
  return async () => {
    console.log(newPenggajian);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/penggajian', newPenggajian, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.createPenggajianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function updatePenggajian(kodePenggajian, updatePenggajian) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/penggajian/${kodePenggajian}`, updatePenggajian, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updatePenggajianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function validasiPenggajian(kodePenggajian, validasiPenggajian) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/penggajian/validasi/${kodePenggajian}`, validasiPenggajian, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.validasiPenggajianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function verifikasiPenggajian(kodePenggajian, verifikasiPenggajian) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/penggajian/verifikasi/${kodePenggajian}`, verifikasiPenggajian, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.verifikasiPenggajianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function persetujuanPenggajian(kodePenggajian, persetujuanPenggajian) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/penggajian/persetujuan/${kodePenggajian}`, persetujuanPenggajian, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.persetujuanPenggajianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function tolakPenggajian(kodePenggajian, tolakPenggajian) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/penggajian/tolak/${kodePenggajian}`, tolakPenggajian, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.tolakPenggajianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function getPenggajianStafInv() {
  return async () => {
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post(`/penggajian/staf-inv`, null, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      console.log('redux getPenggajian', response);
      window.localStorage.setItem('penggajianList', JSON.stringify(response.data.data));
      a = dispatch(slice.actions.getPenggajianSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function getPenggajianDetail(kodePenggajian) {
  return async () => {
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post(`/penggajian/detail/${kodePenggajian}`, null, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      console.log('redux getPenggajian', response);
      window.localStorage.setItem('penggajianDetailList', JSON.stringify(response.data.data));
      a = dispatch(slice.actions.getPenggajianDetailSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function generatePenggajianDetail(kodePenggajian) {
  return async () => {
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post(`/penggajian/detail/generate/${kodePenggajian}`, null, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      console.log('redux getPenggajian', response);
      window.localStorage.setItem('penggajianDetailList', JSON.stringify(response.data.data));
      a = dispatch(slice.actions.generatePenggajianDetailSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function updatePenggajianDetail(idPenggajianDetail, updatePenggajianDetail) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(
      `/penggajian/detail/update/${idPenggajianDetail}`,
      updatePenggajianDetail,
      header
    );

    const status = response.status;
    const data = response.data;

    let a = null;
    // let b = null;

    if (status === 200) {
      a = dispatch(slice.actions.updatePenggajianDetailSuccess(data));

      // const response2 = await axios.post(`/penggajian/detail/generate/${kodePenggajian}`, null, header);

      // const status2 = response.status;
      // const data2 = response.data;

      // if (status2 === 200) {
      //   b = dispatch(slice.actions.generatePenggajianDetailSuccess(data2));
      // } else {
      //   b = dispatch(slice.actions.hasError(response2));
      // }
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    // const ret = [];

    // ret.push(a, b);

    return a;
  };
}

export function setCurrentPenggajian(currentPenggajian) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentPenggajianSuccess(currentPenggajian));
    return a;
  };
}

export function setCurrentPenggajianDetail(currentPenggajianDetail) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentPenggajianDetailSuccess(currentPenggajianDetail));
    return a;
  };
}

export function resetPenggajian() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetPenggajianSuccess());
  };
}

export function resetPenggajianDetail() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetPenggajianDetailSuccess());
  };
}

export function kelolaStatusPenggajianDetail(kodePenggajian, dataKelola) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(`/penggajian/detail/status/${kodePenggajian}`, dataKelola, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.kelolaStatusPenggajianDetailSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
