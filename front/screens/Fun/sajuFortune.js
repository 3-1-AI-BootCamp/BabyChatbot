import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

const SajuFortune = ({ userData, host, port }) => {
    const [fortune, setFortune] = useState('');

    useEffect(() => {
        fetchFortune();
    }, []);

    const fetchFortune = async () => {
        try {
            const messages = [
                {
                    role: 'user',
                    content: `사주 운세를 제공해주세요. 좋은 쪽으로 해석해주고, 100자 내외로 해주세요. \n이름: ${userData.name}\n성별: ${userData.gender}\n생일: ${userData.birthDate}`
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
            console.error('Error fetching Saju fortune:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.contentText}>사주 운세</Text>
            {userData && (
                <View>
                    <Text style={styles.contentText}>이름: {userData.name}</Text>
                    <Text style={styles.contentText}>성별: {userData.gender}</Text>
                    <Text style={styles.contentText}>생일: {userData.birthDate}</Text>
                    <Text style={styles.contentText}>{fortune}</Text>
                </View>
            )}
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

export default SajuFortune;
