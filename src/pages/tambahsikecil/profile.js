import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors, fonts, windowWidth } from '../../utils';
import MyInput from '../../components/MyInput';
import MyHeader from '../../components/MyHeader';
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { MyButton, MyCalendar, MyGap } from '../../components';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import { useEffect } from 'react';

export default function ProfileSiKecil({ navigation, route }) {
  const [form, setForm] = useState(route.params);

  const [umur, setUmur] = useState('');

  const getUmurDalamBulan = (val) => {
    const lahir = moment(val);
    const sekarang = moment();

    const bulan = sekarang.diff(lahir, 'months');
    const tanggalSetelahBulan = lahir.clone().add(bulan, 'months');
    const hari = sekarang.diff(tanggalSetelahBulan, 'days');

    return `${bulan} bulan ${hari} hari`;
  }

  const [user, setUser] = useState({});

  useEffect(() => {
    getData('user').then(res => {
      setUser(res);
      setForm({
        ...form,
        fid_pengguna: res.id_pengguna,
        newfoto_anak: null,
      })
    })
  }, []);

  const HapusAnak = () => {
    Alert.alert(MYAPP, 'Apakah kamu yakin akan hapus ini ?', [
      { text: 'Tidak' },
      {
        text: 'HAPUS',
        onPress: () => {
          console.log(form.id_anak);
          axios.post(apiURL + 'hapus_anak', {
            id_anak: form.id_anak
          }).then(res => {
            if (res.data.status == 200) {
              showMessage({
                type: 'success',
                message: res.data.message
              });
              navigation.goBack();
            }
          })
        }
      }
    ])
  }



  const simpanData = () => {

    if (form.nama_anak.length == 0) {
      showMessage({ message: 'Nama lengkap wajib diisi !' })
    } else if (form.prematur.length == 0) {
      showMessage({ message: 'pilih pematur !' })
    }
    else if (form.berat.length == 0) {
      showMessage({ message: 'Berat badan wajib diisi !' })
    } else if (form.tinggi.length == 0) {
      showMessage({ message: 'Tinggi badan wajib diisi !' })
    } else if (form.kepala.length == 0) {
      showMessage({ message: 'Lingkar kepala wajib diisi !' })
    } else if (form.lengan.length == 0) {
      showMessage({ message: 'Lingkar lengan wajib diisi !' })
    } else {
      console.log(form);
      axios.post(apiURL + 'update_anak', form).then(res => {
        console.log(res.data);
        if (res.data.status == 200) {
          showMessage({
            type: 'success',
            message: res.data.message
          });
          navigation.goBack();
        }
      })

    }


  }

  const pilihFoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5, includeBase64: true }, res => {
      if (!res.didCancel && res.assets) {
        setForm({ ...form, newfoto_anak: `data:${res.assets[0].type};base64,${res.assets[0].base64}` });
      }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <MyHeader title="Profil Si Kecil" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.imageUpload} onPress={pilihFoto}>

            <Image source={{ uri: form.newfoto_anak !== null ? form.newfoto_anak : form.foto_anak }} style={styles.fotoAnak} />


          </TouchableOpacity>

          <MyInput
            label="Nama Lengkap"
            placeholder="Nama Lengkap"
            value={form.nama_anak}
            onChangeText={(val) => setForm({ ...form, nama_anak: val })}
          />

          <Text style={styles.label}>Jenis Kelamin</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.radio, { marginRight: 20 }]}
              onPress={() => setForm({ ...form, jenis_kelamin: 'Perempuan' })}>
              <View
                style={[
                  styles.radioOuter,
                  form.jenis_kelamin === 'Perempuan' && styles.radioActive,
                ]}
              />
              <Text style={styles.radioLabel}>Perempuan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radio}
              onPress={() => setForm({ ...form, jenis_kelamin: 'Laki-Laki' })}>
              <View
                style={[
                  styles.radioOuter,
                  form.jenis_kelamin === 'Laki-Laki' && styles.radioActive,
                ]}
              />
              <Text style={styles.radioLabel}>Laki-Laki</Text>
            </TouchableOpacity>
          </View>

          <MyCalendar
            label={`Tanggal Lahir ${umur.length == 0 ? '' : '( ' + umur + ' )'} `}
            value={form.tanggal_lahir}
            onDateChange={(val) => {
              setForm({ ...form, tanggal_lahir: val });
              let umr = getUmurDalamBulan(val);
              console.log(umr);
              setUmur(umr);
            }}
          />


          <Text style={styles.label}>Apakah Si Kecil lahir prematur?</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.radio, { marginRight: 20 }]}
              onPress={() => setForm({ ...form, prematur: 'Ya' })}>
              <View
                style={[
                  styles.radioOuter,
                  form.prematur === 'Ya' && styles.radioActive,
                ]}
              />
              <Text style={styles.radioLabel}>Ya</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radio}
              onPress={() => setForm({ ...form, prematur: 'Tidak' })}>
              <View
                style={[
                  styles.radioOuter,
                  form.prematur === 'Tidak' && styles.radioActive,
                ]}
              />
              <Text style={styles.radioLabel}>Tidak</Text>
            </TouchableOpacity>
          </View>

          <MyInput
            label="Berat Badan saat ini/terakhir (kg)"
            placeholder="Berat Badan saat ini/terakhir (kg)"
            value={form.berat}
            onChangeText={(val) => setForm({ ...form, berat: val })}
            keyboardType="numeric"
          />

          <MyInput
            label="Tinggi Badan saat ini/terakhir (cm)"
            placeholder="Tinggi Badan saat ini/terakhir (cm)"
            value={form.tinggi}
            onChangeText={(val) => setForm({ ...form, tinggi: val })}
            keyboardType="numeric"
          />

          <MyInput
            label="Lingkar Kepala saat ini/terakhir (cm)"
            placeholder="Lingkar Kepala saat ini/terakhir (cm)"
            value={form.kepala}
            onChangeText={(val) => setForm({ ...form, kepala: val })}
            keyboardType="numeric"
          />

          <MyInput
            label="Lingkar Lengan Atas saat ini/terakhir (cm)"
            placeholder="Lingkar Lengan Atas saat ini/terakhir (cm)"
            value={form.lengan}
            onChangeText={(val) => setForm({ ...form, lengan: val })}
            keyboardType="numeric"
          />

          <TouchableOpacity
            onPress={simpanData}

            style={[
              styles.btnSimpan,
              {
                backgroundColor: '#9C42C4'
              },
            ]}>
            <Text style={styles.btnText}>Simpan Perubahan</Text>
          </TouchableOpacity>
          <MyGap jarak={10} />
          <MyButton onPress={HapusAnak} title="Hapus Si Kecil" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: '#EADCF1',
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    elevation: 4,
  },
  imageUpload: {
    width: '100%',
    // height: 180,
    height: windowWidth / 1.2,
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },
  fotoAnak: {
    width: windowWidth / 1.2,
    height: windowWidth / 1.2,
    resizeMode: 'cover',
  },
  plusBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  label: {
    fontFamily: fonts.primary[600],
    fontSize: 14,
    color: '#2D2D2D',
    marginBottom: 8,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#2D2D2D',
    marginRight: 8,
  },
  radioActive: {
    backgroundColor: '#2D2D2D',
  },
  radioLabel: {
    fontFamily: fonts.primary[400],
    fontSize: 14,
    color: '#2D2D2D',
  },
  btnSimpan: {
    padding: 14,
    borderRadius: 50,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },
  btnText: {
    fontFamily: fonts.primary[700],
    fontSize: 14,
    color: 'white',
  },
});
