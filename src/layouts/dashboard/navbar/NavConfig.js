// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
};

const getIconify = (name) => <Iconify icon={name} sx={{ width: 1, height: 1 }} />;

const ICONIFY = {
  users: getIconify('fa6-solid:user-group'),
  file: getIconify('akar-icons:file'),
  view: getIconify('material-symbols:calendar-view-month'),
  alarm: getIconify('mdi:alarm-clock-check'),
  clock: getIconify('mdi:clock-time-three-outline'),
};

function navConfig(role) {
  let nav = {
    subheader: null,
    items: [],
  };

  if (role === 'admin') {
    nav = [
      {
        items: [
          { title: 'Beranda', path: PATH_DASHBOARD.general.admin, icon: ICONS.analytics },
          { title: 'Users', path: PATH_DASHBOARD.users.root, icon: ICONIFY.users },
          {
            title: 'Master Data',
            icon: ICONIFY.file,
            children: [
              { title: 'Tarif PTKP', path: PATH_DASHBOARD.masterdataTarifPtkp.root },
              { title: 'Bagian', path: PATH_DASHBOARD.masterdataBagian.root },
              { title: 'Jabatan', path: PATH_DASHBOARD.masterdataJabatan.root },
            ],
          },
          { title: 'Akun', path: PATH_DASHBOARD.akun, icon: ICONS.user },
        ],
      },
    ];
  } else if (role === 'pegawai') {
    nav = [
      {
        items: [
          { title: 'Beranda', path: PATH_DASHBOARD.general.pegawai, icon: ICONS.analytics },
          { title: 'Data Induk', path: PATH_DASHBOARD.dataInduk, icon: ICONIFY.users },
          { title: 'Absensi', path: PATH_DASHBOARD.absensi.root, icon: ICONS.booking },
          { title: 'Slip Gaji', path: PATH_DASHBOARD.slipGaji.root, icon: ICONIFY.file },
          // {
          //   title: 'Master Data',
          //   path: PATH_DASHBOARD.general.app,
          //   icon: ICONIFY.file,
          //   children: [
          //     { title: 'Tarif PTKP', path: PATH_DASHBOARD.masterdata.rootTarifPtkp },
          //     { title: 'Bagian', path: PATH_DASHBOARD.masterdata.rootBagian },
          //     { title: 'Jabatan', path: PATH_DASHBOARD.masterdata.rootJabatan },
          //   ],
          // },
          { title: 'Akun', path: PATH_DASHBOARD.akun, icon: ICONS.user },
        ],
      },
    ];
  } else if (role === 'stafinv') {
    nav = [
      {
        items: [
          { title: 'Beranda', path: PATH_DASHBOARD.general.stafinv, icon: ICONS.analytics },
          { title: 'Status Penggajian', path: PATH_DASHBOARD.penggajian.root, icon: ICONIFY.file },
          { title: 'Akun', path: PATH_DASHBOARD.akun, icon: ICONS.user },
        ],
      },
    ];
  } else if (role === 'stafpayroll') {
    nav = [
      {
        items: [
          { title: 'Beranda', path: PATH_DASHBOARD.general.stafpayroll, icon: ICONS.analytics },
          { title: 'Gaji Pokok dan Tunjangan', path: PATH_DASHBOARD.gajiPokokTunjangan.root, icon: ICONIFY.users },
          { title: 'Penggajian', path: PATH_DASHBOARD.penggajian.root, icon: ICONIFY.file },
          { title: 'Status Penggajian', path: PATH_DASHBOARD.statusPenggajian.root, icon: ICONIFY.view },
          { title: 'Akun', path: PATH_DASHBOARD.akun, icon: ICONS.user },
        ],
      },
    ];
  } else if (role === 'manfin') {
    nav = [
      {
        items: [
          { title: 'Beranda', path: PATH_DASHBOARD.general.manfin, icon: ICONS.analytics },
          // { title: 'Penilaian Kinerja', path: PATH_DASHBOARD.penilaianKinerja.root, icon: ICONIFY.users },
          { title: 'Laporan Penggajian & Pajak', path: PATH_DASHBOARD.laporanPenggajianPajak, icon: ICONIFY.file },
          { title: 'Akun', path: PATH_DASHBOARD.akun, icon: ICONS.user },
        ],
      },
    ];
  } else if (role === 'manpro') {
    nav = [
      {
        items: [
          { title: 'Beranda', path: PATH_DASHBOARD.general.manpro, icon: ICONS.analytics },
          { title: 'Penilaian Kinerja', path: PATH_DASHBOARD.penilaianKinerja.root, icon: ICONIFY.users },
          { title: 'Akun', path: PATH_DASHBOARD.akun, icon: ICONS.user },
        ],
      },
    ];
  } else if (role === 'manhrd') {
    nav = [
      {
        items: [
          { title: 'Beranda', path: PATH_DASHBOARD.general.manhrd, icon: ICONS.analytics },
          // { title: 'Penilaian Kinerja', path: PATH_DASHBOARD.penilaianKinerja.root, icon: ICONIFY.users },
          { title: 'Persetujuan Penggajian', path: PATH_DASHBOARD.penggajian.root, icon: ICONIFY.file },
          { title: 'Akun', path: PATH_DASHBOARD.akun, icon: ICONS.user },
        ],
      },
    ];
  } else if (role === 'gm') {
    nav = [
      {
        items: [
          { title: 'Beranda', path: PATH_DASHBOARD.general.gm, icon: ICONS.analytics },
          // { title: 'Penilaian Kinerja', path: PATH_DASHBOARD.penilaianKinerja.root, icon: ICONIFY.users },
          { title: 'Verifikasi Penggajian', path: PATH_DASHBOARD.penggajian.root, icon: ICONIFY.file },
          { title: 'Akun', path: PATH_DASHBOARD.akun, icon: ICONS.user },
        ],
      },
    ];
  } else if (role === 'dirut') {
    nav = [
      {
        items: [
          { title: 'Beranda', path: PATH_DASHBOARD.general.dirut, icon: ICONS.analytics },
          // { title: 'Penilaian Kinerja', path: PATH_DASHBOARD.penilaianKinerja.root, icon: ICONIFY.users },
          { title: 'Laporan Penggajian & Pajak', path: PATH_DASHBOARD.laporanPenggajianPajak, icon: ICONIFY.file },
          { title: 'Akun', path: PATH_DASHBOARD.akun, icon: ICONS.user },
        ],
      },
    ];
  } else if (role === 'stafabs') {
    nav = [
      {
        items: [
          { title: 'Beranda', path: PATH_DASHBOARD.general.stafabs, icon: ICONS.analytics },
          { title: 'Validasi Absensi', path: PATH_DASHBOARD.absensi.validation, icon: ICONIFY.clock },
          { title: 'Lembur', path: PATH_DASHBOARD.lembur.root, icon: ICONIFY.alarm },
          { title: 'Akun', path: PATH_DASHBOARD.akun, icon: ICONS.user },
        ],
      },
    ];
  }
  // else {
  //   nav = [
  //     {
  //       items: [
  //         { title: 'Beranda', path: PATH_DASHBOARD.general.admin, icon: ICONS.analytics },
  //         { title: 'Akun', path: PATH_DASHBOARD.akun, icon: ICONS.user },
  //       ],
  //     },
  //   ];
  // }

  // GENERAL
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'general',
  //   items: [
  //     { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
  //     { title: 'e-commerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
  //     { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
  //     { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
  //     { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
  //   ],
  // },

  // // MANAGEMENT
  // // ----------------------------------------------------------------------
  // {
  //   subheader: 'management',
  //   items: [
  //     // MANAGEMENT : USER
  //     {
  //       title: 'user',
  //       path: PATH_DASHBOARD.user.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'profile', path: PATH_DASHBOARD.user.profile },
  //         { title: 'cards', path: PATH_DASHBOARD.user.cards },
  //         { title: 'list', path: PATH_DASHBOARD.user.list },
  //         { title: 'create', path: PATH_DASHBOARD.user.newUser },
  //         { title: 'edit', path: PATH_DASHBOARD.user.editById },
  //         { title: 'account', path: PATH_DASHBOARD.user.account },
  //       ],
  //     },

  //     // MANAGEMENT : E-COMMERCE
  //     {
  //       title: 'e-commerce',
  //       path: PATH_DASHBOARD.eCommerce.root,
  //       icon: ICONS.cart,
  //       children: [
  //         { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
  //         { title: 'product', path: PATH_DASHBOARD.eCommerce.productById },
  //         { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
  //         { title: 'create', path: PATH_DASHBOARD.eCommerce.newProduct },
  //         { title: 'edit', path: PATH_DASHBOARD.eCommerce.editById },
  //         { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
  //         { title: 'invoice', path: PATH_DASHBOARD.eCommerce.invoice },
  //       ],
  //     },

  //     // MANAGEMENT : BLOG
  //     {
  //       title: 'blog',
  //       path: PATH_DASHBOARD.blog.root,
  //       icon: ICONS.blog,
  //       children: [
  //         { title: 'posts', path: PATH_DASHBOARD.blog.posts },
  //         { title: 'post', path: PATH_DASHBOARD.blog.postById },
  //         { title: 'new post', path: PATH_DASHBOARD.blog.newPost },
  //       ],
  //     },
  //   ],
  // },

  // // APP
  // // ----------------------------------------------------------------------
  // {
  //   subheader: 'app',
  //   items: [
  //     {
  //       title: 'mail',
  //       path: PATH_DASHBOARD.mail.root,
  //       icon: ICONS.mail,
  //       info: (
  //         <Label variant="outlined" color="error">
  //           +32
  //         </Label>
  //       ),
  //     },
  //     { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
  //     { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
  //     {
  //       title: 'kanban',
  //       path: PATH_DASHBOARD.kanban,
  //       icon: ICONS.kanban,
  //     },
  //   ],
  // },
  return nav;
}

export default navConfig;
