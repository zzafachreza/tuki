import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, fonts } from '../../utils';
import { getData } from '../../utils/localStorage';
import moment from 'moment';

import { Icon } from 'react-native-elements'; // pastikan import ini ditambahkan di atas

export default function RiwayatKPSP({ navigation }) {
  const [anak, setAnak] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getData('anak').then(async (a) => {
      if (a) {
        const updated = await Promise.all(
          a.map(async item => {
            const kpspData = await getData(`kpsp_${item.id}`);
            return {
              ...item,
              statusKPSP: kpspData?.status || null,
              tanggalKPSP: kpspData?.tanggal || null,
            };
          })
        );
        setAnak(updated.filter(item => item.statusKPSP && item.tanggalKPSP));
      }
    });
  }, []);

  const getCardColor = (status) => {
    switch (status) {
      case 'Sesuai Umur': return '#DDFBE8';
      case 'Meragukan': return '#FFF7DB';
      case 'Ada Kemungkinan Penyimpangan': return '#FFE5E5';
      default: return '#E0E0E0';
    }
  };

  const getMainColor = (status) => {
    switch (status) {
      case 'Sesuai Umur': return '#30BFA3';
      case 'Meragukan': return '#FFB534';
      case 'Ada Kemungkinan Penyimpangan': return '#F05945';
      default: return '#ddd';
    }
  };

  const getSaran = (status) => {
    switch (status) {
      case 'Sesuai Umur':
        return [
          'Melanjutkan memberikan si kecil stimulasi perkembangan sesuai umur',
          'Ikutkan si kecil teratur 1x/bulan kegiatan penimbangan dan pelayanan kesehatan di posyandu dan setiap ada kegiatan Bina Keluarga Balita (BKB)',
          'Lanjutkan pemantauan secara rutin dengan menggunakan buku KIA',
          'Setiap 3 bulan, lakukan skrining rutin menggunakan KPSP',
        ];
      case 'Meragukan':
        return [
          'Lakukan stimulasi setiap saat dan sesering mungkin pada si kecil',
          'Lakukan skrining KPSP 2 minggu kemudian, bila hasil tetap meragukan atau ada kemungkinan penyimpangan, rujuk ke rumah sakit tumbuh kembang level 1',
          'Lakukan pemeriksaan kesehatan untuk mencari kemungkinan adanya penyakit yang menyebabkan penyimpangan perkembangannya dan lakukan pengobatan',
        ];
      case 'Ada Kemungkinan Penyimpangan':
        return ['Rujuk ke Rumah Sakit Tumbuh Kembang Level 1'];
      default:
        return [];
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: selected ? getMainColor(selected.statusKPSP) : colors.secondary }}>
      {/* Header */}

<View style={{ padding: 16 }}>
  <TouchableOpacity
    onPress={() => {
      if (selected) {
        setSelected(null); 
      } else {
        navigation.goBack(); 
      }
    }}
    style={{
      backgroundColor: '#EADCF1',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 50,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    }}
  >
    <View style={{
      backgroundColor: 'white',
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      borderWidth: 1,
      borderColor: '#ccc',
    }}>
      <Icon
        type="ionicon"
        name="arrow-back-outline"
        color="#2D2D2D"
        size={20}
      />
    </View>
    <Text style={{
      fontFamily: fonts.primary[700],
      fontSize: 14,
      color: '#2D2D2D',
    }}>
      Riwayat KPSP
    </Text>
  </TouchableOpacity>
</View>


      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        {/* List Card */}
{/* Hanya tampilkan list jika belum memilih */}
{!selected && anak.map((item, index) => (
  <TouchableOpacity key={index} onPress={() => setSelected(item)}>
    <View style={{
      backgroundColor: getCardColor(item.statusKPSP),
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#ccc",
    }}>
      <Text style={{
        fontFamily: fonts.primary[700],
        fontSize: 16,
        color: '#333',
      }}>
        {item.nama}, {item.statusKPSP}
      </Text>
      <Text style={{
        fontFamily: fonts.primary[400],
        fontSize: 12,
        color: '#666',
        marginTop: 4,
      }}>
        {moment(item.tanggalKPSP, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY')} {' '}
        {moment(item.tanggalKPSP, 'YYYY-MM-DD HH:mm').format('HH:mm')} WIB
      </Text>
    </View>
  </TouchableOpacity>
))}


        {anak.length === 0 && (
          <Text style={{
            textAlign: 'center',
            marginTop: 20,
            fontFamily: fonts.primary[400],
            fontSize: 14,
            color: '#999'
          }}>
            Belum ada riwayat KPSP.
          </Text>
        )}

        {/* Detail hasil jika dipilih */}
        {selected && (
          <>
            <View style={{
              backgroundColor: getCardColor(selected.statusKPSP),
              borderRadius: 12,
              padding: 16,
              marginTop: 10,
              borderWidth: 1,
              borderColor: '#ccc',
            }}>
              <Text style={{
                fontFamily: fonts.primary[700],
                fontSize: 16,
                color: '#333',
                marginBottom: 4,
              }}>Hasil</Text>
              <Text style={{
                fontFamily: fonts.primary[600],
                fontSize: 15,
                color: '#333',
              }}>{selected.nama}, {selected.statusKPSP}</Text>
              <Text style={{
                fontFamily: fonts.primary[400],
                fontSize: 12,
                color: '#999',
                marginTop: 6
              }}>
                {moment(selected.tanggalKPSP, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY')} {' '}
                {moment(selected.tanggalKPSP, 'YYYY-MM-DD HH:mm').format('HH:mm')} WIB
              </Text>
            </View>

            <View style={{
              backgroundColor: getCardColor(selected.statusKPSP),
              borderRadius: 12,
              padding: 16,
              marginTop: 16,
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 30,
            }}>
              <Text style={{
                fontFamily: fonts.primary[700],
                fontSize: 16,
                color: '#222',
                marginBottom: 10
              }}>Apa yang dilakukan selanjutnya ?</Text>

              {getSaran(selected.statusKPSP).map((item, idx) => (
                <Text key={idx} style={{
                  fontFamily: fonts.primary[400],
                  fontSize: 14,
                  color: '#222',
                  marginBottom: 8
                }}>
                  {getSaran(selected.statusKPSP).length > 1 ? `${idx + 1}. ${item}` : item}
                </Text>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
