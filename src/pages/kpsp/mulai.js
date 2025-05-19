import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { colors, fonts } from '../../utils';
import { MyHeader } from '../../components';
import { getData } from '../../utils/localStorage';
import moment from 'moment';
import { Icon } from 'react-native-elements';

export default function MulaiKPSP({ navigation }) {
  const [anakList, setAnakList] = useState([]);
  const [selectedAnak, setSelectedAnak] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(1000)).current;

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
            {selectedAnak ? (
              <Image source={selectedAnak.foto?.uri ? { uri: selectedAnak.foto.uri } : require('../../assets/anak.png')} style={styles.fotoPlaceholder} />
            ) : (
              <View style={styles.fotoPlaceholder} >
              <Image source={require('../../assets/icon-bayi.png')} style={{
                height:25,
                width:25,
              }}/>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!selectedAnak}
            style={[styles.mulaiButton, { backgroundColor: selectedAnak ? '#FFA500' : '#D9D9D9' }]}
onPress={() =>
  navigation.navigate('SoalKPSP', {
    dataAnak: selectedAnak,
    usia_bulan: selectedAnak.usia_bulan, // atau Math.floor(selectedAnak.usia_bulan)
  })
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

        <Text style={styles.reminder}>Jawablah pertanyaan–pertanyaannya dengan <Text style={{ fontStyle: 'italic' }}>jujur</Text> ya parents.</Text>

        <Modal visible={showModal} transparent animationType="none">
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalBox, { transform: [{ translateY: slideAnim }] }]}>
              <View style={{ padding: 10 }}>
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={{
                padding:10,
                flexDirection:"row",
                justifyContent:"flex-start",
                alignItems:"center",
              }}>
               <View style={{
                padding:5,
                backgroundColor:colors.white,
                borderRadius:50,
                borderWidth:1,
               }}>
                 <Icon name='arrow-back' size={25} type='ionicon' color={colors.black} style={{}}/>
               </View>
                <Text style={{
                  fontFamily:fonts.primary[600],
                  fontSize:18,
                  top :2,
                  left:10
                }}>Si Kecil</Text>
              </View>
            </TouchableWithoutFeedback>
              </View>
              <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View style={styles.wrapCard}>
                  {anakList.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.card}
                      onPress={() => {
                        setSelectedAnak(item);
                        closeModal();
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
    width: 160,
    height: 160,
    borderRadius: 20,
    backgroundColor: '#D9D9D9',
    marginBottom: 20,
    justifyContent:'center',
    alignItems:'center',
  },
  mulaiButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#999',
    width:"100%"
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
