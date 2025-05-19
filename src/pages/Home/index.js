import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { getData, storeData, pushNotif,  } from '../../utils/localStorage';
import { colors, fonts } from '../../utils';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ navigation, route }) {
  const [user, setUser] = useState({});
  const [anak, setAnak] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showKpspAlert, setShowKpspAlert] = useState(false);
  const [showKpspThanks, setShowKpspThanks] = useState(false);
  const [showAnakThanks, setShowAnakThanks] = useState(false);
  const [addedTime, setAddedTime] = useState(moment());

  


  const getIconBintang = (status) => {
    switch (status) {
      case 'Sesuai Umur':
        return require('../../assets/bintang-hijau.png');
      case 'Meragukan':
        return require('../../assets/bintang-kuning.png');
      case 'Ada Kemungkinan Penyimpangan':
        return require('../../assets/bintang-merah.png');
      default:
        return require('../../assets/bintang-abu.png');
    }
  };

  const [lastKpspTime, setLastKpspTime] = useState(null);


useEffect(() => {
  const checkNotif = async () => {
    const anak = await getData('anak');
    if (!anak || anak.length === 0) {
      await pushNotif({
        title: 'Profil si Kecil',
        message: 'Halo Parents! Selamat datang, tambahkan profil si Kecil terlebih dahulu ya untuk bisa akses fitur skrining KPSP.',
      });
    } else {
      const kpspStatuses = await Promise.all(
        anak.map(async (a) => {
          const kpsp = await getData(`kpsp_${a.id}`);
          return !kpsp;
        })
      );
      if (kpspStatuses.includes(true)) {
        await pushNotif({
          title: 'Ayo mulai skrining dengan KPSP',
          message: 'Halo Parents!\nProfil si kecil sudah, yuk kita mulai skrining si kecil',
        });
      }
    }
  };

  checkNotif();
}, []);


