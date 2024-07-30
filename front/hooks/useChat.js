import { useState, useEffect } from 'react';
import { getUserLocation } from '../utils/locationUtils';
import { searchNearbyHospitals, generateGPTResponse } from '../utils/apiUtils';
import { GiftedChat } from 'react-native-gifted-chat';
import { exampleQuestions } from '../constants';

const useChat = () => {
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

  const initializeLocation = async () => {
    const location = await getUserLocation();
    setUserLocation(location);
  };

  const isHospitalRelatedQuery = (query) => {
    const keywords = ['병원', '의원', '클리닉', '응급실', '소아과', '내과', '외과'];
    return keywords.some(keyword => query.includes(keyword));
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
      let response;
      if (isHospitalRelatedQuery(question)) {
        response = await searchNearbyHospitals(userLocation);
      } else {
        response = await generateGPTResponse(question);
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
  };
};

export default useChat;
