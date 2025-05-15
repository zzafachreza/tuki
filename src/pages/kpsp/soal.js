import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { colors, fonts } from '../../utils';
import { MyHeader } from '../../components';
import { Icon } from 'react-native-elements';

export default function SoalKPSP({ navigation, route }) {
  const { dataAnak, usia_bulan } = route.params;
  const soalKPSP12Bulan = [
    {
      kategori: 'Gerak Halus',
      pertanyaan: 'Bayi dipangku orang tua atau pengasuh. Letakkan pensil di telapak tangan anak. Coba ambil pensil tersebut dengan perlahan-lahan. Apakah anak menggenggam pensil dengan erat dan Anda merasa kesulitan mendapatkan pensil itu kembali?'
    },
    {
      kategori: 'Gerak Halus',
      pertanyaan: 'Bayi dipangku orang tua atau pengasuh. Letakkan kismis di atas meja. Dapatkah anak memungut dengan tangannya benda−benda kecil seperti kismis, kacang−kacangan, potongan biskuit dengan gerakan miring atau menggerapai seperti gambar?'
    },
    {
      kategori: 'Gerak Halus',
      pertanyaan: 'Bayi dipangku orang tua atau pengasuh. Berikan 2 kubus kepada bayi. Tanpa bantuan, apakah anak dapat mempertemukan 2 kubus kecil yang ia pegang?'
    },
    {
      kategori: 'Bicara dan Bahasa',
      pertanyaan: 'Sebut 2−3 kata yang dapat ditiru oleh anak (tidak perlu kata−kata yang lengkap). Apakah ia mencoba meniru kata-kata tadi?'
    },
    {
      kategori: 'Gerak Kasar',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat mengangkat badannya ke posisi berdiri tanpa bantuan?'
    },
    {
      kategori: 'Gerak Kasar',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat duduk sendiri tanpa bantuan dari posisi tidur atau tengkurap?'
    },
    {
      kategori: 'Sosialisasi dan Kemandirian',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat memahami makna kata ’jangan’?'
    },
    {
      kategori: 'Sosialisasi dan Kemandirian',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak akan mencari atau terlihat mengharapkan muncul kembali jika ibu atau pengasuh bersembunyi di belakang sesuatu atau di pojok, kemudian muncul dan menghilang secara berulang-ulang di hadapan anak?'
    },
    {
      kategori: 'Sosialisasi dan Kemandirian',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat membedakan ibu atau pengasuh dengan orang yang belum ia kenal? Ia akan menunjukkan sikap malu-malu atau ragu-ragu pada saat permulaan bertemu dengan orang yang belum dikenalnya.'
    },
    {
      kategori: 'Gerak Kasar',
      pertanyaan: 'Berdirikan anak. Apakah anak dapat berdiri dengan berpegangan pada kursi atau meja selama 30 detik atau lebih?'
    }
  ];

  const [nomorAktif, setNomorAktif] = useState(0);
  const [jawaban, setJawaban] = useState(Array(10).fill(null));
  const soalAktif = soalKPSP12Bulan[nomorAktif];

  const pilihJawaban = (value) => {
    const updated = [...jawaban];
    updated[nomorAktif] = value;
    setJawaban(updated);
    if (nomorAktif < 9) {
      setNomorAktif(nomorAktif + 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <MyHeader title='Kembali' />
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <Text style={styles.title}>KPSP ({usia_bulan} Bulan)</Text>
        </View>

        <View style={styles.cardBox}>
          <View style={styles.cardHeader}>
            <Text style={styles.nomor}>{nomorAktif + 1}/10</Text>
            <Icon name='arrow-forward' type='ionicon' color={colors.black} size={20} />
          </View>

          <Text style={styles.kategori}>[{soalAktif.kategori}]</Text>
          <Text style={styles.pertanyaan}>{soalAktif.pertanyaan}</Text>

          <View style={styles.opsiBox}>
            <TouchableOpacity style={styles.buttonYa} onPress={() => pilihJawaban('ya')}><Text style={styles.buttonText}>Ya</Text></TouchableOpacity>
            <TouchableOpacity style={styles.buttonTidak} onPress={() => pilihJawaban('tidak')}><Text style={styles.buttonText}>Tidak</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.gridBox}>
          {[...Array(10).keys()].map((i) => (
            <View key={i} style={[styles.gridButton, i === nomorAktif && styles.activeButton]}>
              <Text style={styles.gridText}>{i + 1}</Text>
            </View>
          ))}
          <TouchableOpacity style={[styles.gridButton, styles.simpanButton]}>
            <Text style={styles.gridText}>simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  headerBox: {
    backgroundColor: '#EADCF1',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 20
  },
  title: {
    fontFamily: fonts.primary[700],
    fontSize: 18
  },
  cardBox: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 20
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  nomor: {
    fontFamily: fonts.primary[700],
    fontSize: 16
  },
  kategori: {
    fontFamily: fonts.primary[600],
    fontSize: 14,
    marginBottom: 10
  },
  pertanyaan: {
    fontFamily: fonts.primary[400],
    fontSize: 14,
    marginBottom: 20
  },
  opsiBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  buttonYa: {
    backgroundColor: '#EADCF1',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999'
  },
  buttonTidak: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999'
  },
  buttonText: {
    fontFamily: fonts.primary[700],
    fontSize: 14,
    color: colors.black
  },
  gridBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  gridButton: {
    width: '22%',
    backgroundColor: '#D9D9D9',
    paddingVertical: 10,
    marginVertical: 6,
    borderRadius: 10,
    alignItems: 'center'
  },
  gridText: {
    fontFamily: fonts.primary[600],
    fontSize: 14
  },
  activeButton: {
    backgroundColor: '#EADCF1'
  },
  simpanButton: {
    width: '48%'
  }
});
