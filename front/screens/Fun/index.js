import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from '../../themes/ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import SajuFortune from './sajuFortune';
import ZodiacFortune from './zodiacFortune';
import ChineseFortune from './chineseFortune';
import { images } from '../../constants';
import { host, port } from '@env';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

const Fun = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const [selectedTab, setSelectedTab] = useState('zodiacFortune');
    const userData = {
        name: '홍길동',
        gender: '남성',
        birthDate: '1990-04-15',
    };

    useEffect(() => {
        if (route.params?.selectedTab) {
            console.log("Received selectedTab:", route.params.selectedTab);  // 디버깅용
            setSelectedTab(route.params.selectedTab);
        }
    }, [route.params]);

    const renderContent = () => {
        switch (selectedTab) {
            case 'zodiacFortune':
                return <ZodiacFortune birthDate={userData.birthDate} />;
            case 'sajuFortune':
                return <SajuFortune userData={userData} host={host} port={port} />;
            case 'chineseFortune':
                return <ChineseFortune userData={userData} host={host} port={port} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('BottomTabNavigation')}>
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
            <View style={[styles.tabContainer, { backgroundColor: colors.primary }]}>
                <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('zodiacFortune')}>
                    <Text style={styles.tabButtonText}>별자리 운세</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('sajuFortune')}>
                    <Text style={styles.tabButtonText}>사주 운세</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('chineseFortune')}>
                    <Text style={styles.tabButtonText}>십이지 운세</Text>
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
        width: wp(3), // 뒤로 가기 버튼의 너비를 고정
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
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: hp(2),
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