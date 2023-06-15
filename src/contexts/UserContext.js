import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';

const initialState = {
  guru: null,
  siswa: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { guru, siswa } = action.payload;
    return {
      ...state,
      guru,
      siswa
    };
  },
  GET: (state, action) => {
    const { guru, siswa } = action.payload;
    return {
      ...state,
      guru,
      siswa,
    };
  },
}

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const UserContext = createContext({
  ...initialState,
});

UserProvider.propTypes = {
  children: PropTypes.node,
};

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await axios.get('/user/users');
        const { data } = response.data;
        console.log("Data All User: ", data)
        dispatch({
          type: 'INITIALIZE',
          payload: {
            guru: data?.dataGuru,
            siswa: data?.dataSiswa,
          },
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            guru: null,
            siswa: null,
          },
        });
      }
    };

    initialize();
  }, []);

  return (
    <UserContext.Provider
      value={{
        ...state,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
