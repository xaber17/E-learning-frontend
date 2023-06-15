import { useContext } from 'react';
//
import { UserContext } from '../contexts/UserContext';

// ----------------------------------------------------------------------

const useUser = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error('User context must be use inside UserProvider');

  return context;
};

export default useUser;
