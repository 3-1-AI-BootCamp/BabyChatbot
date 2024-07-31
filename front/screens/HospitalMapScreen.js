import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '../themes/ThemeProvider';
import { NAVER_API_KEY_ID, NAVER_API_SECRET } from '@env';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

const HospitalMapScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [hospitals, setHospitals] = useState([]);
    const [region, setRegion] = useState({
        latitude: 37.3595963,
        longitude: 127.1054328,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const response = await fetch(
                `https://naveropenapi.apigw.ntruss.com/map-place/v1/search?query=병원&coordinate=${region.longitude},${region.latitude}&radius=5000`,
                {
                    headers: {
                        'X-NCP-APIGW-API-KEY-ID': NAVER_API_KEY_ID,
                        'X-NCP-APIGW-API-KEY': NAVER_API_SECRET
                    }
                }
            );
            const data = await response.json();

            if (data.status === 'ERROR') {
                throw new Error(data.errorMessage);
            }

            if (data.places && Array.isArray(data.places)) {
                const filteredHospitals = data.places.filter(place => 
                    place.category.includes('병원') || place.category.includes('의원')
                );
                setHospitals(filteredHospitals);
            } else {
                console.warn('No hospital data found');
                setHospitals([]);
            }
        } catch (error) {
            console.error('Error fetching hospital data:', error);
            Alert.alert('오류', '병원 정보를 가져오는데 실패했습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                    <Image
                        style={styles.headerIcon}
                        source={require('../assets/images/back.png')}
                    />
                </TouchableOpacity>
                <View style={styles.iconContainer}>
                    <Image
                        style={styles.icon}
                        source={require('../assets/images/icon.jpg')}
                    />
                </View>
                <View style={styles.headerButton} />
            </View>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={(newRegion) => {
                    setRegion(newRegion);
                    fetchHospitals();
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {hospitals.map((hospital, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: parseFloat(hospital.y),
                            longitude: parseFloat(hospital.x)
                        }}
                        title={hospital.name}
                        description={hospital.category}
                        pinColor={hospital.category.includes('소아') ? "blue" : "red"}
                    />
                ))}
            </MapView>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>근처 병원 찾기</Text>
                <Text style={styles.legendText}>빨간색: 일반 병원, 파란색: 소아과</Text>
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={fetchHospitals}>
                <Text style={styles.searchButtonText}>병원 검색</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        height: hp(8) + StatusBar.currentHeight,
        paddingTop: StatusBar.currentHeight,
    },
    headerButton: {
        padding: wp(2),
        width: wp(10), // 뒤로 가기 버튼의 너비를 고정
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: wp(10),
        height: wp(10),
    },
    map: {
        flex: 1,
    },
    infoContainer: {
        position: 'absolute',
        bottom: hp(12),
        left: wp(5),
        right: wp(5),
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        backgroundColor: '#fff',
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        fontSize: fp(2.5),
        fontWeight: 'bold',
        color: '#000',
    },
    searchButton: {
        position: 'absolute',
        bottom: hp(4),
        left: wp(25),
        right: wp(25),
        backgroundColor: '#0487E2',
        borderRadius: wp(5),
        paddingVertical: hp(1.5),
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: fp(2.5),
        fontWeight: 'bold',
    },
});

export default HospitalMapScreen;
