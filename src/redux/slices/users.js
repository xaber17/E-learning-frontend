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
  users: [],
  isOpenModal: false,
  currentUser: {},
  message: '',
  status: 0,
  success: false,
  createdUser: {},
  updatedUser: {},
  deletedUser: {},
};

const slice = createSlice({
  name: 'users',
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
      console.log('STATE USERS ERROR', state.error);
      state.message = 'Terjadi Kesalahan';
    },

    // GET USERS
    getUsersSuccess(state, action) {
      console.log(state);
      console.log(action);
      state.isLoading = false;
      state.users = action.payload;

      console.log('STATE USERS REDUX', state.users);
      state.message = 'Berhasil Mengambil Data';
    },

    // CREATE USER
    createUserSuccess(state, action) {
      const newUser = action.payload;
      state.isLoading = false;
      state.createdUser = newUser;
      state.message = 'Berhasil Menambah Data';
    },

    // UPDATE EVENT
    updateUserSuccess(state, action) {
      const updateUser = action.payload;
      state.isLoading = false;
      state.updatedUser = updateUser;
      state.message = 'Berhasil Mengubah Data';
    },

    // DELETE EVENT
    deleteUserSuccess(state, action) {
      state.deletedUser = action.payload;
      state.isLoading = false;
      state.message = 'Berhasil Menghapus Data';
    },

    // SET CURRENT USER
    setCurrentUserSuccess(state, action) {
      state.isLoading = false;
      state.currentUser = action.payload;
      console.log('CURRENT USER DI USERS', state.currentUser);
    },

    // RESET USER
    resetUserSuccess(state, action) {
      state.isLoading = false;
      state.currentUser = {};
      state.message = '';
      // state.createdUser = {};
      // state.updatedUser = {};
    },
  },
});

// Reducer
export default slice.reducer;

export async function getUsers() {
  // return async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log('Access token current User: ', accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get('/user/users', header);
    console.log('redux getUsers', response);
    window.localStorage.setItem('usersList', JSON.stringify(response.data));
    dispatch(slice.actions.getUsersSuccess(response));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export async function getUsersActive() {
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
    console.log('redux getUsers', response);
    window.localStorage.setItem('usersList', JSON.stringify(response.data.data));
    dispatch(slice.actions.getUsersSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
  // };
}

export function createUser(newUser) {
  return async () => {
    console.log(newUser);
    dispatch(slice.actions.startLoading());
    // try {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post('/user/registration', newUser, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.createUserSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function setCurrentUser(currentUser) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const a = dispatch(slice.actions.setCurrentUserSuccess(currentUser));
    return a;
  };
}

export function resetUser() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.resetUserSuccess());
  };
}

export function updateUser(userId, updateUser) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.patch(`/user/update/${userId}`, updateUser, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.updateUserSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function deleteUser(userId) {
  return async () => {
    dispatch(slice.actions.startLoading());

    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.delete(`/user/delete/${userId}`, header);
    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.deleteUserSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}
