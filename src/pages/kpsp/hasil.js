import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors, fonts } from '../../utils';
import { storeData, pushNotif } from '../../utils/localStorage';
import moment from 'moment';

export default function HasilKPSP({ route, navigation }) {
  const { statusKPSP, dataAnak, jawaban } = route.params;

  const simpanHasilKeStorage = async () => {
    const hasil = {
      status: statusKPSP,
      tanggal: moment().format('YYYY-MM-DD HH:mm'),
      jawaban: jawaban,
    };

    await storeData(`kpsp_${dataAnak.id}`, hasil);

    // Notifikasi 1: Terima kasih
    await pushNotif({
  title: 'KPSP sudah terisi',
  message: 'Terimakasih parents sudah menyediakan waktunya untuk melakukan skrining dengan KPSP',
  
});

await pushNotif({
  title: `Hasil KPSP: ${dataAnak.nama}`,
  message: `${dataAnak.nama}, hasil KPSP: ${statusKPSP}`,
});
  };

  const renderContent = () => {
    switch (statusKPSP) {
      case 'Sesuai Umur':
        return {
          backgroundColor: '#37BEB0',
          title: `${dataAnak.nama}, Sesuai Umur`,
          saran: [
            'Melanjutkan memberikan si kecil stimulasi perkembangan sesuai umur',
            'Ikutkan si kecil teratur 1x/bulan kegiatan penimbangan dan pelayanan kesehatan di posyandu dan setiap ada kegiatan Bina Keluarga Balita (BKB)',
            'Lanjutkan pemantauan secara rutin dengan menggunakan buku KIA',
            'Setiap 3 bulan, lakukan skrining rutin menggunakan KPSP'
          ]
        };
      case 'Meragukan':
        return {
          backgroundColor: '#FFB534',
          title: `${dataAnak.nama}, Meragukan`,
          saran: [
            'Lakukan stimulasi setiap saat dan sesering mungkin pada si kecil',
            'Lakukan skrining KPSP 2 minggu kemudian, bila hasil tetap meragukan atau ada kemungkinan penyimpangan, rujuk ke rumah sakit tumbuh kembang level 1',
            'Lakukan pemeriksaan kesehatan untuk mencari kemungkinan adanya penyakit yang menyebabkan penyimpangan perkembangannya dan lakukan pengobatan'
          ]
        };
      case 'Ada Kemungkinan Penyimpangan':
        return {
          backgroundColor: '#F05945',
          title: `${dataAnak.nama}, Ada Kemungkinan Penyimpangan`,
          saran: ['Rujuk ke Rumah Sakit Tumbuh Kembang Level 1']
        };
      default:
        return {
          backgroundColor: '#ccc',
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
            navigation.replace('MainApp', {
              showKpspThanks: true,
            });
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
