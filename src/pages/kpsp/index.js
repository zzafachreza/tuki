import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors, fonts } from '../../utils';
import { MyHeader } from '../../components';

export default function HomeKPSP({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <MyHeader title='KPSP' />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Apa itu Kuesioner Pra Skrining Perkembang (KPSP)?</Text>
          <Text style={styles.text}>
            KPSP adalah alat/instrumen yang digunakan untuk mengetahui perkembangan anak sesuai dengan usianya atau ada penyimpangan.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Anak usia berapa dapat melakukan KPSP ?</Text>
          <Text style={styles.text}>Anak usia <Text style={styles.bold}>3 – 72 bulan</Text></Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Berapa banyak pertanyaannya ya ?</Text>
          <Text style={styles.text}>
            Skrining ini berisi <Text style={styles.bold}>9 – 10 pertanyaan</Text> tentang kemampuan perkembangan yang telah dicapai anak.
          </Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Mulai</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: '#EADCF1',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.primary[700],
    fontSize: 16,
    marginBottom: 8,
    color: colors.black,
  },
  text: {
    fontFamily: fonts.primary[400],
    fontSize: 14,
    color: colors.black,
  },
  bold: {
    fontFamily: fonts.primary[700],
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
  },
  buttonText: {
    fontFamily: fonts.primary[700],
    color: colors.white,
    fontSize: 16,
  },
});
