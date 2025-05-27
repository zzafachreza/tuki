import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { apiURL, getData, storeData } from '../../utils/localStorage';
import { fonts, colors } from '../../utils';
import { Icon } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import { MyHeader } from '../../components';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState({});
  const [anakCount, setAnakCount] = useState(0);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);

  const __getAnak = () => {
    getData('user').then(u => {

      axios.post(apiURL + 'anak', {
        fid_pengguna: u.id_pengguna
      }).then(res => {
        console.log(res.data);
        setAnakCount(res.data.length);

      })

    })
  }

  useEffect(() => {
    if (isFocused) {
      __getAnak();
      getData('user').then(res => {
        setUser(res || {});
        setLoading(false);
      });


    }
  }, [isFocused]);

  const handleLogout = () => {
    Alert.alert('Konfirmasi', 'Apakah kamu yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        onPress: () => {
          storeData('user', null);
          navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader title='Profile Parents' />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.rowTop}>
            <Image
              source={user.foto_user ? { uri: user.foto_user } : require('../../assets/user.png')}
              style={styles.avatar}
            />
            <View style={styles.profileText}>
              <Text style={styles.hallo}>Hallo ,</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.name}>{user.nama || 'Tidak diketahui'}</Text>
                {user.kelamin === 'Laki-Laki' && <Text style={styles.maleIcon}> ♂</Text>}
                {user.kelamin === 'Perempuan' && <Text style={styles.femaleIcon}> ♀</Text>}
              </View>
            </View>
          </View>

          <View style={styles.childCountBox}>
            <Image source={require('../../assets/bayi.png')} style={styles.babyIcon} />
            <Text style={styles.childCount}>{anakCount}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <View style={styles.infoItem}><Text style={styles.label}>Jenis Kelamin</Text><Text>{user.kelamin || '-'}</Text></View>
          <View style={styles.infoItem}><Text style={styles.label}>Email</Text><Text>{user.email || '-'}</Text></View>
          <View style={styles.infoItem}><Text style={styles.label}>Nomor Telepon</Text><Text>{user.telepon || '-'}</Text></View>
          <View style={styles.infoItem}><Text style={styles.label}>Provinsi</Text><Text>{user.provinsi || '-'}</Text></View>
          <View style={styles.infoItem}><Text style={styles.label}>Kota/Kabupaten</Text><Text>{user.kota || '-'}</Text></View>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => {
          navigation.navigate('AccountEdit', user);
        }}
        >
          <Text style={styles.editBtnText}>Ubah Profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleLogout}>
          <Text style={styles.deleteBtnText}>Keluar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EAF4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  profileCard: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
  profileText: {
    flex: 1,
  },
  hallo: {
    fontFamily: fonts.primary[400],
    fontSize: 16,
  },
  name: {
    fontFamily: fonts.primary[700],
    fontSize: 20,
    color: colors.black,
  },
  maleIcon: {
    color: '#007AFF',
    fontSize: 20,
  },
  femaleIcon: {
    color: '#FF2D55',
    fontSize: 20,
  },
  childCountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  babyIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
    tintColor: "#9F48B8"
  },
  childCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  infoItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  label: {
    fontFamily: fonts.primary[600],
    marginBottom: 2,
  },
  editBtn: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: '#333',
    paddingVertical: 10,
    alignItems: 'center',
  },
  editBtnText: {
    fontFamily: fonts.primary[400],
    color: '#333',
  },
  deleteBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontFamily: fonts.primary[400],
    color: 'red',
  },
});
