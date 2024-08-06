import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserLocation } from '../utils/locationUtils';
import { getHospital, getConsulting, getMedicalInfo, getBabyProduct, getFortune, getTag, getInfo } from '../utils/apiUtils';
import { GiftedChat } from 'react-native-gifted-chat';
import { exampleQuestions, badwords } from '../constants';
import { host, port } from '@env';

const useChat = (navigation) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (exampleQuestions && Array.isArray(exampleQuestions)) {
      const initialMessages = [
        {
          _id: 1,
          text: '안녕하세요! 저는 육아에 대한 질문에 답변을 드리는 AI 어시스턴트입니다. 예시 질문 중 하나를 선택하거나 직접 질문을 입력해주세요.',
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

  const performFirstFilter = (input) => {
    if (input.trim() === '') {
      return { isValid: false, errorMessage: '질문을 입력해주세요.' };
    }

    if (input.length > 150) {
      return { isValid: false, errorMessage: '질문은 150자 이하로 입력해주세요.' };
    }

    const containsInappropriateWord = badwords.some(word => input.includes(word));
    if (containsInappropriateWord) {
      return { isValid: false, errorMessage: '부적절한 언어가 포함되어 있습니다. 다시 입력해주세요.' };
    }

    return { isValid: true, errorMessage: '' };
  };

  const generateText = async (question = inputMessage) => {
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: question,
      createdAt: new Date(),
      user: { _id: 1 }, // 사용자 메시지에 user 설정
    };
  
    setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]));
  
    const filterResult = performFirstFilter(question);
    if (!filterResult.isValid) {
      console.log("1차 필터링 실패");
      const errorMsg = {
        _id: Math.random().toString(36).substring(7),
        text: filterResult.errorMessage,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' }, // 오류 메시지에 user 설정
      };
      setMessages((previousMessage) => GiftedChat.append(previousMessage, [errorMsg]));
      setInputMessage('');
      return;
    }
  
    setIsTyping(true);
  
    try {
      const { tags } = await getTag(question, host, port);
      let botMessage;
      console.log('Tags:', tags);
  
      if (tags.includes('부모 고민 상담')) {
        botMessage = await getConsulting(question, host, port);
      } else if (tags.includes('병원')) {
        botMessage = await getHospital(userLocation, question, host, port);
      } else if (tags.includes('아기 용품')) {
        botMessage = await getBabyProduct(question, host, port);
      } else if (tags.includes('의학 정보')) {
        botMessage = await getMedicalInfo(question, host, port);
      } else if (tags.includes('태몽')) {
        botMessage = await getFortune('태몽');
      } else if (tags.includes('사주')) {
        botMessage = await getFortune('사주');
      } else if (tags.includes('별자리 운세')) {
        botMessage = await getFortune('별자리 운세');
      } else if (tags.includes('십이지 운세')) {
        botMessage = await getFortune('십이지 운세');
      } else if (tags.includes('육아 보조금') || tags.includes('예방 접종')) {
        botMessage = await getInfo(tags.includes('육아 보조금') ? 'support' : 'vaccination');
      } else {
        botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: "죄송합니다. 해당 질문에 대한 정보를 찾을 수 없습니다.",
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' }, // 기본 응답 메시지에 user 설정
        };
      }
  
      botMessage._id = Math.random().toString(36).substring(7); // Ensure _id is unique
      setIsTyping(false);
      setMessages((previousMessage) => GiftedChat.append(previousMessage, [botMessage]));
      saveChatHistory();
    } catch (error) {
      console.error("Error generating response:", error);
      setIsTyping(false);
      const errorMessage = {
        _id: Math.random().toString(36).substring(7),
        text: "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.",
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' }, // 오류 메시지에 user 설정
      };
      setMessages((previousMessage) => GiftedChat.append(previousMessage, [errorMessage]));
    }
    setInputMessage('');
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
