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
import { showMessage } from 'react-native-flash-message'

export default function AccountEdit({ navigation, route }) {
    const [kirim, setKirim] = useState(route.params);

    const [loading, setLoading] = useState(false);

    const sendServer = () => {
        setLoading(true);
        axios.post(apiURL + 'update_profile', kirim).then(res => {
            setLoading(false);
            if (res.data.status == 200) {
                showMessage({
                    type: 'success',
                    message: res.data.message
                })
                storeData('user', res.data.data);
                navigation.replace('MainApp');
            }
        });
    };

    const [provinsi, setProvinsi] = useState([]);
    const [kota, setKota] = useState([]);

    const __getProvinsi = () => {
        axios.get('https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json').then(res => {

            let tmp = [];
            res.data.map(i => {
                tmp.push({
                    label: i.name,
                    value: i.id + '#' + i.name
                })
            });
            console.log(tmp);
            setProvinsi(tmp);
        })
    }


    const __getKota = (x = 11) => {
        axios.get(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${x}.json`).then(res => {

            let tmp = [];
            res.data.map(i => {
                tmp.push({
                    label: i.name,
                    value: i.name
                })
            });
            console.log(tmp);
            setKota(tmp);

        })
    }

    useEffect(() => {
        __getKota();
        __getProvinsi();
        setKirim({
            ...kirim,
            newfoto_user: null,
        });
    }, []);

    const pilihFoto = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.5, includeBase64: true }, res => {
            if (!res.didCancel && res.assets) {
                setKirim({
                    ...kirim,
                    newfoto_user: `data:${res.assets[0].type};base64,${res.assets[0].base64}`
                });
            }
        });
    };

    return (
        <ImageBackground source={require('../../assets/bgsplash.png')} style={styles.container}>
            <MyHeader title='Ubah Profile' />
            <ScrollView contentContainerStyle={styles.wrapper}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                <TouchableOpacity onPress={pilihFoto} style={styles.fotoWrap}>
                    <Image source={{ uri: kirim.newfoto_user !== null ? kirim.newfoto_user : kirim.foto_user }} style={styles.foto} />
                </TouchableOpacity>

                <MyInput label="Nama Lengkap Parents" iconname="person-outline" value={kirim.nama} onChangeText={x => setKirim({ ...kirim, nama: x })} />
                <Text style={styles.label}>Jenis Kelamin</Text>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.radio} onPress={() => setKirim({ ...kirim, kelamin: 'Perempuan' })}>
                        <View style={[styles.radioOuter, kirim.kelamin === 'Perempuan' && styles.radioActive]} />
                        <Text style={styles.radioLabel}>Perempuan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.radio} onPress={() => setKirim({ ...kirim, kelamin: 'Laki-Laki' })}>
                        <View style={[styles.radioOuter, kirim.kelamin === 'Laki-Laki' && styles.radioActive]} />
                        <Text style={styles.radioLabel}>Laki-laki</Text>
                    </TouchableOpacity>
                </View>
                <MyInput label="Nomor Telepon" iconname="call-outline" value={kirim.telepon} onChangeText={x => setKirim({ ...kirim, telepon: x })} />


                <MyPicker
                    label={`Provinsi ( ${kirim.provinsi} )`}
                    iconname="location-outline"
                    value={kirim.provinsi}
                    onChangeText={(val) => {
                        setKirim({ ...kirim, provinsi: val.split("#")[1] });
                        __getKota(val.split("#")[0])
                    }}
                    data={provinsi}
                />
                <MyPicker
                    label={`Kabupatan/Kota ( ${kirim.kota} )`}
                    iconname="business-outline"
                    value={kirim.kota}
                    onChangeText={(val) => setKirim({ ...kirim, kota: val })}
                    data={kota}
                />

                <MyInput label="Email" iconname="mail-outline" value={kirim.email} onChangeText={x => setKirim({ ...kirim, email: x })} />
                <MyInput label="Password" placeholder="Kosongkan jika tidak diubah" iconname="lock-closed-outline" secureTextEntry onChangeText={(x) => setKirim({
                    ...kirim,
                    newpassword: x
                })} />
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
    logo: { width: 200, height: 102, alignSelf: 'center', marginTop: -20 },
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
