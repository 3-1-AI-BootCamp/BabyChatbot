import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, TouchableOpacity, Alert, ScrollView, Linking, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '../themes/ThemeProvider';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { images } from '../constants';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

// 근처 병원 찾기 화면
const HospitalMapScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [hospitals, setHospitals] = useState([]);
    const [nearbyHospitals, setNearbyHospitals] = useState([]);
    const [region, setRegion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    // 현재 위치를 가져오는 함수
    const getCurrentLocation = async () => {
        try {
            // 위치 접근 권한 요청
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Permission to access location was denied');
                return;
            }

            // 현재 위치 정보 가져오기
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            const newRegion = {
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };

            // 지역 상태 업데이트
            setRegion(newRegion);

            // 병원 정보 가져오기
            fetchHospitals(latitude, longitude);
        } catch (error) {
            console.error('Error getting current location:', error);
            Alert.alert('오류', '현재 위치를 가져오는데 실패했습니다.');
        }
    };

    // 특정 위치 주변 병원을 가져오는 함수
    const fetchHospitals = async (latitude, longitude) => {
        try {
            // 병원 정보를 Google Places API로부터 가져옴
            console.log('Fetching hospitals...');
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=10000&type=hospital&keyword=소아과&language=ko&key=${GOOGLE_MAPS_API_KEY}`;
            console.log('API URL:', url);

            const response = await fetch(url);
            const data = await response.json();
            console.log('API Response Status:', data.status);
            console.log('API Response Results:', data.results ? data.results.length : 'No results');

            if (data.status !== 'OK') {
                throw new Error(data.error_message || `API Error: ${data.status}`);
            }

            if (!data.results || data.results.length === 0) {
                console.log('No pediatric hospitals found');
                setHospitals([]);
                setNearbyHospitals([]);
                Alert.alert('알림', '주변에 소아과를 찾지 못했습니다.');
                return;
            }

            const hospitalPromises = data.results.map(hospital => getHospitalDetails(hospital.place_id));
            const detailedHospitals = await Promise.all(hospitalPromises);
            const filteredHospitals = detailedHospitals.filter(hospital => 
                hospital && hospital.formatted_phone_number && hospital.opening_hours
            );

            console.log('Filtered Hospitals:', filteredHospitals.length);

            // 병원 정보를 상태로 저장
            setHospitals(filteredHospitals);

            // 상위 3개 병원 표시
            setNearbyHospitals(filteredHospitals.slice(0, 3));
        } catch (error) {
            console.error('Error fetching hospital data:', error);
            Alert.alert('오류', `병원 정보를 가져오는데 실패했습니다: ${error.message}`);
        }
    };

    // 특정 병원의 세부 정보를 가져오는 함수
    const getHospitalDetails = async (placeId) => {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,opening_hours,geometry,vicinity&language=ko&key=${GOOGLE_MAPS_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error fetching hospital details:', error);
            return null;
        }
    };

    // 현재 지도 영역 내 병원을 검색하는 함수
    const searchNearbyHospitals = async () => {
        if (!region) {
          Alert.alert('알림', '지도 영역을 찾을 수 없습니다.');
          return;
        }
      
        setIsLoading(true);
        try {
          const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
          console.log('Searching in region:', region);
      
          const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${Math.min(latitudeDelta, longitudeDelta) * 111000}&type=hospital&keyword=소아과&language=ko&key=${GOOGLE_MAPS_API_KEY}`;
          
          const response = await fetch(url);
          const data = await response.json();
      
          if (data.status === 'ZERO_RESULTS') {
            setHospitals([]);
            setNearbyHospitals([]);
            Alert.alert('알림', '현재 지도 영역에서 소아과를 찾지 못했습니다.');
            return;
          }
      
          if (data.status !== 'OK') {
            throw new Error(data.error_message || `API Error: ${data.status}`);
          }
      
          const hospitalPromises = data.results.map(hospital => getHospitalDetails(hospital.place_id));
          const detailedHospitals = await Promise.all(hospitalPromises);
          const filteredHospitals = detailedHospitals.filter(hospital => 
            hospital && hospital.formatted_phone_number && hospital.opening_hours
          );
      
          setHospitals(filteredHospitals);
          
          // 상위 3개 병원 표시
          setNearbyHospitals(filteredHospitals.slice(0, 3));
      
          if (filteredHospitals.length === 0) {
            Alert.alert('알림', '현재 지도 영역에서 소아과를 찾지 못했습니다.');
          }
        } catch (error) {
          console.error('Error fetching hospital data:', error);
          Alert.alert('오류', '병원 정보를 가져오는데 문제가 발생했습니다. 다시 시도해주세요.');
        } finally {
          setIsLoading(false);
        }
      };

    //현재 위치로 지도를 이동시키는 함수
    const moveToCurrentLocation = async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('권한 거부', '위치 접근 권한이 거부되었습니다.');
            return;
          }
      
          let location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.025,  // 더 작은 값으로 설정하여 확대
            longitudeDelta: 0.025, // 더 작은 값으로 설정하여 확대
          };
      
          setRegion(newRegion);
          
          // 지도 이동 애니메이션
          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          } else {
            console.error('Map reference is not available');
          }
      
          console.log('Moving to:', newRegion);
        } catch (error) {
          console.error('현재 위치를 가져오는 중 오류 발생:', error);
          Alert.alert('오류', '현재 위치를 가져오는데 실패했습니다.');
        }
      };

    if (!region) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            )}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                    <Image
                        style={styles.headerIcon}
                        source={images.back}
                    />
                </TouchableOpacity>
                <View style={styles.iconContainer}>
                    <Image
                        style={styles.icon}
                        source={images.icon}
                    />
                </View>
                <View style={styles.headerButton} />
            </View>
            <MapView
                ref={mapRef}
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                showsCompass={false}
                
            >
                {hospitals.map((hospital, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: hospital.geometry.location.lat,
                            longitude: hospital.geometry.location.lng
                        }}
                        title={hospital.name}
                        description={hospital.vicinity}
                    />
                ))}
            </MapView>
            <TouchableOpacity 
                style={styles.currentLocationButton} 
                onPress={moveToCurrentLocation}
            >
                <MaterialIcons name="my-location" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.currentLocationButton} onPress={moveToCurrentLocation}>
                <MaterialIcons name="my-location" size={24} color="black" />
            </TouchableOpacity>
            <ScrollView style={styles.infoContainer}>
                <Text style={styles.infoText}>근처 소아과</Text>
                {nearbyHospitals.length > 0 ? (
                    nearbyHospitals.map((hospital, index) => (
                        <View key={index} style={styles.hospitalInfo}>
                            <Text style={styles.hospitalName}>{hospital.name}</Text>
                            <Text style={styles.hospitalAddress}>{hospital.vicinity}</Text>
                            <Text style={styles.hospitalPhone}>{hospital.formatted_phone_number}</Text>
                            <Text style={styles.hospitalHours}>
                                {hospital.opening_hours.weekday_text[0]}
                            </Text>
                            <TouchableOpacity onPress={() => Linking.openURL(`tel:${hospital.formatted_phone_number}`)}>
                                <Text style={styles.callButton}>전화 걸기</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noHospitalsText}>표시할 소아과가 없습니다.</Text>
                )}
            </ScrollView>
            <TouchableOpacity style={styles.searchButton} onPress={searchNearbyHospitals}>
                <Text style={styles.searchButtonText}>소아과 검색</Text>
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
        width: wp(10),
    },
    headerIcon: {
        width: wp(6),
        height: wp(6),
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
    currentLocationButton: {
        position: 'absolute',
        top: hp(15),
        right: wp(5),
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 30,
        elevation: 5,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    infoContainer: {
        position: 'absolute',
        bottom: hp(12),
        left: wp(5),
        right: wp(5),
        maxHeight: hp(30),
        backgroundColor: '#fff',
        borderRadius: wp(5),
        padding: wp(4),
    },
    infoText: {
        fontSize: fp(2.5),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: hp(1),
    },
    hospitalInfo: {
        marginBottom: hp(2),
    },
    hospitalName: {
        fontSize: fp(2),
        fontWeight: 'bold',
    },
    hospitalAddress: {
        fontSize: fp(1.8),
        color: '#666',
    },
    hospitalPhone: {
        fontSize: fp(1.8),
        color: '#0066cc',
        marginTop: hp(0.5),
    },
    hospitalHours: {
        fontSize: fp(1.8),
        color: '#666',
        marginTop: hp(0.5),
    },
    noHospitalsText: {
        fontSize: fp(2),
        color: '#666',
        textAlign: 'center',
        marginTop: hp(2),
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
    callButton: {
        fontSize: fp(1.8),
        color: '#007AFF',
        marginTop: hp(1),
        textDecorationLine: 'underline',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
    },
});

export default HospitalMapScreen;