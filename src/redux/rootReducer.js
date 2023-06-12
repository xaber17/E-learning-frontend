import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import usersReducer from './slices/users';
import authReducer from './slices/auth';
import masterBagianReducer from './slices/masterBagian';
import masterJabatanReducer from './slices/masterJabatan';
import masterTarifPtkpReducer from './slices/masterTarifPtkp';
import absensiReducer from './slices/absensi';
import penilaianKinerjaReducer from './slices/penilaianKinerja';
import lemburReducer from './slices/lembur';
import pegawaiReducer from './slices/pegawai';
import gajiPokokTunjanganReducer from './slices/gajiPokokTunjangan';
import penggajianReducer from './slices/penggajian';
import slipGajiReducer from './slices/slipGaji';
import dashboardReducer from './slices/dashboard';
import laporanReducer from './slices/laporan';
import notifikasiReducer from './slices/notifikasi';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [
    'auth',
    'users',
    'absensi',
    'penilaianKinerja',
    'lembur',
    'masterBagian',
    'masterJabatan',
    'masterTarifPtkp',
    'pegawai',
    'gajiPokokTunjangan',
    'penggajian',
    'slipGaji',
    'dashboard',
    'laporan',
    'notifikasi',
  ],
};

// const absensiPersistConfig = {
//   key: 'absensi',
//   storage,
//   keyPrefix: 'redux-',
//   whitelist: ['sortBy', 'checkout'],
// };

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: productReducer,
  auth: authReducer,
  users: usersReducer,
  masterBagian: masterBagianReducer,
  masterJabatan: masterJabatanReducer,
  masterTarifPtkp: masterTarifPtkpReducer,
  absensi: absensiReducer,
  penilaianKinerja: penilaianKinerjaReducer,
  lembur: lemburReducer,
  pegawai: pegawaiReducer,
  gajiPokokTunjangan: gajiPokokTunjanganReducer,
  penggajian: penggajianReducer,
  slipGaji: slipGajiReducer,
  dashboard: dashboardReducer,
  laporan: laporanReducer,
  notifikasi: notifikasiReducer,
});

export { rootPersistConfig, rootReducer };
