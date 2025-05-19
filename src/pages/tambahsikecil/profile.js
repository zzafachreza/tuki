import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, fonts } from '../../utils';
import { MyHeader, MyCalendar } from '../../components';
import { getData, storeData } from '../../utils/localStorage';
import moment from 'moment';
import { Icon } from 'react-native-elements';

export default function ProfileSiKecil({ navigation, route }) {
  const [anak, setAnak] = useState(null);
  const [index, setIndex] = useState(0);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    getData('anak').then(res => {
      if (res) {
        const idx = route?.params?.index ?? 0;
        const selectedAnak = res[idx];

        setAnak(selectedAnak);
        setForm(selectedAnak);
        setIndex(idx);
      }
    });
  }, []);

  const hapusProfil = () => {
    Alert.alert('Konfirmasi', 'Yakin ingin menghapus profil ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        onPress: async () => {
          const data = await getData('anak');
          const updated = data.filter((_, i) => i !== index);
          await storeData('anak', updated);
          navigation.replace('MainApp');
        },
        style: 'destructive',
      },
    ]);
  };

  const simpanPerubahan = async () => {
    const now = moment();
    let birthDate = moment(form.tanggal_lahir);

    if (form.prematur === 'Ya' && form.minggu_kelahiran) {
      const koreksiHari = (40 - parseInt(form.minggu_kelahiran)) * 7;
      birthDate = birthDate.add(koreksiHari, 'days');
    }

    const usia = moment.duration(now.diff(birthDate));
const years = now.diff(birthDate, 'years');
const months = now.diff(birthDate.clone().add(years, 'years'), 'months');
const days = now.diff(birthDate.clone().add(years, 'years').add(months, 'months'), 'days');
    const usiaFormatted = `${years.toString().padStart(2, '0')} thn / ${months.toString().padStart(2, '0')} bln / ${days.toString().padStart(2, '0')} hr`;

    const updatedForm = {
      ...form,
      tanggal_update: moment().format('YYYY-MM-DD'),
      usia: usiaFormatted,
    };

    const data = await getData('anak');
    const updated = [...data];
    updated[index] = updatedForm;
    await storeData('anak', updated);
    setAnak(updatedForm);
    setEdit(false);
  };

  if (!anak) return null;

  const iconGender = anak.jenis_kelamin === 'Laki-Laki' ? 'male-sharp' : 'female-sharp';
  const colorGender = anak.jenis_kelamin === 'Laki-Laki' ? '#4287f5' : '#DA506F';

  const getUsia = () => {
    let birthDate = moment(anak.tanggal_lahir);
    const now = moment();
    if (anak.prematur === 'Ya' && anak.minggu_kelahiran) {
      const koreksiHari = (40 - parseInt(anak.minggu_kelahiran)) * 7;
      birthDate = birthDate.add(koreksiHari, 'days');
    }
    const usia = moment.duration(now.diff(birthDate));
   const years = now.diff(birthDate, 'years');
const months = now.diff(birthDate.clone().add(years, 'years'), 'months');
const days = now.diff(birthDate.clone().add(years, 'years').add(months, 'months'), 'days');
return `${years.toString().padStart(2, '0')} thn / ${months.toString().padStart(2, '0')} bln / ${days.toString().padStart(2, '0')} hr`;

  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <MyHeader title={edit ? 'Edit Profil Si Kecil' : 'Profil Si Kecil'} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity style={styles.imageBox}>
          <Image
            source={anak?.foto ? { uri: anak.foto.uri } : require('../../assets/anak.png')}
            style={styles.image}
          />
        </TouchableOpacity>

        {edit ? (
          <View style={styles.editCard}>
            <TextInput value={form.nama} onChangeText={(val) => setForm({ ...form, nama: val })} placeholder="Nama Lengkap" style={styles.input} />

            <Text style={styles.label}>Jenis Kelamin</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity onPress={() => setForm({ ...form, jenis_kelamin: 'Perempuan' })} style={styles.radioOption}>
                <View style={[styles.radioCircle, form.jenis_kelamin === 'Perempuan' && styles.radioSelected]} />
                <Text style={styles.radioLabel}>Perempuan</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setForm({ ...form, jenis_kelamin: 'Laki-Laki' })} style={styles.radioOption}>
                <View style={[styles.radioCircle, form.jenis_kelamin === 'Laki-Laki' && styles.radioSelected]} />
                <Text style={styles.radioLabel}>Laki–Laki</Text>
              </TouchableOpacity>
            </View>

            <MyCalendar
              label="Tanggal Lahir"
              value={form.tanggal_lahir}
              onDateChange={(val) => setForm({ ...form, tanggal_lahir: val })}
            />

            <Text style={styles.label}>Apakah Si Kecil lahir prematur?</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity onPress={() => setForm({ ...form, prematur: 'Ya' })} style={styles.radioOption}>
                <View style={[styles.radioCircle, form.prematur === 'Ya' && styles.radioSelected]} />
                <Text style={styles.radioLabel}>Ya</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setForm({ ...form, prematur: 'Tidak' })} style={styles.radioOption}>
                <View style={[styles.radioCircle, form.prematur === 'Tidak' && styles.radioSelected]} />
                <Text style={styles.radioLabel}>Tidak</Text>
              </TouchableOpacity>
            </View>

            <TextInput placeholder="Berat Badan saat ini/terakhir (kg)" keyboardType="numeric" value={form.bb} onChangeText={(val) => setForm({ ...form, bb: val })} style={styles.input} />
            <TextInput placeholder="Tinggi Badan saat ini/terakhir (cm)" keyboardType="numeric" value={form.tb} onChangeText={(val) => setForm({ ...form, tb: val })} style={styles.input} />
            <TextInput placeholder="Lingkar Kepala saat ini/terakhir (cm)" keyboardType="numeric" value={form.lk} onChangeText={(val) => setForm({ ...form, lk: val })} style={styles.input} />
            <TextInput placeholder="Lingkar Lengan Atas saat ini/terakhir (cm)" keyboardType="numeric" value={form.lla} onChangeText={(val) => setForm({ ...form, lla: val })} style={styles.input} />

            <TouchableOpacity style={styles.saveBtn} onPress={simpanPerubahan}>
              <Text style={styles.saveText}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEdit(false)} style={{ marginTop: 10 }}>
              <Text style={{ textAlign: 'center', fontFamily: fonts.primary[600], color: '#555' }}>Kembali</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.infoBox}>
              <Icon type="ionicon" name={iconGender} size={20} color={colorGender} style={{ marginRight: 10 }} />
              <Text style={styles.genderText}>{anak.nama}</Text>
            </View>

            <View style={styles.birthBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon type="ionicon" name="calendar-sharp" size={20} />
                <Text style={styles.birthText}>{moment(anak.tanggal_lahir).format('DD/MM/YYYY')}</Text>
              </View>
              <Text style={styles.ageText}>{getUsia()}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.label}>Status Pertumbuhan</Text>
              <TouchableOpacity onPress={() => setEdit(true)}>
                <Icon type="ionicon" name="create-outline" size={20} color={'#999'} />
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>Terakhir diupdate {anak.tanggal_update || anak.tanggal_daftar}</Text>

            <View style={styles.growthItem}><Text style={styles.itemLabel}>Berat Badan</Text><Text style={styles.itemValue}>{anak.bb} kg</Text></View>
            <View style={styles.growthItem}><Text style={styles.itemLabel}>Panjang Badan</Text><Text style={styles.itemValue}>{anak.tb} cm</Text></View>
            <View style={styles.growthItem}><Text style={styles.itemLabel}>LiLA</Text><Text style={styles.itemValue}>{anak.lla} cm</Text></View>
            <View style={styles.growthItem}><Text style={styles.itemLabel}>Lingkar Kepala</Text><Text style={styles.itemValue}>{anak.lk} cm</Text></View>

            <TouchableOpacity onPress={hapusProfil} style={{ marginTop: 20 }}>
              <Text style={{ color: 'red', textAlign: 'center', fontFamily: fonts.primary[600] }}>Hapus Profil</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  imageBox: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  input: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    fontFamily: fonts.primary[400]
  },
  editCard: {
    backgroundColor: '#EADCF1',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: '#333'
  },
  radioLabel: {
    fontFamily: fonts.primary[400],
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#999',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center'
  },
  saveText: {
    fontFamily: fonts.primary[700],
    color: 'white'
  },
  infoBox: {
    backgroundColor: '#EADCF1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  genderText: {
    fontFamily: fonts.primary[700],
    fontSize: 16,
  },
  birthBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  birthText: {
    fontFamily: fonts.primary[400],
    fontSize: 14,
    marginHorizontal: 10,
    top: 2
  },
  ageText: {
    fontFamily: fonts.primary[600],
    fontSize: 14,
    top: 2
  },
  label: {
    fontFamily: fonts.primary[700],
    fontSize: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    marginBottom: 12,
    color: '#777'
  },
  growthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  itemLabel: {
    fontFamily: fonts.primary[400],
    fontSize: 14,
  },
  itemValue: {
    fontFamily: fonts.primary[600],
    fontSize: 14,
  },
});
