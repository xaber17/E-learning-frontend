import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// config
import { PATH_AFTER_LOGIN } from '../../config';
// routes
import { PATH_AUTH } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, replace, prefetch } = useRouter();

  useEffect(() => {
    if (pathname === PATH_AUTH.root) {
      replace(PATH_AUTH.login);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    prefetch(PATH_AUTH.login);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
