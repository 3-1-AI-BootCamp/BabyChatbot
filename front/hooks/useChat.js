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
      const response = await generateGPTResponse(question, true);
      console.log('Response:', response);
      const { text, tags } = response;

      let botMessage;
      if (tags.includes('병원 위치')) {
        const hospitalLocationInfo = await searchNearbyHospitals(userLocation);
        botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: hospitalLocationInfo,
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };
      } else if (tags.includes('병원')) {
        // Medical info response
        const hispitalInfo = await generateGPTResponse(`병원에 관한 얘기를 해주세요: ${question}`);
        botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: hispitalInfo,
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };
      } else if (tags.includes('의학 정보')) {
        // Medical info response
        const medicalInfo = await generateGPTResponse(`의학 정보에 대해 설명해주세요: ${question}`);
        botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: medicalInfo,
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };
      } else if (tags.includes('아이 태몽')) {
        // Saju response
        const TaemongInfo = await generateGPTResponse(`아이 태몽에 대해 설명해주세요: ${question}`);
        botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: TaemongInfo,
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };
      }
        else if (tags.includes('아이 사주')) {
          // Saju response
          const sajuInfo = await generateGPTResponse(`아이 사주에 대해 설명해주세요: ${question}`);
          botMessage = {
            _id: Math.random().toString(36).substring(7),
            text: sajuInfo,
            createdAt: new Date(),
            user: { _id: 2, name: 'ChatGPT' },
          };
      } else if (tags.includes('아이 별자리')) {
        // Horoscope response
        const horoscopeInfo = await generateGPTResponse(`아이 별자리에 대해 설명해주세요: ${question}`);
        botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: horoscopeInfo,
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };
      } else if (tags.includes('부모 고민 상담')) {
        // Parenting advice response
        const advice = await generateGPTResponse(`해당 고민에 대해 상담해주세요: ${question}`);
        botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: advice,
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };
      } else {
        botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: text,
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };
      }

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
