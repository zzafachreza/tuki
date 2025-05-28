import { View, Text, ImageBackground, ScrollView, Image, TouchableNativeFeedback, Animated, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors, fonts } from '../../utils';
import { MyInput, MyPicker } from '../../components';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { apiURL, storeData } from '../../utils/localStorage';
import { Linking } from 'react-native';

export default function Login({ navigation }) {
  const [company, setCompany] = useState({});
  const [data, setData] = useState({
    nama: '',
    kelamin: '',
    telepon: '',
    email: '',
    provinsi: 'ACEH',
    kota: 'KABUPATEN SIMEULUE',
    password: '',
    foto: null
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [errorEmail, setErrorEmail] = useState('');


  const [provinsi, setProvinsi] = useState([]);
  const [kota, setKota] = useState([]);

  const __getProvinsi = () => {
    axios.get('https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json').then(res => {

      let tmp = [];
      res.data.map(i => {
        tmp.push({
          label: i.name,
          value: i.id + '#' + i.name
        })
      });
      console.log(tmp);
      setProvinsi(tmp);
    })
  }


  const __getKota = (x = 11) => {
    axios.get(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${x}.json`).then(res => {

      let tmp = [];
      res.data.map(i => {
        tmp.push({
          label: i.name,
          value: i.name
        })
      });
      console.log(tmp);
      setKota(tmp);

    })
  }

  const switchTab = (mode) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsRegister(mode);
      setData({ nama: '', kelamin: '', telepon: '', email: '', provinsi: 'Jawa Barat', kota: 'Bandung', password: '', foto: null });
      setConfirmPassword('');
      setErrorEmail('');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const pilihFoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5, includeBase64: true }, res => {
      if (!res.didCancel && res.assets) {
        setData({ ...data, foto: `data:${res.assets[0].type};base64,${res.assets[0].base64}` });
      }
    });
  };

  const handleRegister = async () => {
    const { nama, kelamin, telepon, email, provinsi, kota, password } = data;
    if (!nama || !kelamin || !telepon || !email || !provinsi || !kota || !password || !confirmPassword) {
      showMessage({
        message: 'Semua field wajib diisi',
        type: 'danger',
        backgroundColor: colors.danger,
      });
      return;
    }
    if (password !== confirmPassword) {
      showMessage({
        message: 'Konfirmasi password tidak cocok',
        type: 'danger',
        backgroundColor: colors.danger,
      });
      return;
    }


    axios.post(apiURL + 'register', data).then(res => {
      console.log(res.data);
      if (res.data.status == 200) {
        showMessage({
          type: 'success',
          message: res.data.message
        });
        setIsRegister(false)

      } else {
        showMessage({
          type: 'danger',
          message: res.data.message
        })
      }
    })
    //   await AsyncStorage.setItem('user', JSON.stringify(data));
    //   showMessage({
    //     type: 'success',
    //     backgroundColor: colors.success,
    //     color: colors.white,
    //     message: 'Berhasil Register!',
    //     position: 'top',
    //   });
    //   setIsRegister(false);
    // } catch (err) {
    //   console.log(err);
    // }
  }

  const handleLogin = async () => {
    if (data.email === '' || data.password === '') {
      showMessage({
        type: 'danger',
        backgroundColor: colors.danger,
        color: colors.white,
        message: 'Semua Field Harus Diisi!',
        position: 'top',
      });
    } else {
      try {
        console.log(data);
        axios.post(apiURL + 'login', data).then(res => {
          if (res.data.status == 200) {
            console.log(res.data.data);
            storeData('user', res.data.data);
            storeData('baru', 0);
            navigation.replace('MainApp')
            // setIsRegister(false)

          } else {
            showMessage({
              type: 'danger',
              message: res.data.message
            })
          }
        })
      } catch (err) {
        console.log(err);
      }
    }
  };

  const isFilled = data.email !== '' && data.password !== '' && (!isRegister || confirmPassword !== '');


  useEffect(() => {
    axios.post(apiURL + 'company').then(res => {
      setCompany(res.data[0])
    })
    __getProvinsi();
    __getKota();
  }, [])
  return (
    <ImageBackground style={{ flex: 1, backgroundColor: 'white' }} source={require('../../assets/bglogin.png')}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image source={require('../../assets/logo.png')} style={{ width: 200, height: 100, resizeMode: 'contain' }} />
        </View>

        <View style={{ flexDirection: 'row', backgroundColor: 'white', borderRadius: 30, overflow: 'hidden', marginBottom: 20, borderWidth: 0.5 }}>
          <TouchableNativeFeedback onPress={() => switchTab(true)}>
            <View style={{ flex: 1, padding: 12, alignItems: 'center', backgroundColor: isRegister ? '#9C42C4' : 'white' }}>
              <Text style={{ fontFamily: fonts.primary[600], color: isRegister ? 'white' : 'black' }}>Register</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => switchTab(false)}>
            <View style={{ flex: 1, padding: 12, alignItems: 'center', backgroundColor: !isRegister ? '#9C42C4' : 'white' }}>
              <Text style={{ fontFamily: fonts.primary[600], color: !isRegister ? 'white' : 'black' }}>Login</Text>
            </View>
          </TouchableNativeFeedback>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {isRegister && (
            <>
              <TouchableOpacity onPress={pilihFoto} style={{ alignItems: 'center', marginBottom: 10 }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#D9D9D9', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                  {data.foto ? (
                    <Image source={{ uri: data.foto }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Text style={{ fontSize: 30, color: '#999' }}>+</Text>
                  )}
                </View>
              </TouchableOpacity>
              <MyInput label="Nama Lengkap Parents" value={data.nama} onChangeText={(x) => setData({ ...data, nama: x })} iconname="person" placeholder="Masukkan Nama Lengkap Parents" />
              <Text style={{ fontFamily: fonts.primary[600], marginBottom: 10 }}>Jenis Kelamin</Text>
              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <TouchableOpacity onPress={() => setData({ ...data, kelamin: 'Perempuan' })} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#2D2D2D', marginRight: 8, backgroundColor: data.kelamin === 'Perempuan' ? '#2D2D2D' : 'transparent' }} />
                  <Text style={{ fontFamily: fonts.primary[400], fontSize: 14 }}>Perempuan</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setData({ ...data, kelamin: 'Laki-Laki' })} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#2D2D2D', marginRight: 8, backgroundColor: data.kelamin === 'Laki-Laki' ? '#2D2D2D' : 'transparent' }} />
                  <Text style={{ fontFamily: fonts.primary[400], fontSize: 14 }}>Laki-Laki</Text>
                </TouchableOpacity>
              </View>
              <MyInput label="Nomor Telepon" value={data.telepon} onChangeText={(x) => setData({ ...data, telepon: x })} keyboardType="phone-pad" iconname="call" placeholder="Masukkan Nomor Telepon" />
              <MyPicker
                label="Provinsi"
                iconname="location-outline"
                value={data.provinsi}
                onChangeText={(val) => {
                  console.log(val.split("#"));
                  setData({
                    ...data,
                    provinsi: val.split("#")[1]
                  });
                  __getKota(val.split("#")[0]);
                }}
                data={provinsi}
              />
              <MyPicker
                label="Kota / Kabupaten"
                iconname="business-outline"
                value={data.kota}
                onChangeText={(val) => {
                  setData({
                    ...data,
                    kota: val
                  });
                }}
                data={kota}
              />
            </>
          )}

          <MyInput label="Email" placeholder="contoh@gmail.com" iconname="mail-outline" value={data.email} onChangeText={(x) => { setData({ ...data, email: x }); setErrorEmail(''); }} />

          {errorEmail !== '' && !isRegister && (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 5, marginBottom: 10, marginLeft: 12, fontFamily: fonts.primary[400] }}>{errorEmail}</Text>
          )}

          <MyInput label="Password" placeholder="Masukkan Password" iconname="lock-closed-outline" secureTextEntry value={data.password} onChangeText={(x) => { setData({ ...data, password: x }); setErrorEmail(''); }} />

          {isRegister && (
            <MyInput label="Konfirmasi Password" placeholder="Masukkan ulang password" iconname="lock-closed-outline" secureTextEntry value={confirmPassword} onChangeText={(x) => setConfirmPassword(x)} />
          )}

          {!isRegister && (
            <TouchableNativeFeedback onPress={() => {
              console.log(company);
              Linking.openURL('https://wa.me/' + company.tlp + '?text=Halo Admin, saya lupa password . . ')
            }}>
              <View style={{ alignItems: 'flex-end', marginTop: 5, height: 18 }}>
                <Text style={{ fontFamily: fonts.primary[600], fontSize: 13, color: '#9C42C4' }}>
                  Lupa Password ?
                </Text>
              </View>
            </TouchableNativeFeedback>
          )}

          <TouchableNativeFeedback onPress={isRegister ? handleRegister : handleLogin}>
            <View style={{ backgroundColor: isFilled ? '#9C42C4' : '#d1d1d1', paddingVertical: 14, borderRadius: 30, marginTop: 20, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.primary[600], fontSize: 16, color: isFilled ? 'white' : 'black' }}>
                {isRegister ? 'Register' : 'Login'}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}
