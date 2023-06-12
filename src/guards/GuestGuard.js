import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD, PATH_PAGE } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { isAuthenticated } = useAuth();

  // console.log(role);

  // if (isAuthenticated) {
  //   return <Navigate to={PATH_PAGE.role} />;
  // }

  if (isAuthenticated) {
    //  switch (data.role) {
    //     case 'admin':
    //       return navigate(PATH_DASHBOARD.general.admin);
    //     case 'dirut':
    //       return navigate(PATH_DASHBOARD.general.dirut);
    //     case 'gm':
    //       return navigate(PATH_DASHBOARD.general.gm);
    //     case 'manfin':
    //       return navigate(PATH_DASHBOARD.general.manfin);
    //     case 'manpro':
    //       return navigate(PATH_DASHBOARD.general.manpro);
    //     case 'manhrd':
    //       return navigate(PATH_DASHBOARD.general.manhrd);
    //     case 'stafpayroll':
    //       return navigate(PATH_DASHBOARD.general.stafpayroll);
    //     case 'stafabs':
    //       return navigate(PATH_DASHBOARD.general.stafabs);
    //     case 'stafinv':
    //       return navigate(PATH_DASHBOARD.general.stafinv);
    //     case 'pegawai':
    //       return navigate(PATH_DASHBOARD.general.pegawai);
    //     default:
    //       return navigate(PATH_DASHBOARD.general.analytics);
    //   }
    return <Navigate to={PATH_DASHBOARD.general.analytics} />;
  }

  return <>{children}</>;
}
