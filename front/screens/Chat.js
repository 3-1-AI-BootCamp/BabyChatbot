import { View, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, images } from '../constants'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { useTheme } from '../themes/ThemeProvider'
import axios from 'axios';
import { API_KEY } from '@env';

const Chat = ({ navigation }) => {
    const [inputMessage, setInputMessage] = useState('')
    const [outputMessage, setOutputMessage] = useState('')
    
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState([])
    const { colors } = useTheme()


    // 채팅 메시지의 외관을 커스터마이즈
    const renderMessage = (props) => {
        const { currentMessage } = props

        if (currentMessage.user._id === 1) {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            right: {
                                backgroundColor: COLORS.primary,
                                marginRight: 12,
                                marginVertical: 12,
                                borderRadius: 20,
                            },
                        }}
                        textStyle={{
                            right: {
                                color: COLORS.white,
                            },
                        }}
                    />
                </View>
            )
        } else {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end',
                    }}
                >
                    <Image
                        source={images.robot}
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            marginLeft: 8,
                        }}
                    />
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            left: {
                                backgroundColor: COLORS.secondaryWhite,
                                marginLeft: 12,
                                borderRadius: 20,
                            },
                        }}
                        textStyle={{
                            left: {
                                color: COLORS.black,
                            },
                        }}
                    />
                </View>
            )
        }

        return <Bubble {...props} />
    }

    // 텍스트 기반 응답을 생성
    const submitHandler = async () => {
        if (!inputMessage.trim()) return;
    
        setIsTyping(true);
    
        // 사용자 메시지 추가
        const userMessage = {
            _id: Math.random().toString(36).substring(7),
            text: inputMessage,
            createdAt: new Date(),
            user: { _id: 1 },
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, [userMessage]));
    
        try {
            const response = await axios.post('http://192.168.0.5:8080/generate', {
                message: inputMessage
            });
            console.log('Response:', response.data);
            
            // 봇 메시지 추가
            const botMessage = {
                _id: Math.random().toString(36).substring(7),
                text: response.data, // 서버 응답을 텍스트로 사용
                createdAt: new Date(),
                user: { _id: 2, name: 'ChatBot' },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsTyping(false);
            setInputMessage(''); // 입력 필드 초기화
        }
    };

    // 사용잦 입력 값을 inputMessage 상태로 업데이트(input 란에 텍스트가 올라오면 작동)
    const handleInputText = (text) => {
        setInputMessage(text)
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
            }}
        >
            <StatusBar style="auto" />

            <View style={StyleSheet.absoluteFillObject}>
                <Image
                    source={images.robot}
                    style={styles.backgroundImage}
                />
            </View>

            <View
                style={{
                    height: 60,
                    backgroundColor: colors.background,
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 22,
                    width: SIZES.width,
                    zIndex: 9999,
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        height: 40,
                        width: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Save chat')}>
                    <Ionicons
                        name="bookmark-outline"
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <GiftedChat
                    messages={messages}
                    renderInputToolbar={() => {}}
                    user={{ _id: 1 }}
                    minInputToolbarHeight={0}
                    renderMessage={renderMessage}
                    isTyping={isTyping}
                />
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    backgroundColor: colors.background,
                    paddingVertical: 12,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.secondaryGray,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginLeft: 10,
                        backgroundColor: colors.background,
                        paddingVertical: 10,
                        marginHorizontal: 12,
                        borderRadius: 25,
                        borderColor: colors.primary,
                        borderWidth: 1,
                    }}
                >
                    <TextInput
                        value={inputMessage}
                        onChangeText={handleInputText}
                        placeholder="질문을 입력하세요"
                        placeholderTextColor={colors.secondaryGray}
                        style={{
                            color: colors.text,
                            flex: 1,
                            paddingHorizontal: 15,
                            fontSize: 16,
                        }}
                    />

                    <TouchableOpacity
                        onPress={submitHandler}
                        style={{
                            padding: 6,
                            borderRadius: 20,
                            marginRight: 5,
                            backgroundColor: colors.primary,
                        }}
                    >
                        <FontAwesome
                            name="send-o"
                            color={COLORS.white}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    backgroundImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        opacity: 0.2,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -100 }],
    },
})

export default Chat
