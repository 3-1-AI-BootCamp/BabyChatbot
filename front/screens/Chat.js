import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { useTheme } from '../themes/ThemeProvider';
import { API_KEY, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from '@env';
import { COLORS, images } from '../constants';
import * as Location from 'expo-location';

const Chat = ({ navigation }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
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
    getUserLocation();
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

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
  };

  const isHospitalRelatedQuery = (query) => {
    const keywords = ['병원', '의원', '클리닉', '응급실', '소아과', '내과', '외과'];
    return keywords.some(keyword => query.includes(keyword));
  };

  const searchNearbyHospitals = async () => {
    if (!userLocation) {
      return '위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.';
    }
  
    const { latitude, longitude } = userLocation;
    const url = `https://openapi.naver.com/v1/search/local.json?query=병원&coordinate=${longitude},${latitude}&radius=2000`;
  
    try {
      const response = await fetch(url, {
        headers: {
          'X-Naver-Client-Id': NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
        },
      });
      const data = await response.json();
      console.log(data);
      
      if (data.items && data.items.length > 0) {
        const hospitals = data.items.slice(0, 3).map(item => `${item.title} (${item.roadAddress})`).join('\n');
        return `근처에 있는 병원 정보입니다:\n\n${hospitals}`;
      } else {
        return '근처에 병원을 찾을 수 없습니다.';
      }
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
      return '병원 정보를 가져오는 중 오류가 발생했습니다.';
    }
  };

  const generateText = async (question = inputMessage) => {
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
  
    let response;
    try {
      if (isHospitalRelatedQuery(question)) {
        response = await searchNearbyHospitals();
      } else {
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
          console.log('API Response:', data);
  
          if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error("Invalid API response");
          }
  
          console.log(data.choices[0].message.content);
          setInputMessage('');
  
          const botMessage = {
            _id: Math.random().toString(36).substring(7),
            text: data.choices[0].message.content.trim(),
            createdAt: new Date(),
            user: { _id: 2, name: 'ChatGPT' },
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
        const data = await gptResponse.json();
      response = data.choices[0].message.content.trim();
    }

    const botMessage = {
      _id: Math.random().toString(36).substring(7),
      text: response,
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };

    setIsTyping(false);
    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, [botMessage])
    );
  } catch (error) {
    console.error("Error generating response:", error);
    setIsTyping(false);
    // 에러 메시지를 사용자에게 보여줄 수 있습니다.
    const errorMessage = {
      _id: Math.random().toString(36).substring(7),
      text: "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.",
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, [errorMessage])
    );
  }
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

export default Chat;
