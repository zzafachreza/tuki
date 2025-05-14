import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, fonts } from '../../utils';
import { MyHeader } from '../../components';
import { getData } from '../../utils/localStorage';
import moment from 'moment';

export default function MulaiKPSP({ navigation }) {
  const [anakList, setAnakList] = useState([]);
  const [selectedAnak, setSelectedAnak] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getData('anak').then(res => {
      if (res) {
        const now = moment();
        const filtered = res
          .map(item => {
            let birthDate = moment(item.tanggal_lahir, 'YYYY-MM-DD');
            if (!birthDate.isValid()) birthDate = moment();
            const usia = moment.duration(now.diff(birthDate));
            const tahun = Math.floor(usia.asYears());
            const bulan = Math.floor(usia.asMonths()) % 12;
            const hari = Math.floor(usia.asDays()) % 30;
            const usiaStr = `${tahun.toString().padStart(2, '0')} thn / ${bulan.toString().padStart(2, '0')} bln / ${hari.toString().padStart(2, '0')} hr`;
            return {
              ...item,
              usia_bulan: now.diff(birthDate, 'months'),
              usia: usiaStr,
            };
          })
          .filter(item => item.usia_bulan >= 3 && item.usia_bulan <= 72);
        setAnakList(filtered);
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <MyHeader title='KPSP' />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.introCard}>
          <Text style={styles.question}>Siapa yang mau diskrining hari ini ?</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            {selectedAnak ? (
              <Image source={selectedAnak.foto?.uri ? { uri: selectedAnak.foto.uri } : require('../../assets/anak.png')} style={styles.fotoPlaceholder} />
            ) : (
              <View style={styles.fotoPlaceholder} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!selectedAnak}
            style={[styles.mulaiButton, { backgroundColor: selectedAnak ? '#FFA500' : '#D9D9D9' }]}
            onPress={() => navigation.navigate('HomeKPSP', { index: anakList.findIndex(a => a.nama === selectedAnak.nama) })}>
            <Text style={styles.mulaiButtonText}>Mulai</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.reminder}>Jawablah pertanyaan–pertanyaannya dengan <Text style={{ fontStyle: 'italic' }}>jujur</Text> ya parents.</Text>

        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <MyHeader title="Si Kecil" onBackPress={() => setShowModal(false)} />
              <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View style={styles.wrapCard}>
                  {anakList.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.card}
                      onPress={() => {
                        setSelectedAnak(item);
                        setShowModal(false);
                      }}>
                      <Image
                        source={item.foto?.uri ? { uri: item.foto.uri } : require('../../assets/anak.png')}
                        style={styles.foto}
                      />
                      <Text style={styles.nama}>{item.nama}</Text>
                      <Text style={styles.usia}>{item.usia}</Text>
                      <Text style={styles.data}>⚖️ {item.bb || '00'} kg   📏 {item.tb || '00'} cm</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
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
    width: 160,
    height: 160,
    borderRadius: 20,
    backgroundColor: '#D9D9D9',
    marginBottom: 20
  },
  mulaiButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#999'
  },
  mulaiButtonText: {
    fontFamily: fonts.primary[700],
    fontSize: 16,
    color: '#000'
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
  },
  modalBox: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  }
});