useFocusEffect(
  React.useCallback(() => {
    const refreshData = async () => {
      const userData = await getData('user');
      setUser(userData);

      const anakData = await getData('anak');
      let updated = [];

      if (anakData && anakData.length > 0) {
        updated = await Promise.all(
          anakData.map(async item => {
            const birthDate = moment(item.tanggal_lahir);
            const now = moment();
            const years = now.diff(birthDate, 'years');
            const months = now.diff(birthDate.clone().add(years, 'years'), 'months');
            const days = now.diff(birthDate.clone().add(years, 'years').add(months, 'months'), 'days');

            const kpspData = await getData(`kpsp_${item.id}`);
            return {
              ...item,
              usia: `${years.toString().padStart(2, '0')} thn / ${months.toString().padStart(2, '0')} bln / ${days.toString().padStart(2, '0')} hr`,
              statusKPSP: kpspData?.status || null,
              tanggalKPSP: kpspData?.tanggal || null,
              waktuKPSP: kpspData?.waktu || null,
            };
          })
        );

        setAnak(updated);
      } else {
        setAnak([]);
      }

      // Cek modal showKpspThanks
      const flag = await getData('kpsp_thanks_pending');
      if (flag === 'true') {
        const timestamps = updated
          .map(a => a.tanggalKPSP)
          .filter(Boolean)
          .map(t => moment(t, 'YYYY-MM-DD HH:mm').toDate().getTime());

        if (timestamps.length > 0) {
          const latestTimestamp = new Date(Math.max(...timestamps));
          setLastKpspTime(moment(latestTimestamp));
        }

        setShowKpspThanks(true);
        await storeData('kpsp_thanks_pending', 'false');
      }


const anakSuccessFlag = await getData('anak_success_pending');
if (anakSuccessFlag === 'true') {
  setShowAnakThanks(true); // state baru untuk modal
  setAddedTime(moment());
  await storeData('anak_success_pending', 'false');
}

    };

    refreshData();
  }, [])
);



  // useEffect(() => {
  //   getData('user').then(setUser);
  //   getData('anak').then(async (a) => {
  //     if (a) {
  //       const updated = await Promise.all(
  //         a.map(async item => {
  //           const birthDate = moment(item.tanggal_lahir);
  //           const now = moment();
  //           const years = now.diff(birthDate, 'years');
  //           const months = now.diff(birthDate.clone().add(years, 'years'), 'months');
  //           const days = now.diff(birthDate.clone().add(years, 'years').add(months, 'months'), 'days');

  //           const kpspData = await getData(`kpsp_${item.id}`);
  //           return {
  //             ...item,
  //             usia: `${years.toString().padStart(2, '0')} thn / ${months.toString().padStart(2, '0')} bln / ${days.toString().padStart(2, '0')} hr`,
  //             statusKPSP: kpspData?.status || null,
  //             tanggalKPSP: kpspData?.tanggal || null,
  //             waktuKPSP: kpspData?.waktu || null,
  //           };
  //         })
  //       );
  //       setAnak(updated);
  //     } else {
  //       setAnak([]);
  //     }
  //   });


    

  //   getData('welcome_shown').then(value => {
  //     if (value !== 'true') setShowWelcome(true);
  //   });
  // }, []);

  const getUsername = (email) => {
    if (!email) return 'User';
    return email.split('@')[0];
  };

  const renderAnak = ({ item, index }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProfileSiKecil', { index })} style={styles.childCard}>
      <Image
        source={item.foto?.uri ? { uri: item.foto.uri } : require('../../assets/anak.png')}
        style={styles.childPhoto}
      />
      <View style={{ padding: 10 }}>
        <Image
          source={getIconBintang(item.statusKPSP)}
          style={{ width: 20, height: 20, position: 'absolute', top: 8, right: 8, zIndex: 10 }}
        />
        <Text style={styles.childName}>{item.nama}</Text>
        <Text style={styles.childText}>{item.usia}</Text>
        <Text style={styles.childText}>⚖️ {item.bb} kg   📏 {item.tb} cm</Text>
      </View>
    </TouchableOpacity>
  );

  const today = new Date();
  const dateStr = moment(today).format('DD/MM/YYYY');
  const timeStr = moment(today).format('HH:mm') + ' WIB';

  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
   <TouchableWithoutFeedback onPress={() => navigation.navigate("Account")}>
          <Image
  source={user?.foto?.uri ? { uri: user.foto.uri } : require('../../assets/user.png')}
  style={styles.avatar}
