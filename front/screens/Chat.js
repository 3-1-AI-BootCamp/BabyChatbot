import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { useTheme } from '../themes/ThemeProvider';
import { COLORS, images } from '../constants';
import { API_KEY } from '@env';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ navigation, route }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('Results should be shown here.');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const { colors } = useTheme();

  const exampleQuestions = [
    "수면교육에 대해 알려주세요",
    "근처 소아과 병원을 어떻게 찾을 수 있나요?",
    "모유수유의 장점은 무엇인가요?",
    "6개월 아기의 발달단계는 어떤가요?"
  ];

  useEffect(() => {
    const loadSavedChat = async () => {
      const savedChatData = route.params?.savedChatData;
      if (savedChatData) {
        setMessages(savedChatData.messages);
      } else {
        const initialMessages = [
          {
            _id: 1,
            text: '안녕하세요! 저는 육아에 대한 질문에 답변을 드리는 AI 어시스턴트입니다. 위에 있는 예시 질문 중 하나를 선택하거나 직접 질문을 입력해주세요.',
            createdAt: new Date(),
            user: { _id: 2, name: 'ChatGPT' },
          },
          ...exampleQuestions.map((question, index) => ({
            _id: index + 2,
            text: question,
            createdAt: new Date(),
            user: { _id: 2, name: 'ChatGPT' },
            quickReply: true,
          })),
        ];
        setMessages(initialMessages);
      }
    };

    loadSavedChat();
  }, [route.params?.savedChatData]);

  const renderMessage = (props) => {
    const { currentMessage } = props;
  
    if (currentMessage.quickReply) {
      return (
        <View style={styles.exampleQuestionContainer}>
          <TouchableOpacity 
            style={styles.exampleQuestionButton}
            onPress={() => handleQuickReply(currentMessage.text)}
          >
            <Text style={styles.exampleQuestionText}>{currentMessage.text}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
    if (currentMessage.user._id === 1) {
      return (
        <View style={styles.rightMessage}>
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: COLORS.primary,
                borderRadius: 20,
                padding: 8,
              },
            }}
            textStyle={{
              right: {
                color: COLORS.white,
                fontSize: 16,
              },
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.leftMessage}>
          <Image source={images.robot} style={styles.robotIcon} />
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#ADD8E6',
                borderRadius: 20,
                padding: 8,
              },
            }}
            textStyle={{
              left: {
                color: '#000000',
                fontSize: 16,
              },
            }}
          />
        </View>
      );
    }
  };
  
  const handleQuickReply = (question) => {
    setInputMessage('');
    generateText(question);
  };

  const generateText = (question = inputMessage) => {
    setIsTyping(true);
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: question,
      createdAt: new Date(),
      user: { _id: 1 },
    };

    setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]));

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Invalid API response');
        }

        setInputMessage('');
        setOutputMessage(data.choices[0].message.content.trim());

        const botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: data.choices[0].message.content.trim(),
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };

        setIsTyping(false);
        setMessages((previousMessage) => GiftedChat.append(previousMessage, [botMessage]));
        saveChatHistory(); // 새 메시지가 추가될 때마다 채팅 내용 저장
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsTyping(false);
      });
  };

  const generateImages = () => {
    // ... (이미지 생성 코드는 그대로 유지)
  };

  const submitHandler = () => {
    if (inputMessage.toLowerCase().startsWith('generate image')) {
      generateImages();
    } else {
      generateText();
    }
  };

  const handleInputText = (text) => {
    setInputMessage(text);
  };

  const saveChatHistory = async () => {
    try {
      const chatHistory = JSON.stringify(messages);
      const timestamp = new Date().toISOString();
      const key = `chat_${timestamp}`;
      await AsyncStorage.setItem(key, chatHistory);
      console.log('Chat history saved successfully with key:', key);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const endChat = () => {
    saveChatHistory();
    navigation.goBack();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        <View style={styles.topBox}>
          <TouchableOpacity onPress={endChat} style={styles.topBarButton}>
            <Image source={require("../assets/images/back.png")} style={styles.icon} />
          </TouchableOpacity>
          <View style={styles.babyLogo}>
            <Image source={require("../assets/images/icon.jpg")} style={styles.icon1} />
          </View>
          <TouchableOpacity onPress={() => console.log('Save chat')} style={styles.topBarButton}>
            <Image source={require("../assets/images/list.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.chatContent}>
          <GiftedChat
            messages={messages}
            renderInputToolbar={() => {}}
            user={{ _id: 1 }}
            minInputToolbarHeight={0}
            renderMessage={renderMessage}
            isTyping={isTyping}
          />
        </View>

        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <TextInput
              value={inputMessage}
              onChangeText={handleInputText}
              placeholder="질문을 입력하세요"
              placeholderTextColor={colors.secondaryGray}
              style={styles.input}
            />
            <TouchableOpacity onPress={submitHandler} style={styles.sendButton}>
              <FontAwesome name="send-o" color={COLORS.white} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  topBox: {
    width: '100%',
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: '#d3ebff',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 24,
  },
  babyLogo: {
    flex: 1,
    alignItems: 'center',
  },
  icon1: {
    width: 40,
    height: 40,
  },
  chatContent: {
    flex: 1,
    paddingTop: 10,
  },
  rightMessage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  leftMessage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  robotIcon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  inputBar: {
    flexDirection: 'row',
    backgroundColor: '#f0f8ff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondaryGray,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    marginHorizontal: 12,
    borderRadius: 25,
    borderColor: '#0487e2',
    borderWidth: 1,
    alignItems: 'center',
  },
  input: {
    color: COLORS.black,
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    padding: 6,
    borderRadius: 20,
    marginRight: 5,
    backgroundColor: '#0487e2',
  },
  exampleQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 5,
    marginRight: 10,
  },
  exampleQuestionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 10,
    maxWidth: '80%',
  },
  exampleQuestionText: {
    color: COLORS.white,
    fontSize: 16,
  },
  rightMessage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    marginRight: 10,
  },
});

export default Chat;