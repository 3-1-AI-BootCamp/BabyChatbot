import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserLocation } from '../utils/locationUtils';
import { getHospital, getMedicalInfo, getBabyProduct, getTag } from '../utils/apiUtils';
import { GiftedChat } from 'react-native-gifted-chat';
import { exampleQuestions, badwords } from '../constants';
import { host, port } from '@env';

// 사용자 대화 챗 관리
const useChat = (navigation) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (exampleQuestions && Array.isArray(exampleQuestions)) {
      // 기본 메시지 설정
      const initialMessages = [
        {
          _id: 1,
          text: '안녕하세요! 저는 육아에 대한 질문에 답변을 드리는 AI 어시스턴트입니다. 예시 질문 중 하나를 선택하거나 직접 질문을 입력해주세요.',
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        },
        // 예시 질문 리스트
        ...exampleQuestions.map((question, index) => ({
          _id: index + 2,
          text: question,
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
          quickReply: true,
        })),
      ];
      // 메시지 업데이트
      setMessages(initialMessages);
    } else {
      console.error('exampleQuestions 배열을 불러오지 못했습니다.');
    }
    initializeLocation();
  }, []);

  // 채팅 히스토리에 저장
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

  // 대화 종료 시 실행
  const endChat = () => {
    saveChatHistory();
    navigation.goBack();
  };

  // 현재 위치 받아오고 업데이트
  const initializeLocation = async () => {
    const location = await getUserLocation();
    setUserLocation(location);
  };

  // 1차 필터링 함수(욕설, 빈값, 너무 긴 값을 필터링)
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

  // 텍스트 처리 함수
  const generateText = async (question = inputMessage) => {
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: question,
      createdAt: new Date(),
      user: { _id: 1 },
    };
  
    setMessages((previousMessages) => GiftedChat.append(previousMessages, [message]));
  
    // 1차 필터링에서 걸렸을 경우 대답 종료
    const filterResult = performFirstFilter(question);
    if (!filterResult.isValid) {
      console.log("1차 필터링 실패");
      const errorMsg = {
        _id: Math.random().toString(36).substring(7),
        text: filterResult.errorMessage,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' }, // 오류 메시지에 user 설정
      };
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [errorMsg]));
      setInputMessage('');
      return;
    }
  
    // 타이핑 중 상태로 변경
    setIsTyping(true);
  
    // 각 태그 별 처리
    try {
      // 태그 분류 모델을 통해 대화에서 태그 분류
      const { tags } = await getTag(question, host, port);
      console.log('Tags:', tags);
  
      let botMessage;

      // 3개의 태그와 기타 태그 별 처리
      if (tags.includes('병원')) {
        botMessage = await getHospital(userLocation, question, host, port);
      } else if (tags.includes('아기 용품')) {
        botMessage = await getBabyProduct(question);
      } else if (tags.includes('육아 의학 상담')) {
        botMessage = await getMedicalInfo(question, host, port);
      } else { // 태그가 "기타" 일 경우 이쪽으로 빠짐
        botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: "죄송합니다. 해당 질문에 대한 정보를 찾을 수 없습니다.",
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };
      }
  
      botMessage._id = Math.random().toString(36).substring(7);
      console.log("BotMessage: ", botMessage);

      //메시지 칸 비우기
      setIsTyping(false);

      // 메시지 화면에 출력
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [botMessage]));
  
      // 히스토리 업데이트
      saveChatHistory();
    } catch (error) {
      // 에러가 났을 경우 메시지 칸 비우고 에러 메시지 화면에 출력
      console.error("Error generating response:", error);
      setIsTyping(false);
      const errorMessage = {
        _id: Math.random().toString(36).substring(7),
        text: "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.",
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [errorMessage]));
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
