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
import { PATH_AFTER_CHOOSEROLE, PATH_AFTER_LOGIN } from '../config';
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
    {
      path: '/',
      element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
      ),
    },
    {
      path: 'role',
      element: (
        <AuthGuard>
          <ChooseRole />
        </AuthGuard>
      ),
    },
    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_CHOOSEROLE} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'admin', element: <DashboardAdmin /> },
        { path: 'dirut', element: <DashboardDirut /> },
        { path: 'gm', element: <DashboardGm /> },
        { path: 'manhrd', element: <DashboardManHrd /> },
        { path: 'manpro', element: <DashboardManPro /> },
        { path: 'manfin', element: <DashboardManFin /> },
        { path: 'stafpayroll', element: <DashboardStafPayroll /> },
        { path: 'stafabs', element: <DashboardStafAbs /> },
        { path: 'stafinv', element: <DashboardStafInv /> },
        { path: 'pegawai', element: <DashboardPegawai /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },

        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'list', element: <EcommerceProductList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
            { path: 'invoice', element: <EcommerceInvoice /> },
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
          path: 'users',
          children: [
            { element: <Navigate to="/dashboard/users/list" replace />, index: true },
            { path: 'list', element: <UsersList /> },
            { path: 'form', element: <UsersForm /> },
          ],
        },
        {
          path: 'bagian',
          children: [
            { element: <Navigate to="/dashboard/bagian/list" replace />, index: true },
            { path: 'list', element: <BagianList /> },
            { path: 'form', element: <BagianForm /> },
          ],
        },
        {
          path: 'tarif-ptkp',
          children: [
            { element: <Navigate to="/dashboard/tarif-ptkp/list" replace />, index: true },
            { path: 'list', element: <TarifPtkpList /> },
            { path: 'form', element: <TarifPtkpForm /> },
          ],
        },
        {
          path: 'jabatan',
          children: [
            { element: <Navigate to="/dashboard/jabatan/list" replace />, index: true },
            { path: 'list', element: <JabatanList /> },
            { path: 'form', element: <JabatanForm /> },
          ],
        },
        {
          path: 'akun',
          element: <Akun />,
          index: true,
        },
        {
          path: 'data-induk',
          element: <DataInduk />,
          index: true,
        },
        {
          path: 'absensi',
          children: [
            { element: <Navigate to="/dashboard/absensi/list" replace />, index: true },
            { path: 'list', element: <AbsensiList /> },
            { path: 'form', element: <AbsensiForm /> },
            { path: 'validation', element: <AbsensiValidation /> },
          ],
        },
        {
          path: 'slip-gaji',
          children: [
            { element: <Navigate to="/dashboard/slip-gaji/list" replace />, index: true },
            { path: 'list', element: <SlipGajiList /> },
            { path: 'detail', element: <SlipGajiDetail /> },
          ],
        },
        {
          path: 'penggajian',
          children: [
            { element: <Navigate to="/dashboard/penggajian/list" replace />, index: true },
            { path: 'list', element: <PenggajianList /> },
            { path: 'form', element: <PenggajianForm /> },
            { path: 'detail', element: <PenggajianDetail /> },
            { path: 'detail/tunjangan-lain', element: <TunjanganLainForm /> },
            { path: 'detail/bonus-thr', element: <BonusThrForm /> },
            { path: 'detail/potongan', element: <PotonganForm /> },
            { path: 'status', element: <StatusPenggajianDetail /> },
          ],
        },
        {
          path: 'status-penggajian',
          children: [
            { element: <Navigate to="/dashboard/status-penggajian/index" replace />, index: true },
            { path: 'index', element: <StatusPenggajian /> },
            { path: 'list', element: <StatusPenggajianList /> },
            { path: 'detail', element: <StatusPenggajianDetail /> },
          ],
        },
        {
          path: 'gaji-pokok-tunjangan',
          children: [
            { element: <Navigate to="/dashboard/gaji-pokok-tunjangan/list" replace />, index: true },
            { path: 'list', element: <GajiPokokTunjanganList /> },
            { path: 'form', element: <GajiPokokTunjanganForm /> },
          ],
        },
        {
          path: 'penilaian-kinerja',
          children: [
            { element: <Navigate to="/dashboard/penilaian-kinerja/list" replace />, index: true },
            { path: 'list', element: <PenilaianKinerjaList /> },
            { path: 'form', element: <PenilaianKinerjaForm /> },
          ],
        },
        {
          path: 'lembur',
          children: [
            { element: <Navigate to="/dashboard/lembur/list" replace />, index: true },
            { path: 'list', element: <LemburList /> },
            { path: 'form', element: <LemburForm /> },
          ],
        },
        {
          path: 'laporan-penggajian-pajak',
          element: <LaporanPenggajianPajak />,
          index: true,
        },
        {
          path: 'validasi-penggajian',
          children: [
            { element: <Navigate to="/dashboard/validasi-penggajian/list" replace />, index: true },
            { path: 'list', element: <ValidasiPenggajianList /> },
            { path: 'form', element: <ValidasiPenggajianForm /> },
          ],
        },
        {
          path: 'verifikasi-penggajian',
          children: [
            { element: <Navigate to="/dashboard/verifikasi-penggajian/list" replace />, index: true },
            { path: 'list', element: <VerifikasiPenggajianList /> },
            { path: 'form', element: <VerifikasiPenggajianForm /> },
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
    // {
    //   path: '/',
    //   element: <MainLayout />,
    //   children: [
    //     { element: <HomePage />, index: true },
    //     { path: 'about-us', element: <About /> },
    //     { path: 'contact-us', element: <Contact /> },
    //     { path: 'faqs', element: <Faqs /> },
    //   ],
    // },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const ChooseRole = Loadable(lazy(() => import('../pages/auth/ChooseRole')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));
// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const DashboardAdmin = Loadable(lazy(() => import('../pages/dashboard/DashboardAdmin')));
const DashboardDirut = Loadable(lazy(() => import('../pages/dashboard/DashboardDirut')));
const DashboardGm = Loadable(lazy(() => import('../pages/dashboard/DashboardGm')));
const DashboardManHrd = Loadable(lazy(() => import('../pages/dashboard/DashboardManHrd')));
const DashboardManPro = Loadable(lazy(() => import('../pages/dashboard/DashboardManPro')));
const DashboardManFin = Loadable(lazy(() => import('../pages/dashboard/DashboardManFin')));
const DashboardStafPayroll = Loadable(lazy(() => import('../pages/dashboard/DashboardStafPayroll')));
const DashboardStafInv = Loadable(lazy(() => import('../pages/dashboard/DashboardStafInv')));
const DashboardStafAbs = Loadable(lazy(() => import('../pages/dashboard/DashboardStafAbs')));
const DashboardPegawai = Loadable(lazy(() => import('../pages/dashboard/DashboardPegawai')));
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

// MASTER DATA
const BagianList = Loadable(lazy(() => import('../pages/masterdatabagian/BagianList')));
const BagianForm = Loadable(lazy(() => import('../pages/masterdatabagian/BagianForm')));
const JabatanList = Loadable(
  lazy(() => import('../pages/masterdatajabatan/JabatanList'))
);
const JabatanForm = Loadable(
  lazy(() => import('../pages/masterdatajabatan/JabatanForm'))
);
const TarifPtkpList = Loadable(lazy(() => import('../pages/masterdatatarifptkp/TarifPtkpList')));
const TarifPtkpForm = Loadable(lazy(() => import('../pages/masterdatatarifptkp/TarifPtkpForm')));

// Akun
const Akun = Loadable(lazy(() => import('../pages/akun')));

// Data Induk
const DataInduk = Loadable(lazy(() => import('../pages/datainduk')));

// ABSENSI
const AbsensiList = Loadable(lazy(() => import('../pages/absensi/AbsensiList')));
const AbsensiForm = Loadable(lazy(() => import('../pages/absensi/AbsensiForm')));
const AbsensiValidation = Loadable(lazy(() => import('../pages/absensi/AbsensiValidation')));

// SLIP GAJI
const SlipGajiList = Loadable(lazy(() => import('../pages/slipgaji/SlipGajiList')));
const SlipGajiDetail = Loadable(lazy(() => import('../pages/slipgaji/SlipGajiDetail')));

// PENGGAJIAN
const PenggajianList = Loadable(lazy(() => import('../pages/penggajian/PenggajianList')));
const PenggajianForm = Loadable(lazy(() => import('../pages/penggajian/PenggajianForm')));
const PenggajianDetail = Loadable(lazy(() => import('../pages/penggajian/PenggajianDetail')));
const TunjanganLainForm = Loadable(lazy(() => import('../pages/penggajian/TunjanganLainForm')));
const BonusThrForm = Loadable(lazy(() => import('../pages/penggajian/BonusThrForm')));
const PotonganForm = Loadable(lazy(() => import('../pages/penggajian/PotonganForm')));

// STATUS PENGGAJIAN
const StatusPenggajian = Loadable(lazy(() => import('../pages/penggajian/StatusPenggajian')));
const StatusPenggajianList = Loadable(lazy(() => import('../pages/statuspenggajian/StatusPenggajianList')));
const StatusPenggajianDetail = Loadable(lazy(() => import('../pages/statuspenggajian/StatusPenggajianDetail')));

// JABATAN GAJI
const GajiPokokTunjanganList = Loadable(lazy(() => import('../pages/gajipokoktunjangan/GajiPokokTunjanganList')));
const GajiPokokTunjanganForm = Loadable(lazy(() => import('../pages/gajipokoktunjangan/GajiPokokTunjanganForm')));

// PENILAIAN KINERJA
const PenilaianKinerjaList = Loadable(lazy(() => import('../pages/penilaiankinerja/PenilaianKinerjaList')));
const PenilaianKinerjaForm = Loadable(lazy(() => import('../pages/penilaiankinerja/PenilaianKinerjaForm')));

// LEMBUR
const LemburList = Loadable(lazy(() => import('../pages/lembur/LemburList')));
const LemburForm = Loadable(lazy(() => import('../pages/lembur/LemburForm')));

// LAPORAN PENGGAJIAN & PAJAK
const LaporanPenggajianPajak = Loadable(lazy(() => import('../pages/laporanpenggajianpajak/LaporanPenggajianPajak')));

// VALIDASI PENGGAJIAN
const ValidasiPenggajianList = Loadable(lazy(() => import('../pages/validasipenggajian/ValidasiPenggajianList')));
const ValidasiPenggajianForm = Loadable(lazy(() => import('../pages/validasipenggajian/ValidasiPenggajianForm')));

// VERIFIKASI PENGGAJIAN
const VerifikasiPenggajianList = Loadable(lazy(() => import('../pages/verifikasipenggajian/VerifikasiPenggajianList')));
const VerifikasiPenggajianForm = Loadable(lazy(() => import('../pages/verifikasipenggajian/VerifikasiPenggajianForm')));
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
