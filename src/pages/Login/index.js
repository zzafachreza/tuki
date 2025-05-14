import { View, Text, ImageBackground, ScrollView, Image, TouchableNativeFeedback, Animated } from 'react-native';
import React, { useState } from 'react';
import { colors, fonts } from '../../utils';
import { MyInput } from '../../components';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [data, setData] = useState({ email: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [errorEmail, setErrorEmail] = useState('');

  const switchTab = (mode) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsRegister(mode);
      setErrorEmail('');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleRegister = async () => {
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
        await AsyncStorage.setItem('user', JSON.stringify(data));
        showMessage({
          type: 'success',
          backgroundColor: colors.success,
          color: colors.white,
          message: 'Berhasil Register!',
          position: 'top',
        });
        setIsRegister(false);
        setData({ email: '', password: '' });
      } catch (err) {
        console.log(err);
      }
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

  const isFilled = data.email !== '' && data.password !== '';

  return (
    <ImageBackground
      style={{ flex: 1, backgroundColor: 'white' }}
      source={require('../../assets/bglogin.png')}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image source={require('../../assets/logo.png')} style={{ width: 200, height: 100, resizeMode: 'contain' }} />
        </View>

        {/* Tab */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          borderRadius: 30,
          overflow: 'hidden',
          marginBottom: 20,
          borderWidth: 0.5
        }}>
          <TouchableNativeFeedback onPress={() => switchTab(true)}>
            <View style={{
              flex: 1,
              padding: 12,
              alignItems: 'center',
              backgroundColor: isRegister ? '#9C42C4' : 'white',
            }}>
              <Text style={{
                fontFamily: fonts.primary[600],
                color: isRegister ? 'white' : 'black'
              }}>Register</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => switchTab(false)}>
            <View style={{
              flex: 1,
              padding: 12,
              alignItems: 'center',
              backgroundColor: !isRegister ? '#9C42C4' : 'white',
            }}>
              <Text style={{
                fontFamily: fonts.primary[600],
                color: !isRegister ? 'white' : 'black'
              }}>Login</Text>
            </View>
          </TouchableNativeFeedback>
        </View>

        {/* Input Form */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <MyInput
            label="Email"
            placeholder="Contoh.com@gmail.com"
            iconname="mail-outline"
            value={data.email}
            onChangeText={(x) => {
              setData({ ...data, email: x });
              setErrorEmail('');
            }}
            keyboardType="email-address"
          />

          {errorEmail !== '' && !isRegister && (
            <Text style={{
              color: 'red',
              fontSize: 12,
              marginTop: 5,
              marginBottom: 10,
              marginLeft: 12,
              fontFamily: fonts.primary[400]
            }}>{errorEmail}</Text>
          )}

          <MyInput
            label="Password"
            placeholder="Masukkan Password"
            iconname="lock-closed-outline"
            secureTextEntry={true}
            value={data.password}
            onChangeText={(x) => {
              setData({ ...data, password: x });
              setErrorEmail('');
            }}
          />

          <TouchableNativeFeedback>
            <View style={{
              alignItems: 'flex-end',
              marginTop: 5,
              opacity: isRegister ? 0 : 1,
              height: 18
            }}>
              <Text style={{
                fontFamily: fonts.primary[600],
                fontSize: 13,
                color: '#9C42C4'
              }}>
                Lupa Password ?
              </Text>
            </View>
          </TouchableNativeFeedback>

          {/* Tombol Login/Register */}
          <TouchableNativeFeedback onPress={isRegister ? handleRegister : handleLogin}>
            <View style={{
              backgroundColor: isFilled ? '#9C42C4' : '#d1d1d1',
              paddingVertical: 14,
              borderRadius: 30,
              marginTop: 20,
              alignItems: 'center',
              elevation: 2
            }}>
              <Text style={{
                fontFamily: fonts.primary[600],
                fontSize: 16,
                color: isFilled ? 'white' : 'black'
              }}>
                {isRegister ? 'Register' : 'Login'}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}
