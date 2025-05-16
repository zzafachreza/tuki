import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'; // tambahkan jika belum ada


export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // saving error
  }
};

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return null;
    }
  } catch (e) {
    console.log('GAGAL GET DATA:', key, e);
    return null;
  }
};



export const pushNotif = async (notifBaru) => {
  try {
    const lama = await getData('notifikasi');
    const baru = {
      id: Date.now(),
      title: notifBaru.title,
      message: notifBaru.message,
      timestamp: moment().format('YYYY-MM-DD HH:mm')
    };
    const semua = lama && Array.isArray(lama) ? [baru, ...lama] : [baru];
    await AsyncStorage.setItem('notifikasi', JSON.stringify(semua));
  } catch (e) {
    console.log('Gagal pushNotif:', e);
  }
};

export const apiURL = 'https://nutrishot.okeadmin.com/api/';
export const MYAPP = 'NUTRISHOT';
export const api_token = 'd4e729bcd8aab6f0a710e8ca3d31524cb5783dd1d63ddbf32fbed278c435605f';
export const webURL = apiURL.replace("api/", "");
export const webPDF = apiURL.replace("api/", "assets/pdf/");


