import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../themes/ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { RAPIDAPI_KEY, RAPIDAPI_HOST } from '@env';  // 환경 변수 가져오기
import { StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

const Fun = () => {
    const { colors } = useTheme();
    const [selectedTab, setSelectedTab] = useState('todayFortune');
    const [fortune, setFortune] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const userData = route.params?.userData;

    useEffect(() => {
        fetchFortune();
    }, [selectedTab]);

    const fetchFortune = async () => {
        setIsLoading(true);
        const options = {
            method: 'GET',
            url: 'https://best-daily-astrology-and-horoscope-api.p.rapidapi.com/api/Detailed-Horoscope/',
            params: { zodiacSign: 'leo' },
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST
            }
        };

        try {
            const response = await axios.request(options);
            if (response.status === 200) {
                const data = response.data;
                setFortune(data.horoscope);
            } else if (response.status === 429) {
                throw new Error('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
            } else {
                throw new Error(`운세 정보를 가져오는 데 실패했습니다. 상태 코드: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching fortune data:', error);
            Alert.alert('오류', error.message);
            setFortune('운세 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <Text style={styles.contentText}>로딩 중...</Text>;
        }
        return (
            <View>
                <Text style={styles.contentText}>{fortune}</Text>
                {userData && (
                    <View>
                        <Text style={styles.contentText}>아기 이름: {userData.kidName}</Text>
                        <Text style={styles.contentText}>성별: {userData.gender}</Text>
                        <Text style={styles.contentText}>생일: {userData.birthDate}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
            <View style={[styles.tabContainer, { backgroundColor: colors.primary }]}>
                <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('zodiacFortune')}>
                    <Text style={styles.tabButtonText}>별자리 운세</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('sajuFortune')}>
                    <Text style={styles.tabButtonText}>사주 운세</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('todayFortune')}>
                    <Text style={styles.tabButtonText}>오늘의 운세</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {renderContent()}
            </View>
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
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: hp(1),
        backgroundColor: '#add8e6',
    },
    tabButton: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(5),
        borderRadius: wp(5),
        backgroundColor: '#0487E2',
    },
    tabButtonText: {
        color: '#fff',
        fontSize: fp(2),
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentText: {
        fontSize: fp(2.5),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        paddingHorizontal: wp(10),
    },
});

export default Fun;
