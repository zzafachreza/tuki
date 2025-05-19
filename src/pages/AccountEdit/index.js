import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { fonts, colors } from '../../utils';
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { MyButton, MyHeader, MyInput, MyPicker } from '../../components';
import { launchImageLibrary } from 'react-native-image-picker';
import SweetAlert from 'react-native-sweet-alert';
import MyLoading from '../../components/MyLoading';
import axios from 'axios';

export default function AccountEdit({ navigation, route }) {
const [kirim, setKirim] = useState({
  nama: route.params.nama_lengkap || '',
  jenis_kelamin: route.params.jenis_kelamin || '',
  telepon: route.params.telepon || '',
  provinsi: route.params.provinsi || '',
  kota: route.params.kota || '',
  email: route.params.email || '',
  foto_user: route.params.foto_user || null,
  newfoto_user: null
});

    const [loading, setLoading] = useState(false);

    const sendServer = () => {
        setLoading(true);
        axios.post(apiURL + 'update_profile', kirim).then(res => {
            setLoading(false);
            if (res.data.status == 200) {
                SweetAlert.showAlertWithOptions({
                    title: MYAPP,
                    subTitle: res.data.message,
                    style: 'success',
                    cancellable: true
                }, callback => {
                    storeData('user', res.data.data);
                    navigation.replace('MainApp');
                });
            }
        });
    };

    useEffect(() => {
        setKirim({
            ...kirim,
            newfoto_user: null,
        });
    }, []);

    const pilihFoto = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, res => {
            if (!res.didCancel && res.assets) {
                setKirim({ ...kirim, newfoto_user: res.assets[0].uri });
            }
        });
    };

    return (
        <ImageBackground source={require('../../assets/bgsplash.png')} style={styles.container}>
        <MyHeader title='Ubah Profile'/>
            <ScrollView contentContainerStyle={styles.wrapper}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                <TouchableOpacity onPress={pilihFoto} style={styles.fotoWrap}>
               {(kirim.newfoto_user || kirim.foto_user) ? (
  <Image source={{ uri: kirim.newfoto_user || kirim.foto_user }} style={styles.foto} />

                    ) : (
                        <View style={styles.plusBox}><Text style={styles.plusText}>+</Text></View>
                    )}
                </TouchableOpacity>

                <MyInput label="Nama Lengkap Parents" iconname="person-outline" value={kirim.nama} onChangeText={x => setKirim({ ...kirim, nama: x })} />
                <Text style={styles.label}>Jenis Kelamin</Text>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.radio} onPress={() => setKirim({ ...kirim, jenis_kelamin: 'Perempuan' })}>
                        <View style={[styles.radioOuter, kirim.jenis_kelamin === 'Perempuan' && styles.radioActive]} />
                        <Text style={styles.radioLabel}>Perempuan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.radio} onPress={() => setKirim({ ...kirim, jenis_kelamin: 'Laki-laki' })}>
                        <View style={[styles.radioOuter, kirim.jenis_kelamin === 'Laki-laki' && styles.radioActive]} />
                        <Text style={styles.radioLabel}>Laki-laki</Text>
                    </TouchableOpacity>
                </View>
                <MyInput label="Nomor Telepon" iconname="call-outline" value={kirim.telepon} onChangeText={x => setKirim({ ...kirim, telepon: x })} />
                <MyPicker
                    label="Provinsi"
                    iconname="location-outline"
                    value={kirim.provinsi}
                    onChangeText={(val) => setKirim({ ...kirim, provinsi: val })}
                    data={[
                        { label: 'DKI Jakarta', value: 'DKI Jakarta' },
                        { label: 'Jawa Barat', value: 'Jawa Barat' },
                        { label: 'Jawa Tengah', value: 'Jawa Tengah' },
                    ]}
                />
                <MyPicker
                    label="Kota/Kabupaten"
                    iconname="business-outline"
                    value={kirim.kota}
                    onChangeText={(val) => setKirim({ ...kirim, kota: val })}
                    data={[
                        { label: 'Jakarta Pusat', value: 'Jakarta Pusat' },
                        { label: 'Bandung', value: 'Bandung' },
                        { label: 'Semarang', value: 'Semarang' },
                    ]}
                />

                <TouchableOpacity onPress={sendServer} style={styles.saveBtn}>
                    <Text style={styles.saveText}>Simpan</Text>
                </TouchableOpacity>

                {loading && <MyLoading />}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9EDF7' },
    wrapper: { padding: 20 },
    logo: { width: 200, height: 102,  alignSelf: 'center', marginTop:-20 },
    title: { fontFamily: fonts.primary[800], fontSize: 20, textAlign: 'center', marginVertical: 20 },
    fotoWrap: {
        alignSelf: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 20,
    },
    foto: { width: '100%', height: '100%' },
    plusBox: { width: 40, height: 40, backgroundColor: '#ccc', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    plusText: { fontSize: 24, color: '#999' },
    label: { fontFamily: fonts.primary[600], fontSize: 14, marginBottom: 10 },
    row: { flexDirection: 'row', marginBottom: 20 },
    radio: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    radioOuter: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#2D2D2D', marginRight: 8 },
    radioActive: { backgroundColor: '#2D2D2D' },
    radioLabel: { fontFamily: fonts.primary[400], fontSize: 14 },
    saveBtn: { backgroundColor: '#9C42C4', padding: 16, borderRadius: 30, marginTop: 30, alignItems: 'center' },
    saveText: { fontFamily: fonts.primary[700], fontSize: 16, color: 'white' },
});
