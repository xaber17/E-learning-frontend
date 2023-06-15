import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  guru: null,
  siswa: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, guru, siswa } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      guru,
      siswa
    };
  },
  LOGIN: (state, action) => {
    const { user, guru, siswa } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      guru,
      siswa
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    guru: null,
    siswa: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const response = await axios.get('/user');
          const { user, guru, siswa } = response.data.result;
          console.log("Response Data: ", response.data)

          user.displayName = user.nama_user;
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
              guru,
              siswa
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (username, password) => {
    console.log("Payload Login: ", username, password)
    // const response = await axios.post('/api/account/login', {
    //   email,
    //   password,
    // });
    const response = await axios.post('/auth', {
      username,
      password,
    });
    const { accessToken, user } = response.data;
    console.log("Data User: ", response.data);

    const { guru, siswa } = response.data?.allUser;
    user.displayName = user.nama_user;

    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
        guru,
        siswa,
      },
    });
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
