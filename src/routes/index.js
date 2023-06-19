import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // {
    //   path: 'auth',
    //   children: [
    //     {
    //       path: 'login',
    //       element: (
    //         <GuestGuard>
    //           <Login />
    //         </GuestGuard>
    //       ),
    //     },
    //     {
    //       path: 'register',
    //       element: (
    //         <GuestGuard>
    //           <Register />
    //         </GuestGuard>
    //       ),
    //     },
    //     { path: 'login-unprotected', element: <Login /> },
    //     { path: 'register-unprotected', element: <Register /> },
    //     { path: 'reset-password', element: <ResetPassword /> },
    //     { path: 'verify', element: <VerifyCode /> },
    //   ],
    // },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },

        // {
        //   path: 'e-commerce',
        //   children: [
        //     { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
        //     { path: 'shop', element: <EcommerceShop /> },
        //     { path: 'product/:name', element: <EcommerceProductDetails /> },
        //     { path: 'list', element: <EcommerceProductList /> },
        //     { path: 'product/new', element: <EcommerceProductCreate /> },
        //     { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
        //     { path: 'checkout', element: <EcommerceCheckout /> },
        //     { path: 'invoice', element: <EcommerceInvoice /> },
        //   ],
        // },
        {
          path: 'users',
          children: [
            {
              element: (
                <RoleBasedGuard accessibleRoles={['admin']}>
                  <Navigate to="/dashboard/users/list" replace />
                </RoleBasedGuard>
              ),
              index: true,
            },
            { path: 'list', element: <UsersList /> },
            { path: 'form', element: <UsersForm /> },
          ],
        },
        {
          path: 'kelas',
          children: [
            { element: <Navigate to="/dashboard/kelas/list" replace />, index: true },
            { path: 'list', element: <KelasList /> },
            { path: 'form', element: <KelasForm /> },
          ],
        },
        {
          path: 'materi',
          children: [
            { element: <Navigate to="/dashboard/materi/list" replace />, index: true },
            { path: 'list', element: <MateriList /> },
            { path: 'form', element: <MateriForm /> },
            { path: 'detail', element: <MateriDetail /> },
          ],
        },
        {
          path: 'ujian',
          children: [
            { element: <Navigate to="/dashboard/ujian/list" replace />, index: true },
            { path: 'list', element: <UjianList /> },
            { path: 'form', element: <UjianForm /> },
            { path: 'hasil', element: <HasilUjian /> },
            { path: 'hasil/form', element: <HasilForm /> },
          ],
        },
        {
          path: 'ujian-siswa',
          children: [
            { element: <Navigate to="/dashboard/ujian-siswa/list" replace />, index: true },
            { path: 'list', element: <UjianSiswaList /> },
            { path: 'form', element: <UjianSiswaForm /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':name/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPosts /> },
            { path: 'post/:title', element: <BlogPost /> },
            { path: 'new-post', element: <BlogNewPost /> },
          ],
        },
        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
            { path: 'label/:customLabel', element: <Mail /> },
            { path: 'label/:customLabel/:mailId', element: <Mail /> },
            { path: ':systemLabel', element: <Mail /> },
            { path: ':systemLabel/:mailId', element: <Mail /> },
          ],
        },
        {
          path: 'chat',
          children: [
            { element: <Chat />, index: true },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> },
          ],
        },
        { path: 'calendar', element: <Calendar /> },
        { path: 'kanban', element: <Kanban /> },
        {
          path: 'akun',
          element: <Akun />,
          index: true,
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
      ),
      // children: [
      //   // { element: <HomePage />, index: true },
      //   { element: <Login />, index: true },
      //   { path: 'about-us', element: <About /> },
      //   { path: 'contact-us', element: <Contact /> },
      //   { path: 'faqs', element: <Faqs /> },
      // ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));
// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductCreate')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));
const EcommerceInvoice = Loadable(lazy(() => import('../pages/dashboard/EcommerceInvoice')));
const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')));

// USERS
const UsersList = Loadable(lazy(() => import('../pages/users/UsersList')));
const UsersForm = Loadable(lazy(() => import('../pages/users/UsersForm')));

// KELAS
const KelasList = Loadable(lazy(() => import('../pages/kelas/KelasList')));
const KelasForm = Loadable(lazy(() => import('../pages/kelas/KelasForm')));

// MATERI
const MateriList = Loadable(lazy(() => import('../pages/materi/MateriList')));
const MateriForm = Loadable(lazy(() => import('../pages/materi/MateriForm')));
const MateriDetail = Loadable(lazy(() => import('../pages/materi/MateriDetail')));

// AKUN
const Akun = Loadable(lazy(() => import('../pages/akun')));

// UJIAN
const UjianList = Loadable(lazy(() => import('../pages/ujian/UjianList')));
const UjianForm = Loadable(lazy(() => import('../pages/ujian/UjianForm')));
const HasilUjian = Loadable(lazy(() => import('../pages/ujian/HasilUjian')));
const HasilForm = Loadable(lazy(() => import('../pages/ujian/HasilForm')));

// UJIAN
const UjianSiswaList = Loadable(lazy(() => import('../pages/ujianSiswa/UjianSiswaList')));
const UjianSiswaForm = Loadable(lazy(() => import('../pages/ujianSiswa/UjianSiswaForm')));

// Main
const HomePage = Loadable(lazy(() => import('../pages/Home')));
const About = Loadable(lazy(() => import('../pages/About')));
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
