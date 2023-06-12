import { createContext, useEffect, useReducer } from 'react';
import { createSlice } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
// routes
import { doLogin, doLogout, getAuth } from '../redux/slices/auth';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import { dispatch, store } from '../redux/store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  isChoosingRole: false,
  isInitialized: false,
  oauth: [],
  auth: [],
  current_data: {},
  accessToken: '',
  role: '',
  message: '',
  status: 0,
  success: false,
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

    // OAUTH
    oauthSuccess(state, action) {
      state.isLoading = false;
      state.oauth = action.payload;
    },

    authSuccess(state, action) {
      state.isLoading = false;
      state.oauth = action.payload;
    },

    chooseRoleSuccess(state, action) {
      state.isLoading = false;
      state.role = action.payload;
    },

    // LOGOUT
    logoutSuccess(state, action) {
      state.isLoading = false;
      state.auth = action.payload;
    },
  },
});

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, isChoosingRole, auth } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isChoosingRole,
      isInitialized: true,
      auth,
    };
  },
  OAUTH: (state, action) => {
    const { oauth } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      isChoosingRole: false,
      oauth,
    };
  },
  LOGIN: (state, action) => {
    const { auth } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      isChoosingRole: false,
      auth,
    };
  },
  CHOOSINGROLE: (state, action) => {
    const { auth, role } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      isChoosingRole: true,
      role,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    isChoosingRole: false,
    auth: null,
  }),
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'auth',
  oauth: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  choosingrole: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log('state', state);
  console.log('initial state', initialState);
  useEffect(() => {
    const initialize = async () => {
      console.log('INITIALIZE');
      dispatch(slice.actions.startLoading());
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken) {
          console.log('ada');
          console.log(accessToken);
          const header = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
          const response = await axios.post('/user/auth', null, header);

          const auth = response.data;

          console.log('response', response);
          console.log('AUTH YANG LAGI LOGIN', auth);

          if (response.status === 200) {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                auth,
                "accessToken": accessToken,
                status: response.status,
                success: true,
              },
            });
          } else {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: false,
                status: response.status,
                success: false,
              },
            });
            dispatch(slice.actions.hasError());
          }
        } else {
          console.log('tidak ada');
          dispatch({
            type: 'INITIALIZE',
            payload: initialState,
            isAuthenticated: false,
            isChoosingRole: false,
          });
          dispatch(slice.actions.hasError());
        }
      } catch (err) {
        console.log(err);
        console.log('error');
        dispatch({
          type: 'INITIALIZE',
          payload: initialState,
        });
        dispatch(slice.actions.hasError(err));
      }
    };

    initialize();
  }, []);

  const oauth = async (email, password) => {
    const dataOauth = {
      "grant_type": 'password',
      "client_id": process.env.REACT_APP_API_CLIENT_ID,
      "client_secret": process.env.REACT_APP_API_CLIENT_SECRET,
      "username": email,
      "password": password,
      "scope": '*',
    };
    console.log('jalan oauth');
    dispatch(slice.actions.startLoading());
    const resOauth = await axios.post('/oauth/token', dataOauth);
    console.log('RES OAUTH', resOauth);
    const status = resOauth.status;
    const data = resOauth.data;

    let a = null;
    if (status === 200) {
      const accessToken = data.access_token;
      const oauth = data.data;
      window.localStorage.setItem('accessToken', accessToken);
      a = dispatch(slice.actions.authSuccess(data));
      dispatch({
        type: 'OAUTH',
        payload: {
          oauth,
        },
      });
      login(email, password);
    } else {
      a = dispatch(slice.actions.hasError(resOauth));
    }
    return a;
  };

  const login = (email, password) => {
    const dataAuth = {
      "email": email,
      "password": password,
    };
    console.log('jalan login');
    dispatch(slice.actions.startLoading());
    const resAuth = axios.post('/login', dataAuth);
    console.log('RES AUTH', resAuth);
    const status = resAuth.status;
    const data = resAuth.data;

    let a = null;
    if (status === 200) {
      const auth = data.data;
      window.localStorage.setItem('auth', auth);
      dispatch({
        type: 'LOGIN',
        payload: {
          auth,
        },
      });

      dispatch(slice.actions.loginSuccess(data.data));
    } else {
      a = dispatch(slice.actions.hasError(resAuth));
    }

    return a;
  };

  const choosingrole = async (data) => {
    const role = data;
    dispatch({
      type: 'CHOOSINGROLE',
      payload: {
        role,
      },
    });
    return dispatch(slice.actions.chooseRoleSuccess(role));
  };

  const logout = async () => {
    doLogout();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'auth',
        oauth,
        login,
        logout,
        choosingrole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
