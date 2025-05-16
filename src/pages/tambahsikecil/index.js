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
import { colors, fonts } from '../../utils';
import MyInput from '../../components/MyInput';
import MyHeader from '../../components/MyHeader';
import { getData, storeData } from '../../utils/localStorage';
import { MyCalendar } from '../../components';
import moment from 'moment';

export default function TambahSiKecil({ navigation }) {
  const [form, setForm] = useState({
    nama: '',
    jenis_kelamin: '',
  tanggal_lahir: moment().format('YYYY-MM-DD'), // default ke hari ini
    prematur: '',
    bb: '',
    tb: '',
    lk: '',
    lla: '',
    foto: null,
  });

  const isFormValid = () =>
    form.nama &&
    form.jenis_kelamin &&
    form.tanggal_lahir &&
    form.prematur &&
    form.bb &&
    form.tb &&
    form.lk &&
    form.lla;

 const simpanData = async () => {
  if (!isFormValid()) {
    Alert.alert('Oops', 'Semua field wajib diisi!');
    return;
  }

const dataAnakBaru = {
  ...form,
  id: Date.now(), // ID unik dalam bentuk number
  usia: '00 thn / 00 bln / 00 hr',
  tanggal_daftar: moment().format('YYYY-MM-DD'),
};


  const dataLama = await getData('anak');
  if (dataLama) {
    storeData('anak', [...dataLama, dataAnakBaru]);
  } else {
    storeData('anak', [dataAnakBaru]);
  }

  navigation.replace("MainApp");
};


  const pilihFoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, res => {
      if (!res.didCancel && res.assets) {
        setForm({ ...form, foto: res.assets[0] });
      }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <MyHeader title="Tambah Profil Si Kecil" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.imageUpload} onPress={pilihFoto}>
            {form.foto ? (
              <Image source={{ uri: form.foto.uri }} style={styles.fotoAnak} />
            ) : (
              <View style={styles.plusBox}>
                <Text style={{ fontSize: 24, color: '#999' }}>+</Text>
              </View>
            )}
          </TouchableOpacity>

          <MyInput
            label="Nama Lengkap"
            placeholder="Nama Lengkap"
            value={form.nama}
            onChangeText={(val) => setForm({ ...form, nama: val })}
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
  label="Tanggal Lahir"
  value={form.tanggal_lahir}
  onDateChange={(val) => setForm({ ...form, tanggal_lahir: val })}
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
            value={form.bb}
            onChangeText={(val) => setForm({ ...form, bb: val })}
            keyboardType="numeric"
          />

          <MyInput
            label="Tinggi Badan saat ini/terakhir (cm)"
            placeholder="Tinggi Badan saat ini/terakhir (cm)"
            value={form.tb}
            onChangeText={(val) => setForm({ ...form, tb: val })}
            keyboardType="numeric"
          />

          <MyInput
            label="Lingkar Kepala saat ini/terakhir (cm)"
            placeholder="Lingkar Kepala saat ini/terakhir (cm)"
            value={form.lk}
            onChangeText={(val) => setForm({ ...form, lk: val })}
            keyboardType="numeric"
          />

          <MyInput
            label="Lingkar Lengan Atas saat ini/terakhir (cm)"
            placeholder="Lingkar Lengan Atas saat ini/terakhir (cm)"
            value={form.lla}
            onChangeText={(val) => setForm({ ...form, lla: val })}
            keyboardType="numeric"
          />

          <TouchableOpacity
            onPress={simpanData}
            disabled={!isFormValid()}
            style={[
              styles.btnSimpan,
              {
                backgroundColor: isFormValid() ? '#9C42C4' : '#D1D1D1',
              },
            ]}>
            <Text style={styles.btnText}>Simpan</Text>
          </TouchableOpacity>
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
    height: 180,
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },
  fotoAnak: {
    width: '100%',
    height: '100%',
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