/>
   </TouchableWithoutFeedback>
          <View>
            <Text style={styles.hallo}>Hallo ,</Text>
     <Text style={styles.nama}>{user?.nama || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Notifikasi")} style={styles.notifButton}>
            <Image source={require('../../assets/bell.png')} style={styles.bell} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Si Kecil</Text>
        <FlatList
          data={[...anak, { isPlus: true }]}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) =>
            item.isPlus ? (
              <TouchableOpacity onPress={() => navigation.navigate("TambahSiKecil")} style={styles.addCard}>
                <Text style={styles.addText}>+</Text>
              </TouchableOpacity>
            ) : (
              renderAnak({ item, index })
            )
          }
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.section}>
          <Text style={styles.ajakan}>Ayo mulai pantau tumbuh kembang si Kecil</Text>
          <View style={[styles.kpspBox, anak.length === 0 && { backgroundColor: '#D9D9D9' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.kpspTitle, anak.length === 0 && { color: colors.black }]}>KPSP</Text>
              <Text style={[styles.kpspSubtitle, anak.length === 0 && { color: '#A29CB6' }]}>Keusioner Pra Skrining Perkembangan</Text>
              <Text style={[styles.kpspStatus, anak.length === 0 && { color: '#A29CB6' }]}>
                {anak.length === 0
                  ? 'Tambahkan profil si Kecil terlebih dahulu'
                  : anak.some(a => a.tanggalKPSP)
                    ? `Terakhir ${moment(Math.max(...anak
                        .filter(a => a.tanggalKPSP)
                        .map(a => moment(a.tanggalKPSP, 'YYYY-MM-DD HH:mm').toDate().getTime())))
                        .format('DD/MM/YYYY')}`
                    : 'Belum Mulai'}
              </Text>
            </View>
            <View style={{ justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => {
                  if (anak.length === 0) {
                    setShowKpspAlert(true);
                  } else {
                    navigation.navigate('HomeKPSP');
                  }
                }}
                style={[styles.mulaiBtn, anak.length === 0 ? { backgroundColor: '#333' } : { backgroundColor: '#FFA500' }]}>
                <Text style={[styles.mulaiText, anak.length === 0 && { color: 'white' }]}>Mulai</Text>
              </TouchableOpacity>
            <TouchableOpacity
  onPress={() => {
    if (anak.length === 0) {
      setShowKpspAlert(true);
    } else {
      navigation.navigate('RiwayatKPSP');
    }
  }}
  style={[
    styles.riwayatBtn,
    anak.length === 0 ? { backgroundColor: '#333' } : { backgroundColor: '#ccc' }
  ]}
>
  <Text style={[
    styles.riwayatText,
    anak.length === 0 && { color: 'white' }
  ]}>
    Riwayat
  </Text>
</TouchableOpacity>

            </View>
          </View>
        </View>

        {/* 🟩 Riwayat KPSP */}
        {anak
          .filter(a => a.statusKPSP && a.tanggalKPSP)
          .map((a, i) => {
            let bgColor = '#ccc';
            if (a.statusKPSP === 'Sesuai Umur') bgColor = '#DDFBE8';
            else if (a.statusKPSP === 'Meragukan') bgColor = '#FFF7DB';
            else if (a.statusKPSP === 'Ada Kemungkinan Penyimpangan') bgColor = '#FFE5E5';

            return (
              <View key={i} style={{
                backgroundColor: bgColor,
                marginTop: 16,
                borderRadius: 10,
                padding: 16,
                marginHorizontal: 20,
                borderWidth: 1,
                borderColor: '#ccc',
                width:"100%",
                right:20
              }}>
                <Text style={{ fontFamily: fonts.primary[700], fontSize: 16, color: '#333' }}>
                  {a.nama}, {a.statusKPSP}
                </Text>
                <Text style={{ fontFamily: fonts.primary[400], fontSize: 12, color: '#666', marginTop: 4 }}>
                  {moment(a.tanggalKPSP, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY')} {moment(a.tanggalKPSP, 'YYYY-MM-DD HH:mm').format('HH:mm')} WIB
                </Text>
              </View>
            );
          })}

      </ScrollView>

      {/* Modal Welcome */}
      <Modal visible={showWelcome} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Profil si Kecil</Text>
            <Text style={styles.modalMessage}>
              Halo Parents !{"\n"}
              Selamat datang, tambahkan profil si Kecil terlebih dahulu ya untuk bisa akses fitur skrining KPSP.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => { storeData('welcome_shown', 'true'); setShowWelcome(false); }}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>{dateStr}</Text>
              <Text style={styles.modalFooterText}>{timeStr}</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal KPSP Alert */}
      <Modal visible={showKpspAlert} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={[styles.modalTitle, { textAlign: 'center' }]}>Isi profil Si Kecil terlebih dahulu untuk mengakses KPSP</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowKpspAlert(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>{dateStr}</Text>
              <Text style={styles.modalFooterText}>{timeStr}</Text>
            </View>
          </View>
        </View>
      </Modal>

  <Modal visible={showKpspThanks} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      
      <Text style={styles.modalTitle}>KPSP sudah terisi</Text>

      <Text style={styles.modalMessage}>
        Terimakasih parents sudah menyediakan waktunya untuk melakukan skrining dengan KPSP
      </Text>

      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setShowKpspThanks(false)}
      >
        <Text style={styles.modalButtonText}>OK</Text>
      </TouchableOpacity>

      {/* Waktu muncul di sini */}
      <View style={styles.modalFooter}>
        <Text style={styles.modalFooterText}>
          {lastKpspTime ? lastKpspTime.format('DD/MM/YYYY') : '-'}
        </Text>
        <Text style={styles.modalFooterText}>
          {lastKpspTime ? lastKpspTime.format('HH:mm') + ' WIB' : '-'}
        </Text>
      </View>

    </View>
  </View>
</Modal>


<Modal visible={showAnakThanks} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Ayo mulai skrining dengan KPSP</Text>
      <Text style={styles.modalMessage}>
        Profil si kecil sudah, yuk kita mulai skrining si kecil
      </Text>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setShowAnakThanks(false)}>
        <Text style={styles.modalButtonText}>OK</Text>
      </TouchableOpacity>
      <View style={styles.modalFooter}>
        <Text style={styles.modalFooterText}>{addedTime.format('DD/MM/YYYY')}</Text>
        <Text style={styles.modalFooterText}>{addedTime.format('HH:mm')} WIB</Text>
      </View>
    </View>
  </View>
</Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  hallo: { fontFamily: fonts.primary[400], fontSize: 16, color: colors.black },
  nama: { fontFamily: fonts.primary[600], fontSize: 15, color: colors.black, marginTop: -5 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  notifButton: { marginLeft: 'auto', backgroundColor: 'white', borderRadius: 20, padding: 8,  },
  bell: { width: 20, height: 20 },
  label: { fontFamily: fonts.primary[700], fontSize: 16, marginBottom: 10 },
  childRow: { flexDirection: 'row', alignItems: 'center' },
  childCard: { backgroundColor: '#f4e9f9', borderRadius: 15, width: 180, overflow: 'hidden', borderWidth: 1, borderColor: '#ccc', marginRight: 15, },
  childPhoto: { width: '100%', height: 100 },
  childTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  childName: { fontFamily: fonts.primary[700], fontSize: 16, color: colors.black },
  childText: { fontFamily: fonts.primary[400], fontSize: 13, color: colors.black },
  addCard: { backgroundColor: '#ddd', width: 100, height: 130, borderRadius: 15, justifyContent: 'center', alignItems: 'center',  },
  addText: { fontSize: 40, color: '#999' },
  section: { marginTop: 30 },
  ajakan: { fontFamily: fonts.primary[400], marginBottom: 10 },
  kpspBox: { backgroundColor: '#f4e9f9', borderRadius: 15, padding: 20, flexDirection: 'row', justifyContent: 'space-between', borderWidth:1, borderColor: '#ccc',  },
  kpspTitle: { fontFamily: fonts.primary[800], fontSize: 16, color: colors.black },
  kpspSubtitle: { fontFamily: fonts.primary[400], color: '#888', fontSize: 13, marginTop: 2 },
  kpspStatus: { fontFamily: fonts.primary[400], color: '#444', fontSize: 12, marginTop: 10 },
  mulaiBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, elevation: 2 },
  mulaiText: { fontFamily: fonts.primary[700], fontSize: 13, color: 'white', textAlign: "center" },
  riwayatBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginTop: 10, elevation: 2 },
  riwayatText: { fontFamily: fonts.primary[700], fontSize: 13, color: colors.black },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBox: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: 300, elevation: 5 },
  modalTitle: { fontFamily: fonts.primary[700], fontSize: 16, color: colors.black, marginBottom: 10 },
  modalMessage: { fontFamily: fonts.primary[400], fontSize: 14, color: colors.black, marginBottom: 20 },
  modalButton: { backgroundColor: '#EADCF1', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#999' },
  modalButtonText: { fontFamily: fonts.primary[600], fontSize: 14, color: colors.black },
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalFooterText: { fontFamily: fonts.primary[400], fontSize: 10, color: '#999' }
});
