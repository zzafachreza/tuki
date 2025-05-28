import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors, fonts } from '../../utils';
import { storeData, pushNotif, apiURL } from '../../utils/localStorage';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';

import { showMessage } from 'react-native-flash-message';
import axios from 'axios';

export default function HasilKPSP({ route, navigation }) {
  const ITEM = route.params.anak;
  const NILAI = route.params.hasil;

  const simpanHasilKeStorage = async () => {
    const kirim = {
      nilai: NILAI,
      fid_anak: ITEM.id_anak,
      hasil: renderContent().hasil,
      warna: renderContent().backgroundColor,
      saran: renderContent().saran.length == 1 ? renderContent().saran.join() : renderContent().saran.map((item, index) => `${index + 1}. ${item}`).join("\n\n")
    };

    console.log(kirim);

    // Notifikasi 1: Terima kasih
    await pushNotif({
      title: 'KPSP sudah terisi',
      message: 'Terimakasih parents sudah menyediakan waktunya untuk melakukan skrining dengan KPSP',

    });

    await pushNotif({
      title: `Hasil KPSP: ${ITEM.nama_anak}`,
      message: `${ITEM.nama_anak}, hasil KPSP: ${renderContent().hasil}`,
    });

    axios.post(apiURL + 'add_nilai', kirim).then(res => {
      console.log(res.data);
      if (res.data.status == 200) {
        showMessage({
          type: 'success',
          message: res.data.message
        });
        storeData('kpsp', 1);
        navigation.replace('MainApp')
      }
    })



  };

  const renderContent = () => {
    switch (NILAI) {
      case 3:
        return {
          backgroundColor: '#37BEB0',
          hasil: 'Sesuai Umur',
          title: `${ITEM.nama_anak}, Sesuai Umur`,
          saran: [
            'Melanjutkan memberikan si kecil stimulasi perkembangan sesuai umur',
            'Ikutkan si kecil teratur 1x/bulan kegiatan penimbangan dan pelayanan kesehatan di posyandu dan setiap ada kegiatan Bina Keluarga Balita (BKB)',
            'Lanjutkan pemantauan secara rutin dengan menggunakan buku KIA',
            'Setiap 3 bulan, lakukan skrining rutin menggunakan KPSP'
          ]
        };
      case 2:
        return {
          backgroundColor: '#FFB534',
          hasil: 'Meragukan',
          title: `${ITEM.nama_anak}, Meragukan`,
          saran: [
            'Lakukan stimulasi setiap saat dan sesering mungkin pada si kecil',
            'Lakukan skrining KPSP 2 minggu kemudian, bila hasil tetap meragukan atau ada kemungkinan penyimpangan, rujuk ke rumah sakit tumbuh kembang level 1',
            'Lakukan pemeriksaan kesehatan untuk mencari kemungkinan adanya penyakit yang menyebabkan penyimpangan perkembangannya dan lakukan pengobatan'
          ]
        };
      case 1:
        return {
          backgroundColor: '#F05945',
          hasil: 'Ada Kemungkinan Penyimpangan',
          title: `${ITEM.nama_anak}, Ada Kemungkinan Penyimpangan`,
          saran: ['Rujuk ke Rumah Sakit Tumbuh Kembang Level 1']
        };
      default:
        return {
          backgroundColor: '#BA68C8',
          title: 'Belum Diisi',
          saran: ['Silakan isi semua pertanyaan terlebih dahulu']
        };
    }
  };

  const { backgroundColor, title, saran } = renderContent();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.card}>
          <Text style={styles.label}>Hasil</Text>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Apa yang dilakukan selanjutnya ?</Text>
          {saran.map((item, index) => (
            <Text key={index} style={styles.list}>
              {`${index + 1}. ${item}`}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          onPress={async () => {
            await simpanHasilKeStorage();

          }}
          style={styles.btnSimpan}
        >
          <Text style={styles.textBtn}>Selesai</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 4
  },
  label: {
    fontFamily: fonts.primary[700],
    fontSize: 16,
    color: '#333',
    marginBottom: 10
  },
  title: {
    fontFamily: fonts.primary[600],
    fontSize: 18,
    color: '#444'
  },
  list: {
    fontFamily: fonts.primary[400],
    fontSize: 14,
    marginBottom: 10,
    color: '#444'
  },
  btnSimpan: {
    backgroundColor: '#D2A4DC',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center'
  },
  textBtn: {
    fontFamily: fonts.primary[700],
    color: '#fff',
    fontSize: 16
  }
});
