import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

const ChineseFortune = ({ userData, host, port }) => {
    const [fortune, setFortune] = useState('');

    useEffect(() => {
        fetchFortune();
    }, []);

    const getChineseZodiac = (birthDate) => {
        const year = new Date(birthDate).getFullYear();
        const zodiacs = [
            '쥐', '소', '호랑이', '토끼', '용', '뱀',
            '말', '양', '원숭이', '닭', '개', '돼지'
        ];
        return zodiacs[(year - 4) % 12];
    };

    const fetchFortune = async () => {
        try {
            const chineseZodiac = getChineseZodiac(userData.birthDate);

            const messages = [
                {
                    role: 'user',
                    content: `십이지 운세를 제공해주세요. 좋은 쪽으로 해석해주고, 100자 내외로 해주세요. \n이름: ${userData.name}\n성별: ${userData.gender}\n생일: ${userData.birthDate}\n십이지: ${chineseZodiac}`
                }
            ];
            console.log('messages:', messages);

            const response = await fetch(`http://${host}:${port}/api/llm/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    modelType: 'openai',
                    chatSentence: messages.map(message => message.content).join(' ')
                }),
            });

            const text = await response.text();
            console.log('Response from server:', text);

            // 서버 응답을 바로 fortune 상태에 설정
            setFortune(text);
        } catch (error) {
            console.error('Error fetching Chinese Zodiac fortune:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.contentText}>십이지 운세</Text>
            <Text style={styles.contentText}>{fortune}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    contentText: {
        fontSize: fp(2.5),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        paddingHorizontal: wp(10),
    },
});

export default ChineseFortune;
