import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { useTheme } from '../themes/ThemeProvider';
import { COLORS, images } from '../constants';
import { API_KEY, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from '@env';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

const Chat = ({ navigation }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('Results should be shown here.');
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

  const generateImages = () => {
    setIsTyping(true);
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1 },
    };

    setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]));

    fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt: inputMessage,
        n: 1,
        size: '1024x1024',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.data || !data.data[0] || !data.data[0].url) {
          throw new Error('Invalid API response');
        }

        setInputMessage('');
        setOutputMessage(data.data[0].url);
        setIsTyping(false);

        data.data.forEach((item) => {
          const message = {
            _id: Math.random().toString(36).substring(7),
            text: 'Image',
            createdAt: new Date(),
            user: { _id: 2, name: 'ChatGPT' },
            image: item.url,
          };

          setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]));
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsTyping(false);
      });
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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        <View style={styles.topBox}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarButton}>
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