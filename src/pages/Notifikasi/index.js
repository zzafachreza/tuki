import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, fonts } from '../../utils';
import { MyHeader } from '../../components';
import moment from 'moment';
import { getData, storeData } from '../../utils/localStorage';

export default function Notifikasi({ navigation }) {
  const [notif, setNotif] = useState([]);

  const loadNotif = async () => {
    const data = await getData('notifikasi');
    console.log('💾 NOTIFIKASI DARI STORAGE:', data);

    if (data && Array.isArray(data)) {
      const parsed = data.map(n => ({
        ...n,
        timestamp: moment(n.timestamp, 'YYYY-MM-DD HH:mm')
      }));
      setNotif(parsed);
    } else {
      setNotif([]);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadNotif(); // refresh tiap kali halaman dibuka
    });
    loadNotif();
    return unsubscribe;
  }, [navigation]);

  const handleClear = async () => {
    await storeData('notifikasi', []);
    setNotif([]);
    console.log('🔴 Semua notifikasi dihapus');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <MyHeader title="Notifikasi" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {notif.length === 0 ? (
          <Text style={styles.empty}>Belum ada notifikasi</Text>
        ) : (
          notif.map((item, index) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>
                {item.timestamp.format('DD/MM/YYYY')} {item.timestamp.format('HH:mm')} WIB
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
        <Text style={styles.clearText}>Hapus Semua</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontFamily: fonts.primary[700],
    fontSize: 16,
    marginBottom: 6,
    color: '#2D2D2D'
  },
  message: {
    fontFamily: fonts.primary[400],
    fontSize: 14,
    color: '#333'
  },
  time: {
    fontFamily: fonts.primary[600],
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 12
  },
  empty: {
    textAlign: 'center',
    fontFamily: fonts.primary[400],
    fontSize: 14,
    color: '#999',
    marginTop: 32
  },
  clearBtn: {
    backgroundColor: '#FF5555',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
    margin: 16
  },
  clearText: {
    color: 'white',
    fontFamily: fonts.primary[600]
  }
});
