import { useContext } from 'react';
//
// import { AuthContext } from '../contexts/JWTContext';
// import { AuthContext } from '../contexts/FirebaseContext';
// import { AuthContext } from '../contexts/Auth0Context';
// import { AuthContext } from '../contexts/AwsCognitoContext';
import { AuthContext } from '../contexts/AuthContext';

// ----------------------------------------------------------------------

const useAuth = () => {
  const context = useContext(AuthContext);
  consolelog('context', context);

  if (!context) throw new Error('Auth context must be use inside AuthProvider');

  return context;
};

export default useAuth;
