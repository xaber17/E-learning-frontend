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
  error: false,
  auth: [],
  oauth: [],
  isOpenModal: false,
  current_data: {},
  token: '',
};

const slice = createSlice({
  name: 'auth',
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
    },

    // GET AUTH
    getAuthSuccess(state, action) {
      state.isLoading = false;
      state.auth = action.payload;
    },

    // LOGIN
    loginSuccess(state, action) {
      state.isLoading = false;
      state.auth = action.payload;
    },

    authSuccess(state, action) {
      state.isLoading = false;
      state.oauth = action.payload;
    },

    // LOGIN
    logoutSuccess(state, action) {
        state.isLoading = false;
        state.auth = action.payload;
      },
  },
});

export default slice.reducer;

export function getAuth() {
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
    const response = await axios.post('/user/auth', null, header);

    const status = response.status;
    const data = response.data;

    let a = null;

    if (status === 200) {
      a = dispatch(slice.actions.getAuthSuccess(data));
    } else {
      a = dispatch(slice.actions.hasError(response));
    }

    return a;
  };
}

export function doLogin(email, password) {
  console.log('email di auth', email);
  console.log('password di auth', password);
  const data = {
    "email": email,
    "password": password,
  };
  const dataOauth = {
    "grant_type": 'password',
    "client_id": process.env.REACT_APP_API_CLIENT_ID,
    "client_secret": process.env.REACT_APP_API_CLIENT_SECRET,
    "username": email,
    "password": password,
    "scope": '*',
  };
  //   return async (dispatch, store) => {
  console.log('jalan');
  dispatch(slice.actions.startLoading());
  // try {
  axios
    .post('/oauth/token', dataOauth)
    .then((responseOauth) => {
      console.log(responseOauth);
      if (responseOauth.data.access_token) {
        axios
          .post('/login', data)
          .then((response) => {
            console.log(response);

            window.localStorage.setItem('accessToken', responseOauth.data.access_token);
            
            const auth = response.data.data;
            window.localStorage.setItem('auth', auth);
            dispatch({
              type: 'LOGIN',
              payload: {
                auth,
              },
            });

            dispatch(slice.actions.loginSuccess(response.data));
            dispatch(slice.actions.authSuccess(responseOauth.data));
          })
          .catch((error) => dispatch(slice.actions.hasError(error)));
      }
    })
    .catch((error) => dispatch(slice.actions.hasError(error)));
  //   const response = axios.post('/oauth/token', dataOauth);
  //   console.log(response);
  //   if (response.status === 200) {
  //     try {
  //       const resLogin = axios.post('/login', data);
  //       if (resLogin.status === 200) {
  //         dispatch(slice.actions.loginSuccess(response.data));
  //         dispatch(slice.actions.authSuccess(resLogin.data));
  //       }
  //     } catch (e) {
  //       dispatch(slice.actions.hasError(e));
  //     }
  //   }
  // } catch (error) {

  // }
  //   };
}

export function doLogout() {
  console.log("LOGOUT")
  const accessToken = window.localStorage.getItem('accessToken');
  dispatch(slice.actions.startLoading());
  const header = {
    headers: {
        'Authorization': `Bearer ${accessToken}`
      },
  }
  axios.post('/user/logout', null, header).then((response)=>{
    console.log(response)
    window.localStorage.clear()
    dispatch(slice.actions.logoutSuccess(response));
  })
}
