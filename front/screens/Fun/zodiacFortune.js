import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { GOOGLE_API_KEY } from '@env';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

// 별자리 운세 처리
const ZodiacFortune = ({ birthDate }) => {
    const [fortune, setFortune] = useState('');
    const [translatedFortune, setTranslatedFortune] = useState('');

    useEffect(() => {
        fetchFortune();
    }, []);

    // 생년월일을 통해 별자리를 구함
    const getZodiacSign = (birthDate) => {
        const date = new Date(birthDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        
        if ((month === 1 && day <= 19) || (month === 12 && day >= 22)) return 'capricorn';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    };

    // ohmanda.com에서 별자리 별 운세를 가져오는 함수
    const fetchFortune = async () => {
        try {
            const zodiacSign = getZodiacSign(birthDate);
            const response = await axios.get(`https://ohmanda.com/api/horoscope/${zodiacSign}/`);

            // 운세 받아옴
            setFortune(response.data.horoscope);

            // 그 운세를 한국어로 번역
            fetchTranslation(response.data.horoscope);
        } catch (error) {
            console.error('Error fetching zodiac fortune:', error);
        }
    };

    // 구글 번역 API를 이용해 영어로 된 운세를 한국어로 번역하는 함수
    const fetchTranslation = async (text) => {
        try {
            const response = await axios.post(
                'https://translation.googleapis.com/language/translate/v2',
                {},
                {
                    params: {
                        q: text,
                        target: 'ko',
                        key: `${GOOGLE_API_KEY}`
                    },
                }
            );
            setTranslatedFortune(response.data.data.translations[0].translatedText);
        } catch (error) {
            console.error('Error translating text:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.textWrapper}>
                <Text style={styles.contentText}>별자리 운세</Text>
            </View>
            <View style={styles.textWrapper}>
                <Text style={styles.contentText}>{translatedFortune || fortune}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        width: '100%',
    },
    textWrapper: {
        width: '100%',
        backgroundColor: '#f0f8ff',
        paddingHorizontal: wp(10),
    },
    contentText: {
        fontSize: fp(2.5),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
});

export default ZodiacFortune;
