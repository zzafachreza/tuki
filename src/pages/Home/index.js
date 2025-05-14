import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal
} from 'react-native';
import { getData, storeData } from '../../utils/localStorage';
import { colors, fonts } from '../../utils';
import moment from 'moment';

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [anak, setAnak] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showKpspAlert, setShowKpspAlert] = useState(false);

  useEffect(() => {
    getData('user').then((u) => {
      setUser(u);
    });

    getData('anak').then((a) => {
      if (a) {
        const updated = a.map(item => {
          let birthDate = moment(item.tanggal_lahir);
          const now = moment();

          let usia = moment.duration(now.diff(birthDate));

          if (item.prematur === 'Ya' && item.minggu_kelahiran) {
            const mingguKoreksi = 40 - parseInt(item.minggu_kelahiran);
            const hariKoreksi = mingguKoreksi * 7;
            birthDate = moment(item.tanggal_lahir).add(hariKoreksi, 'days');
            usia = moment.duration(now.diff(birthDate));
          }

          const years = Math.floor(usia.asYears());
          const months = Math.floor(usia.asMonths()) % 12;
          const days = Math.floor(usia.asDays()) % 30;

          return {
            ...item,
            usia: `${years.toString().padStart(2, '0')} thn / ${months.toString().padStart(2, '0')} bln / ${days.toString().padStart(2, '0')} hr`
          };
        });
        setAnak(updated);
      } else {
        setAnak([]);
      }
    });

    getData('welcome_shown').then(value => {
      if (value !== 'true') {
        setShowWelcome(true);
      }
    });
  }, []);

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
        <View style={styles.childTitleRow}>
          <Text style={styles.childName}>{item.nama}</Text>
        </View>
        <Text style={styles.childText}>{item.usia}</Text>
        <Text style={styles.childText}>⚖️ {item.bb} kg   📏 {item.tb} cm</Text>
      </View>
    </TouchableOpacity>
  );

  const today = new Date();
  const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  const timeStr = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')} WIB`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/user.png')} style={styles.avatar} />
          <View>
            <Text style={styles.hallo}>Hallo ,</Text>
            <Text style={styles.nama}>{getUsername(user?.email)}</Text>
          </View>
          <TouchableOpacity style={styles.notifButton}>
            <Image source={require('../../assets/bell.png')} style={styles.bell} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Si Kecil</Text>
        <View style={styles.childRow}>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.ajakan}>Ayo mulai pantau tumbuh kembang si Kecil</Text>
          <View style={[styles.kpspBox, anak.length === 0 && { backgroundColor: '#D9D9D9' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.kpspTitle, anak.length === 0 && { color: colors.black }]}>KPSP</Text>
              <Text style={[styles.kpspSubtitle, anak.length === 0 && { color: '#A29CB6' }]}>Keusioner Pra Skrining Perkembangan</Text>
              <Text style={[styles.kpspStatus, anak.length === 0 && { color: '#A29CB6' }]}>  {anak.length === 0 ? 'Tambahkan profil si Kecil terlebih dahulu' : 'Belum Mulai'}</Text>
            </View>
            <View style={{ justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => { if (anak.length === 0) { setShowKpspAlert(true); } else { } }} style={[styles.mulaiBtn, anak.length === 0 ? { backgroundColor: '#333' } : { backgroundColor: '#FFA500' }]}>
                <Text style={[styles.mulaiText, anak.length === 0 && { color: 'white' }]}>Mulai</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { if (anak.length === 0) { setShowKpspAlert(true); } else { } }} style={[styles.riwayatBtn, anak.length === 0 ? { backgroundColor: '#333' } : { backgroundColor: '#ccc' }]}>
                <Text style={[styles.riwayatText, anak.length === 0 && { color: 'white' }]}>Riwayat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

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
