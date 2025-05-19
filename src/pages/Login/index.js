import { View, Text, ImageBackground, ScrollView, Image, TouchableNativeFeedback, Animated, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors, fonts } from '../../utils';
import { MyInput, MyPicker } from '../../components';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [data, setData] = useState({
    nama: '',
    kelamin: '',
    telepon: '',
    email: '',
    provinsi: 'Jawa Barat',
    kota: 'Bandung',
    password: '',
    foto: null
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [errorEmail, setErrorEmail] = useState('');

  const provinsiList = [
    { label: 'Jawa Barat', value: 'Jawa Barat' },
    { label: 'Jawa Tengah', value: 'Jawa Tengah' },
    { label: 'Jawa Timur', value: 'Jawa Timur' },
  ];

  const kotaOptions = {
    'Jawa Barat': [ { label: 'Bandung', value: 'Bandung' } ],
    'Jawa Tengah': [ { label: 'Semarang', value: 'Semarang' } ],
    'Jawa Timur': [ { label: 'Surabaya', value: 'Surabaya' } ],
  };

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
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, res => {
      if (!res.didCancel && res.assets) {
        setData({ ...data, foto: res.assets[0] });
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
    try {
      await AsyncStorage.setItem('user', JSON.stringify(data));
      showMessage({
        type: 'success',
        backgroundColor: colors.success,
        color: colors.white,
        message: 'Berhasil Register!',
        position: 'top',
      });
      setIsRegister(false);
    } catch (err) {
      console.log(err);
    }
  };

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
        const user = await AsyncStorage.getItem('user');
        if (user !== null) {
          const parsed = JSON.parse(user);
          if (parsed.email === data.email && parsed.password === data.password) {
            showMessage({
              type: 'success',
              backgroundColor: colors.success,
              color: colors.white,
              message: 'Login Berhasil!',
              position: 'top',
            });
            navigation.navigate('MainApp');
          } else {
            setErrorEmail('Email atau password salah');
          }
        } else {
          setErrorEmail('Email tidak ditemukan');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const isFilled = data.email !== '' && data.password !== '' && (!isRegister || confirmPassword !== '');

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
                    <Image source={{ uri: data.foto.uri }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Text style={{ fontSize: 30, color: '#999' }}>+</Text>
                  )}
                </View>
              </TouchableOpacity>
              <MyInput label="Nama Lengkap" value={data.nama} onChangeText={(x) => setData({ ...data, nama: x })} iconname="person" placeholder="Masukkan Nama Lengkap"/>
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
              <MyInput label="Nomor Telepon" value={data.telepon} onChangeText={(x) => setData({ ...data, telepon: x })} keyboardType="phone-pad" iconname="call" placeholder="Masukkan Nomor Telepon"/>
              <MyPicker
                label="Provinsi"
                iconname="location-outline"
                value={data.provinsi}
                onChangeText={(val) => setData({ ...data, provinsi: val, kota: kotaOptions[val][0].value })}
                data={provinsiList}
              />
              <MyPicker
                label="Kota / Kabupaten"
                iconname="business-outline"
                value={data.kota}
                onChangeText={(val) => setData({ ...data, kota: val })}
                data={kotaOptions[data.provinsi] || []}
              />
            </>
          )}

          <MyInput label="Email" placeholder="Contoh.com@gmail.com" iconname="mail-outline" value={data.email} onChangeText={(x) => { setData({ ...data, email: x }); setErrorEmail(''); }} keyboardType="email-address" />

          {errorEmail !== '' && !isRegister && (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 5, marginBottom: 10, marginLeft: 12, fontFamily: fonts.primary[400] }}>{errorEmail}</Text>
          )}

          <MyInput label="Password" placeholder="Masukkan Password" iconname="lock-closed-outline" secureTextEntry value={data.password} onChangeText={(x) => { setData({ ...data, password: x }); setErrorEmail(''); }} />

          {isRegister && (
            <MyInput label="Konfirmasi Password" placeholder="Masukkan ulang password" iconname="lock-closed-outline" secureTextEntry value={confirmPassword} onChangeText={(x) => setConfirmPassword(x)} />
          )}

          {!isRegister && (
            <TouchableNativeFeedback>
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
