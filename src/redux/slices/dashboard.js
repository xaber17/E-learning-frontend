import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch, store } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: [],
  dashboard: [],
  isOpenModal: false,
  currentDashboard: {},
  message: '',
  status: 0,
  success: false,
  createdDashboard: {},
  updatedDashboard: {},
  deletedDashboard: {}
};

const slice = createSlice({
  name: 'dashboard',
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
      console.log('STATE DASHBOARD ERROR', state.error);
      state.message = 'Terjadi Kesalahan'
    },

    // GET DASHBOARD
    getDashboardSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.dashboard = action.payload;

      console.log('STATE DASHBOARD REDUX', state.dashboard);
      state.message = 'Berhasil Mengambil Data'
    },

    // CREATE DASHBOARD
    createDashboardSuccess(state, action) {
      const newDashboard = action.payload;
      state.isLoading = false;
      state.createdDashboard = newDashboard;
      state.message = 'Berhasil Menambah Data'
    },

    // UPDATE EVENT
    updateDashboardSuccess(state, action) {
      const updateDashboard = action.payload;
      state.isLoading = false;
      state.updatedDashboard = updateDashboard;
      state.message = 'Berhasil Mengubah Data'
    },

    // DELETE EVENT
    deleteDashboardSuccess(state, action) {
     state.deletedDashboard = action.payload;
     state.isLoading = false;
     state.message = 'Berhasil Menghapus Data'
    },

    // SET CURRENT DASHBOARD
    setCurrentDashboardSuccess(state, action) {
      state.isLoading = false;
      state.currentDashboard = action.payload;
      console.log('CURRENT DASHBOARD', state.currentDashboard);
    },

    // RESET DASHBOARD
    resetDashboardSuccess(state, action) {
      state.isLoading = false;
      state.currentDashboard = {};
      state.message = ''
      // state.createdDashboard = {};
      // state.updatedDashboard = {};
    },
  },
});

// Reducer
export default slice.reducer;

export function getDashboardAdmin() {
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
    const response = await axios.post('/dashboard/admin', null, header);
    console.log('redux getDashboard', response);
    window.localStorage.setItem('dashboardList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getDashboardSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  };
}

export function getDashboardDirut() {
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
    const response = await axios.post('/dashboard/dirut', null, header);
    console.log('redux getDashboard', response);
    window.localStorage.setItem('dashboardList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getDashboardSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  };
}

export function getDashboardGm() {
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
    const response = await axios.post('/dashboard/gm', null, header);
    console.log('redux getDashboard', response);
    window.localStorage.setItem('dashboardList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getDashboardSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  };
}

export function getDashboardManHrd() {
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
    const response = await axios.post('/dashboard/manhrd', null, header);
    console.log('redux getDashboard', response);
    window.localStorage.setItem('dashboardList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getDashboardSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  };
}

export function getDashboardManPro() {
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
    const response = await axios.post('/dashboard/manpro', null, header);
    console.log('redux getDashboard', response);
    window.localStorage.setItem('dashboardList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getDashboardSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  };
}

export function getDashboardManFin() {
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
    const response = await axios.post('/dashboard/manfin', null, header);
    console.log('redux getDashboard', response);
    window.localStorage.setItem('dashboardList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getDashboardSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  };
}

export function getDashboardStafPayroll() {
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
    const response = await axios.post('/dashboard/stafpayroll', null, header);
    console.log('redux getDashboard', response);
    window.localStorage.setItem('dashboardList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getDashboardSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  };
}

export function getDashboardStafInv() {
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
    const response = await axios.post('/dashboard/stafinv', null, header);
    console.log('redux getDashboard', response);
    window.localStorage.setItem('dashboardList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getDashboardSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  };
}

export function getDashboardPegawai() {
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
    const response = await axios.post('/dashboard/pegawai', null, header);
    console.log('redux getDashboard', response);
    window.localStorage.setItem('dashboardList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getDashboardSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  };
}
