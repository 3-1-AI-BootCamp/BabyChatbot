import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserLocation } from '../utils/locationUtils';
import { generateGPTResponse, getHospitalLocation, getConsulting, getMedicalInfo, getHospitalInfo, getSaju, getStar, getTaemong, getTag } from '../utils/apiUtils';
import { GiftedChat } from 'react-native-gifted-chat';
import { exampleQuestions } from '../constants';
import { host, port } from '@env';

const useChat = (navigation) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (exampleQuestions && Array.isArray(exampleQuestions)) {
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
    } else {
      console.error('exampleQuestions 배열을 불러오지 못했습니다.');
    }
    initializeLocation();
  }, []);

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

  const initializeLocation = async () => {
    const location = await getUserLocation();
    setUserLocation(location);
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
  
    try {
      const { tags } = await getTag(question, host, port);
      let botMessage;
      console.log('Tags:', tags);
  
      if (tags.includes('병원 위치')) {
        botMessage = await getHospitalLocation(userLocation);
      } else if (tags.includes('병원')) {
        botMessage = await getHospitalInfo(question, host, port);
      } else if (tags.includes('의학 정보')) {
        botMessage = await getMedicalInfo(question, host, port);
      } else if (tags.includes('아이 태몽')) {
        botMessage = await getTaemong(question, host, port);
      } else if (tags.includes('아이 사주')) {
        botMessage = await getSaju(question, host, port);
      } else if (tags.includes('아이 별자리')) {
        botMessage = await getStar(question, host, port);
      } else if (tags.includes('부모 고민 상담')) {
        botMessage = await getConsulting(question, host, port);
      } else if (tags.includes('엄마들의 답변')) {
        botMessage = await generateGPTResponse(question);
      }else {
        botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: "죄송합니다. 해당 질문에 대한 정보를 찾을 수 없습니다.",
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };
      }
  
      setIsTyping(false);
      setMessages((previousMessage) =>
        GiftedChat.append(previousMessage, [botMessage])
      );
      saveChatHistory();
    } catch (error) {
      console.error("Error generating response:", error);
      setIsTyping(false);
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

  return {
    inputMessage,
    setInputMessage,
    isTyping,
    messages,
    generateText,
    endChat,
  };
};

export default useChat;
