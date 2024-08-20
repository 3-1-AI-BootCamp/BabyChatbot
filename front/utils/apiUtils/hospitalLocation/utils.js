import { GOOGLE_MAPS_API_KEY, API_KEY } from '@env';

export const extractLocationAndHospital = (question) => {
    const locations = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
    let location = null;
    let hospitalName = null;
  
    // 지역 추출
    for (let loc of locations) {
      if (question.includes(loc)) {
        location = loc;
        break;
      }
    }
  
    // 병원 이름 추출
    const hospitalMatch = question.match(/([가-힣\s]+(?:병원|의원|의료원|치과|보건진료소|보건지소))/);
    if (hospitalMatch) {
      hospitalName = hospitalMatch[0];
    }
  
    return { location, hospitalName };
  };
  

export const getNearbyHospitals = async (userLocation, hospitalType) => {
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.latitude},${userLocation.longitude}&radius=5000&type=hospital&keyword=${encodeURIComponent(hospitalType)}&key=${GOOGLE_MAPS_API_KEY}`;
    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();
  
    if (placesData.status === 'OK' && placesData.results.length > 0) {
      return placesData.results.slice(0, 3);
    }
    return [];
};
  

export const createResponse = (text) => ({
    _id: Math.random().toString(36).substring(7),
    text,
    createdAt: new Date(),
    user: { _id: 2, name: 'ChatGPT' },
  });

export const getGPTResponse = async (question, hospitalType) => {
    // 병 전용 프롬프트
    const commonPrompt = `
    당신은 병원 정보 제공 전문가입니다. 질문자는 12개월 된 아이의 보호자입니다.
    답변은 한국어로만 알기 쉽게 작성해주세요.
    현재 질문에 대해 ${hospitalType}와 관련된 간단하고 명확한 답변을 제공해주세요.
    현재 상태에 대한 간단한 평가를 포함하세요.
    답변은 되도록 100자를 넘지 않도록 하되, 유저의 요청에 따라 넘을 수 있습니다.
    병원 방문의 중요성과 필요성에 대해 설명하세요.
    특정 진료나 의료 서비스에 대한 일반적인 정보를 제공하세요.
    마무리에 부모를 안심시킬 수 있는 문장을 포함해주세요.
    마지막 문장이 반드시 "근처의 병원을 알려드리겠습니다."로 끝나도록 답변을 작성하세요.
    `;
  
    // 프롬프트 선택에 따라 GPT 응답을 조합
    let finalPrompt = commonPrompt;
  
    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: finalPrompt },
          { role: 'user', content: question },
        ],
      }),
    });
  
    const responseData = await response.json();
    const gptMessage = responseData.choices[0].message.content;
  
    return {
      gptResponse: gptMessage.replace(/NEED_HOSPITAL:.+|HOSPITAL_INFO:.+/g, '').trim(),
    };
  };
  