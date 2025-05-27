import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { colors, fonts, windowWidth } from '../../utils';
import { MyHeader } from '../../components';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import RenderHtml from 'react-native-render-html';
import { apiURL } from '../../utils/localStorage';
import axios from 'axios';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { showMessage } from 'react-native-flash-message';
export default function SoalKPSP({ navigation, route }) {
  const systemFonts = [fonts.body3.fontFamily, fonts.headline4.fontFamily];
  const ITEM = route.params;
  const soalKPSP12Bulan = [
    {
      nomor: 1,
      jawaban: '',
      kategori: 'Gerak Halus',
      pertanyaan: 'Bayi dipangku orang tua atau pengasuh. Letakkan pensil di telapak tangan anak. Coba ambil pensil tersebut dengan perlahan-lahan. Apakah anak menggenggam pensil dengan erat dan Anda merasa kesulitan mendapatkan pensil itu kembali?'
    },
    {
      nomor: 2,
      jawaban: '',
      kategori: 'Gerak Halus',
      pertanyaan: 'Bayi dipangku orang tua atau pengasuh. Letakkan kismis di atas meja. Dapatkah anak memungut dengan tangannya benda−benda kecil seperti kismis, kacang−kacangan, potongan biskuit dengan gerakan miring atau menggerapai seperti gambar?'
    },
    {
      nomor: 3,
      jawaban: '',
      kategori: 'Gerak Halus',
      pertanyaan: 'Bayi dipangku orang tua atau pengasuh. Berikan 2 kubus kepada bayi. Tanpa bantuan, apakah anak dapat mempertemukan 2 kubus kecil yang ia pegang?'
    },
    {
      nomor: 4,
      jawaban: '',
      kategori: 'Bicara dan Bahasa',
      pertanyaan: 'Sebut 2−3 kata yang dapat ditiru oleh anak (tidak perlu kata−kata yang lengkap). Apakah ia mencoba meniru kata-kata tadi?'
    },
    {
      nomor: 5,
      jawaban: '',
      kategori: 'Gerak Kasar',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat mengangkat badannya ke posisi berdiri tanpa bantuan?'
    },
    {
      nomor: 6,
      jawaban: '',
      kategori: 'Gerak Kasar',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat duduk sendiri tanpa bantuan dari posisi tidur atau tengkurap?'
    },
    {
      nomor: 7,
      jawaban: '',
      kategori: 'Sosialisasi dan Kemandirian',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat memahami makna kata ’jangan’?'
    },
    {
      nomor: 8,
      jawaban: '',
      kategori: 'Sosialisasi dan Kemandirian',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak akan mencari atau terlihat mengharapkan muncul kembali jika ibu atau pengasuh bersembunyi di belakang sesuatu atau di pojok, kemudian muncul dan menghilang secara berulang-ulang di hadapan anak?'
    },
    {
      nomor: 9,
      jawaban: '',
      kategori: 'Sosialisasi dan Kemandirian',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat membedakan ibu atau pengasuh dengan orang yang belum ia kenal? Ia akan menunjukkan sikap malu-malu atau ragu-ragu pada saat permulaan bertemu dengan orang yang belum dikenalnya.'
    },
    {
      nomor: 10,
      jawaban: '',
      kategori: 'Gerak Kasar',
      pertanyaan: 'Berdirikan anak. Apakah anak dapat berdiri dengan berpegangan pada kursi atau meja selama 30 detik atau lebih?'
    }
  ];

  const [soal, setSoal] = useState([
    {
      nomor: 1,
      jawaban: '',
      kategori: 'Gerak Halus',
      pertanyaan: 'Bayi dipangku orang tua atau pengasuh. Letakkan pensil di telapak tangan anak. Coba ambil pensil tersebut dengan perlahan-lahan. Apakah anak menggenggam pensil dengan erat dan Anda merasa kesulitan mendapatkan pensil itu kembali?'
    },
    {
      nomor: 2,
      jawaban: '',
      kategori: 'Gerak Halus',
      pertanyaan: 'Bayi dipangku orang tua atau pengasuh. Letakkan kismis di atas meja. Dapatkah anak memungut dengan tangannya benda−benda kecil seperti kismis, kacang−kacangan, potongan biskuit dengan gerakan miring atau menggerapai seperti gambar?'
    },
    {
      nomor: 3,
      jawaban: '',
      kategori: 'Gerak Halus',
      pertanyaan: 'Bayi dipangku orang tua atau pengasuh. Berikan 2 kubus kepada bayi. Tanpa bantuan, apakah anak dapat mempertemukan 2 kubus kecil yang ia pegang?'
    },
    {
      nomor: 4,
      jawaban: '',
      kategori: 'Bicara dan Bahasa',
      pertanyaan: 'Sebut 2−3 kata yang dapat ditiru oleh anak (tidak perlu kata−kata yang lengkap). Apakah ia mencoba meniru kata-kata tadi?'
    },
    {
      nomor: 5,
      jawaban: '',
      kategori: 'Gerak Kasar',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat mengangkat badannya ke posisi berdiri tanpa bantuan?'
    },
    {
      nomor: 6,
      jawaban: '',
      kategori: 'Gerak Kasar',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat duduk sendiri tanpa bantuan dari posisi tidur atau tengkurap?'
    },
    {
      nomor: 7,
      jawaban: '',
      kategori: 'Sosialisasi dan Kemandirian',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat memahami makna kata ’jangan’?'
    },
    {
      nomor: 8,
      jawaban: '',
      kategori: 'Sosialisasi dan Kemandirian',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak akan mencari atau terlihat mengharapkan muncul kembali jika ibu atau pengasuh bersembunyi di belakang sesuatu atau di pojok, kemudian muncul dan menghilang secara berulang-ulang di hadapan anak?'
    },
    {
      nomor: 9,
      jawaban: '',
      kategori: 'Sosialisasi dan Kemandirian',
      pertanyaan: 'Tanyakan kepada ibu atau pengasuh, apakah anak dapat membedakan ibu atau pengasuh dengan orang yang belum ia kenal? Ia akan menunjukkan sikap malu-malu atau ragu-ragu pada saat permulaan bertemu dengan orang yang belum dikenalnya.'
    },
    {
      nomor: 10,
      jawaban: '',
      kategori: 'Gerak Kasar',
      pertanyaan: 'Berdirikan anak. Apakah anak dapat berdiri dengan berpegangan pada kursi atau meja selama 30 detik atau lebih?'
    }
  ])

  const [nomorAktif, setNomorAktif] = useState(0);
  const [jawaban, setJawaban] = useState(Array(10).fill(null));
  const soalAktif = soal[nomorAktif];

  const pilihJawaban = (value) => {
    const updated = [...jawaban];
    updated[nomorAktif] = value;
    setJawaban(updated);
    if (nomorAktif < 9) {
      setNomorAktif(nomorAktif + 1);
    }
  };

  const BULAN_TERSEDIA = [3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60, 66, 72];

  const getUmurBayi = (tanggalLahir) => {
    const lahir = moment(tanggalLahir);
    const sekarang = moment();

    const bulan = sekarang.diff(lahir, 'months');
    const tanggalSetelahBulan = lahir.clone().add(bulan, 'months');
    const hari = sekarang.diff(tanggalSetelahBulan, 'days');

    // ✅ Cari nilai terdekat dari bulan
    const bulanTerdekat = BULAN_TERSEDIA.reduce((prev, curr) =>
      Math.abs(curr - bulan) < Math.abs(prev - bulan) ? curr : prev
    );

    // Kamu bisa update state di luar fungsi:
    // setUMUR(bulanTerdekat);

    return {
      teks: `${bulan} bulan ${hari} hari`,
      bulan: bulan,
      hari: hari,
      bulanTerdekat: bulanTerdekat
    };
  };

  useEffect(() => {
    __getSoal();
  }, [])

  const __getSoal = () => {
    let LEVEL = getUmurBayi(ITEM.tanggal_lahir).bulanTerdekat;
    axios.post(apiURL + 'soal', {
      level: LEVEL
    }).then(res => {
      // console.log(res.data);
      if (res.data.length > 0) {
        setSoal(res.data);
      } else {
        showMessage({ message: 'Pertanyaan untuk kelompok umur ini belum tersedia !' });
        navigation.goBack();
      }


    })
  }



  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <MyHeader title='Kembali' />
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <Text style={styles.title}>KPSP ({getUmurBayi(ITEM.tanggal_lahir).bulanTerdekat} Bulan )</Text>
          <Text style={styles.subtitle}>({getUmurBayi(ITEM.tanggal_lahir).teks})</Text>
        </View>

        <View style={styles.cardBox}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }} >
            <Text style={{
              ...styles.nomor,
              flex: 1,
            }}>{nomorAktif + 1}/10</Text>
            <Icon name='arrow-forward' type='ionicon' color={colors.black} size={20} />
          </View>

          <View style={{
            flex: 1,

          }}>
            <Text style={styles.kategori}>[{soalAktif.kategori}]</Text>
            <ScrollView>
              <RenderHtml

                tagsStyles={{
                  div: {
                    fontFamily: fonts.body3.fontFamily,
                    color: colors.black,
                    textAlign: 'justify',
                  },
                }}
                systemFonts={systemFonts}
                contentWidth={windowWidth}
                source={{
                  html: `<div>${soalAktif.pertanyaan}</div>`
                }}
              />
            </ScrollView>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}>
            <TouchableOpacity style={soal[nomorAktif].jawaban == 'Ya' ? styles.buttonYa : styles.buttonTidak} onPress={() => {
              let tmp = [...soal];
              tmp[nomorAktif].jawaban = 'Ya';
              setSoal(tmp);
              if (nomorAktif < 9) {
                setNomorAktif(nomorAktif + 1)
              };
            }}><Text style={styles.buttonText}>Ya</Text></TouchableOpacity>
            <TouchableOpacity style={soal[nomorAktif].jawaban == 'Tidak' ? styles.buttonYa : styles.buttonTidak} onPress={() => {
              let tmp = [...soal];
              tmp[nomorAktif].jawaban = 'Tidak';
              setSoal(tmp);
              if (nomorAktif < 9) {
                setNomorAktif(nomorAktif + 1)
              };
            }}><Text style={styles.buttonText}>Tidak</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.gridBox}>
          {[...Array(soal.length).keys()].map((i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setNomorAktif(i)}
              style={[
                styles.gridButton,
                soal[i].jawaban !== '' && styles.answeredButton,
                i === nomorAktif && styles.activeButton
              ]}
            >
              <Text style={styles.gridText}>{i + 1}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.gridButton,
              styles.simpanButton,
              soal.every((j) => j.jawaban !== '') && { backgroundColor: colors.success }
            ]}
            onPress={() => {
              if (soal.every((j) => j.jawaban !== '')) {

                let hasil = '';
                let jml = soal.filter(i => i.jawaban == 'Ya').length;
                if (jml <= 6) {
                  hasil = 1;
                } else if (jml >= 7 && jml <= 8) {
                  hasil = 2;
                } else if (jml >= 9 && jml <= 10) {
                  hasil = 3;
                }


                navigation.navigate('HasilKPSP', {
                  anak: ITEM,
                  hasil: hasil,
                });
              }
            }}
          >
            <Text style={[
              styles.gridText,
              soal.every((j) => j.jawaban !== '') && { color: colors.white }
            ]}>simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  subtitle: {
    fontFamily: fonts.primary[600],
    fontSize: 12
  },
  cardBox: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 20
  },
  cardHeader: {
    flex: 1,
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  buttonYa: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#EADCF1',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999'
  },
  buttonTidak: {
    flex: 1,
    marginHorizontal: 10,
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
    backgroundColor: colors.tertiary// ungu untuk soal aktif
  },
  answeredButton: {
    backgroundColor: '#D2A4DC' // biru muda untuk soal sudah dijawab
  },
  simpanButton: {
    width: '48%'
  }
});
