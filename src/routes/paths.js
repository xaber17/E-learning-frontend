// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
  login: '/',
  role: '/role',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    admin: path(ROOTS_DASHBOARD, '/admin'),
    dirut: path(ROOTS_DASHBOARD, '/dirut'),
    gm: path(ROOTS_DASHBOARD, '/gm'),
    manhrd: path(ROOTS_DASHBOARD, '/manhrd'),
    manpro: path(ROOTS_DASHBOARD, '/manpro'),
    manfin: path(ROOTS_DASHBOARD, '/manfin'),
    stafpayroll: path(ROOTS_DASHBOARD, '/stafpayroll'),
    stafinv: path(ROOTS_DASHBOARD, '/stafinv'),
    stafabs: path(ROOTS_DASHBOARD, '/stafabs'),
    pegawai: path(ROOTS_DASHBOARD, '/pegawai'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey'),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),

  users: {
    root: path(ROOTS_DASHBOARD, '/users'),
    list: path(ROOTS_DASHBOARD, '/users/list'),
    form: path(ROOTS_DASHBOARD, '/users/form'),
  },
  masterdataBagian: {
    root: path(ROOTS_DASHBOARD, '/bagian'),
    list: path(ROOTS_DASHBOARD, '/bagian/list'),
    form: path(ROOTS_DASHBOARD, '/bagian/form'),
  },
  masterdataJabatan: {
    root: path(ROOTS_DASHBOARD, '/jabatan'),
    list: path(ROOTS_DASHBOARD, '/jabatan/list'),
    form: path(ROOTS_DASHBOARD, '/jabatan/form'),
  },
  masterdataTarifPtkp: {
    root: path(ROOTS_DASHBOARD, '/tarif-ptkp'),
    list: path(ROOTS_DASHBOARD, '/tarif-ptkp/list'),
    form: path(ROOTS_DASHBOARD, '/tarif-ptkp/form'),
  },
  akun: path(ROOTS_DASHBOARD, '/akun'),
  dataInduk: path(ROOTS_DASHBOARD, '/data-induk'),
  absensi: {
    root: path(ROOTS_DASHBOARD, '/absensi'),
    list: path(ROOTS_DASHBOARD, '/absensi/list'),
    form: path(ROOTS_DASHBOARD, '/absensi/form'),
    validation: path(ROOTS_DASHBOARD, '/absensi/validation'),
  },
  slipGaji: {
    root: path(ROOTS_DASHBOARD, '/slip-gaji'),
    list: path(ROOTS_DASHBOARD, '/slip-gaji/list'),
    detail: path(ROOTS_DASHBOARD, '/slip-gaji/detail'),
  },
  statusPenggajian: {
    root: path(ROOTS_DASHBOARD, '/status-penggajian'),
    index: path(ROOTS_DASHBOARD, '/status-penggajian/index'),
    list: path(ROOTS_DASHBOARD, '/status-penggajian/list'),
    detail: path(ROOTS_DASHBOARD, '/status-penggajian/detail'),
  },
  gajiPokokTunjangan: {
    root: path(ROOTS_DASHBOARD, '/gaji-pokok-tunjangan'),
    list: path(ROOTS_DASHBOARD, '/gaji-pokok-tunjangan/list'),
    form: path(ROOTS_DASHBOARD, '/gaji-pokok-tunjangan/form'),
  },
  penggajian: {
    root: path(ROOTS_DASHBOARD, '/penggajian'),
    list: path(ROOTS_DASHBOARD, '/penggajian/list'),
    form: path(ROOTS_DASHBOARD, '/penggajian/form'),
    detail: path(ROOTS_DASHBOARD, '/penggajian/detail'),
    tunjanganLain: path(ROOTS_DASHBOARD, '/penggajian/detail/tunjangan-lain'),
    status: path(ROOTS_DASHBOARD, '/penggajian/status'),
    bonusThr: path(ROOTS_DASHBOARD, '/penggajian/detail/bonus-thr'),
    potongan: path(ROOTS_DASHBOARD, '/penggajian/detail/potongan'),
    // statusPenggajian: path(ROOTS_DASHBOARD, '/penggajian/status-penggajian'),
  },
  penilaianKinerja: {
    root: path(ROOTS_DASHBOARD, '/penilaian-kinerja'),
    list: path(ROOTS_DASHBOARD, '/penilaian-kinerja/list'),
    form: path(ROOTS_DASHBOARD, '/penilaian-kinerja/form'),
  },
  lembur: {
    root: path(ROOTS_DASHBOARD, '/lembur'),
    list: path(ROOTS_DASHBOARD, '/lembur/list'),
    form: path(ROOTS_DASHBOARD, '/lembur/form'),
  },
  laporanPenggajianPajak: path(ROOTS_DASHBOARD, '/laporan-penggajian-pajak'),
  validasiPenggajian: {
    root: path(ROOTS_DASHBOARD, '/validasi-penggajian'),
    list: path(ROOTS_DASHBOARD, '/validasi-penggajian/list'),
    form: path(ROOTS_DASHBOARD, '/validasi-penggajian/form'),
  },
  verifikasiPenggajian: {
    root: path(ROOTS_DASHBOARD, '/verifikasi-penggajian'),
    list: path(ROOTS_DASHBOARD, '/verifikasi-penggajian/list'),
    form: path(ROOTS_DASHBOARD, '/verifikasi-penggajian/form'),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account'),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    product: path(ROOTS_DASHBOARD, '/e-commerce/product/:name'),
    productById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    newProduct: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    editById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/e-commerce/invoice'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    post: path(ROOTS_DASHBOARD, '/blog/post/:title'),
    postById: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
    newPost: path(ROOTS_DASHBOARD, '/blog/new-post'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
