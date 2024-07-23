import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { useTheme } from '../themes/ThemeProvider';
import { host, port } from '@env';
import { COLORS, images } from '../constants';

const VectorChat = ({ navigation }) => {
  const [inputMessage, setInputMessage] = useState('');
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
    // 초기 메시지 설정
    const initialMessages = [
      {
        _id: 1,
        text: '안녕하세요! 저는 육아에 대한 질문에 답변을 드리는 AI 어시스턴트입니다. 아래 예시 질문 중 하나를 선택하거나 직접 질문을 입력해주세요.',
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
  }, []);

  const renderMessage = (props) => {
    const { currentMessage } = props;

    if (currentMessage.quickReply) {
      return (
        <TouchableOpacity 
          style={styles.exampleQuestionButton}
          onPress={() => handleQuickReply(currentMessage.text)}
        >
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: COLORS.secondaryWhite,
                borderRadius: 20,
              },
            }}
            textStyle={{
              left: {
                color: COLORS.black,
              },
            }}
          />
        </TouchableOpacity>
      );
    }

    if (currentMessage.user._id === 1) {
      return (
        <View style={styles.userMessageContainer}>
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
      );
    } else {
      return (
        <View style={styles.botMessageContainer}>
          <Image
            source={images.robot}
            style={styles.botAvatar}
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
  
    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, [message])
    );
  
    // 백엔드 API 호출
    fetch(`http://${host}:${port}/api/vectorSearch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    })
      .then((response) => response.json())
      .then((data) => {
        const botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: data.answer,
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatBot' },
        };
  
        setIsTyping(false);
        setMessages((previousMessage) =>
          GiftedChat.append(previousMessage, [botMessage])
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsTyping(false);
      });
  };

  // generateImages 함수는 그대로 유지

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.realIcon}>
          {/* 실제 아이콘 스타일 */}
        </View>
        <TouchableOpacity onPress={() => console.log('Save chat')}>
          <Ionicons name="bookmark-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          renderInputToolbar={() => {}}
          user={{ _id: 1 }}
          minInputToolbarHeight={0}
          renderMessage={renderMessage}
          isTyping={isTyping}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.textInputWrapper}>
          <TouchableOpacity style={styles.plusButton}>
            <Image source={require('../assets/images/plus-icon.svg')} style={styles.plusIcon} />
          </TouchableOpacity>
          <TextInput
            value={inputMessage}
            onChangeText={handleInputText}
            placeholder="질문을 입력하세요"
            placeholderTextColor={colors.secondaryGray}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={submitHandler} style={styles.sendButton}>
            <Image source={require('../assets/images/sending-icon.svg')} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    padding: 10,
  },
  realIcon: {
    // 실제 아이콘 스타일
  },
  topBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  timeText: {
    fontSize: 12,
  },
  wave: {
    // 파도 스타일
  },
  wifi: {
    // 와이파이 스타일
  },
  battery: {
    width: 20,
    height: 20,
  },
  chatContainer: {
    flex: 1,
  },
  userMessageContainer: {
    // 사용자 메시지 스타일
  },
  botMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  quickReplyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  quickReplyButton: {
    backgroundColor: COLORS.secondaryWhite,
    padding: 10,
    borderRadius: 20,
  },
  quickReplyText: {
    color: COLORS.black,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  plusButton: {
    padding: 10,
  },
  plusIcon: {
    width: 20,
    height: 20,
  },
  textInput: {
    flex: 1,
    padding: 10,
  },
  sendButton: {
    padding: 10,
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
  exampleQuestionsContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  exampleQuestionButton: {
    backgroundColor: COLORS.secondaryWhite,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  exampleQuestionText: {
    color: COLORS.black,
  },
  
});

export default VectorChat;
