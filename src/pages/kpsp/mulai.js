import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Color, colors, fonts, windowWidth } from '../../utils';
import { MyGap, MyHeader } from '../../components';
import { apiURL, getData } from '../../utils/localStorage';
import moment from 'moment';

import { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import RenderHtml from 'react-native-render-html';
export default function MulaiKPSP({ navigation }) {
  const systemFonts = [fonts.body3.fontFamily, fonts.headline4.fontFamily];
  const [anakList, setAnakList] = useState([]);
  const [alat, setAlat] = useState({});
  const [selectedAnak, setSelectedAnak] = useState({
    nama_anak: '',
    tanggal_lahir: '',
  });
  const [showModal, setShowModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(1000)).current;
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

  const getUmurLengkap = (tanggalLahir) => {
    const lahir = moment(tanggalLahir);
    const sekarang = moment();

    const tahun = sekarang.diff(lahir, 'years');
    const sisaSetelahTahun = lahir.clone().add(tahun, 'years');

    const bulan = sekarang.diff(sisaSetelahTahun, 'months');
    const sisaSetelahBulan = sisaSetelahTahun.clone().add(bulan, 'months');

    const hari = sekarang.diff(sisaSetelahBulan, 'days');

    return `${tahun} thn / ${bulan} bln / ${hari} hr`;
  };

  const WARNA = [
    '#BA68C8',
    '#4DD0E1',
    '#FF9800',
    '#F44336',
    // '#BDBDBD'
  ]

  function hitungUmurKoreksi(tglLahir, tglPeriksa, usiaKehamilanSaatLahir) {
    const MILIS_PER_HARI = 1000 * 60 * 60 * 24;

    // Konversi tanggal ke objek Date
    const lahir = new Date(tglLahir);
    const periksa = new Date(tglPeriksa);

    // Hitung umur kronologis dalam hari
    const selisihHari = Math.floor((periksa - lahir) / MILIS_PER_HARI);

    // Koreksi prematur dalam hari
    const koreksiPrematurHari = (40 - usiaKehamilanSaatLahir) * 7;
    const umurKoreksiHari = selisihHari - koreksiPrematurHari;

    // Konversi ke tahun, bulan, hari
    const tahun = Math.floor(umurKoreksiHari / 365);
    const sisaHariSetelahTahun = umurKoreksiHari % 365;

    const bulan = Math.floor(sisaHariSetelahTahun / 30);
    const hari = sisaHariSetelahTahun % 30;

    return {
      umurKronologisHari: selisihHari,
      umurKoreksiHari: umurKoreksiHari,
      umurKoreksiFormat: `${tahun} thn / ${bulan} bln/ ${hari} hr`
    };
  }



  const __getAnak = () => {
    getData('user').then(u => {

      axios.post(apiURL + 'anak', {
        fid_pengguna: u.id_pengguna
      }).then(res => {
        console.log(res.data);
        setAnakList(res.data);

      })

    })
  }
  useEffect(() => {
    __getAnak();
  }, []);

  const openModal = () => {
    setShowModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 1000,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <MyHeader title='KPSP' />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.introCard}>
          <Text style={styles.question}>Siapa yang mau diskrining hari ini ?</Text>
          <TouchableOpacity onPress={openModal}>
            {selectedAnak.foto_anak ? (
              <Image source={selectedAnak.foto_anak ? { uri: selectedAnak.foto_anak } : require('../../assets/anak.png')} style={styles.fotoPlaceholder} />
            ) : (
              <View style={styles.fotoPlaceholder} >
                <Image source={require('../../assets/icon-bayi.png')} style={{
                  height: 25,
                  width: 25,
                }} />
              </View>
            )}
          </TouchableOpacity>
          {selectedAnak.foto_anak ? (<>
            <Text style={{
              fontFamily: fonts.secondary[600],
              fontSize: 15,
              marginBottom: 10,
            }}>{selectedAnak.nama_anak}</Text>
            {selectedAnak.prematur == 'Tidak' && <Text style={styles.usia}>{getUmurLengkap(selectedAnak.tanggal_lahir)}</Text>}
            {selectedAnak.prematur == 'Ya' && <Text style={styles.usia}>{hitungUmurKoreksi(selectedAnak.tanggal_lahir, moment().format('YYYY-MM-DD'), 34).umurKoreksiFormat}</Text>}

            <Text style={styles.usia}>kelompok Umur : <Text style={{
              fontFamily: fonts.secondary[800]
            }}>{getUmurBayi(selectedAnak.tanggal_lahir).bulanTerdekat} Bulan</Text></Text>
          </>) : (<MyGap jarak={20} />)}
          <TouchableOpacity
            disabled={!selectedAnak.foto_anak}
            style={[styles.mulaiButton, { backgroundColor: selectedAnak ? '#FFA500' : '#D9D9D9' }]}
            onPress={() => {
              console.log(selectedAnak)
              navigation.navigate('SoalKPSP', selectedAnak)
            }
            }
          >
            <Text style={styles.mulaiButtonText}>Mulai</Text>
          </TouchableOpacity>
          {/* {selectedAnak && selectedAnak.usia_bulan % 3 !== 0 && (
  <Text style={{
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: '#B00020',
    marginTop: 10,
    textAlign: 'center'
  }}>
    Umur si Kecil tidak tepat 3, 6, 9 dst. Gunakan KPSP kelompok umur di bawahnya.
  </Text>
)} */}

        </View>

        {selectedAnak.foto_anak &&
          <View style={{
            backgroundColor: '#EADCF1',
            padding: 20,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#999',
            fontFamily: fonts.primary[400],
            fontSize: 14,
            marginBottom: 10,
          }}>
            <Text style={{
              fontFamily: fonts.secondary[800],
              marginBottom: 10,
              color: colors.black,
              textAlign: 'justify',
            }}>Alat dan Bahan yang Dibutuhkan</Text>
            <RenderHtml

              tagsStyles={{
                div: {
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                  textAlign: 'justify',
                },
              }}
              systemFonts={[fonts.secondary[600]]}
              contentWidth={windowWidth}
              source={{
                html: `<div>${alat.alat}</div>`
              }}
            />
          </View>
        }

        <Text style={styles.reminder}>Jawablah pertanyaan–pertanyaannya dengan <Text style={{ fontStyle: 'italic' }}>jujur</Text> ya parents.</Text>

        <Modal visible={showModal} transparent animationType="none">
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalBox, { transform: [{ translateY: slideAnim }] }]}>
              <View style={{ padding: 10 }}>
                <TouchableWithoutFeedback onPress={closeModal}>
                  <View style={{
                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}>
                    <View style={{
                      padding: 5,
                      backgroundColor: colors.white,
                      borderRadius: 50,
                      borderWidth: 1,
                    }}>
                      <Icon name='arrow-back' size={25} type='ionicon' color={colors.black} style={{}} />
                    </View>
                    <Text style={{
                      fontFamily: fonts.primary[600],
                      fontSize: 18,
                      top: 2,
                      left: 10
                    }}>Si Kecil</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View style={styles.wrapCard}>
                  {anakList.map((item, index) =>

                    getUmurBayi(item.tanggal_lahir).bulan >= 3 && getUmurBayi(item.tanggal_lahir).bulan <= 72 &&
                    (


                      <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => {

                          let LEVEL = getUmurBayi(item.tanggal_lahir).bulanTerdekat;
                          axios.post(apiURL + 'kelompok', {
                            level: LEVEL
                          }).then(res => {
                            console.log(res.data);
                            setAlat(res.data[0]);
                            setSelectedAnak(item);
                            closeModal();
                          })


                        }}>
                        <Image
                          source={{
                            uri: item.foto_anak
                          }}
                          style={styles.foto}
                        />
                        <Text style={styles.nama}>{item.nama_anak}</Text>
                        {item.prematur == 'Tidak' && <Text style={styles.usia}>{getUmurLengkap(item.tanggal_lahir)}</Text>}
                        {item.prematur == 'Ya' && <Text style={styles.usia}>{hitungUmurKoreksi(item.tanggal_lahir, moment().format('YYYY-MM-DD'), 34).umurKoreksiFormat}</Text>}
                        <Text style={styles.data}>⚖️ {item.berat || '00'} kg   📏 {item.tinggi || '00'} cm</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  question: {
    fontFamily: fonts.primary[600],
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  introCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center'
  },
  fotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mulaiButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#999',
    width: "100%"
  },
  mulaiButtonText: {
    fontFamily: fonts.primary[700],
    fontSize: 16,
    color: '#000',
    textAlign: 'center'
  },
  wrapCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10
  },
  card: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#999'
  },
  foto: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 8,
  },
  nama: {
    fontFamily: fonts.primary[700],
    fontSize: 14,
  },
  usia: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    color: '#555'
  },
  data: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    color: '#555'
  },
  reminder: {
    backgroundColor: '#EADCF1',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#999',
    fontFamily: fonts.primary[400],
    fontSize: 14
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end'
  },
  modalBox: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%'
  }
});
