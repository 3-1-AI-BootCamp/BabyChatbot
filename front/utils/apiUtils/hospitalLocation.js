import { GOOGLE_MAPS_API_KEY, API_KEY } from '@env';
export const getHospital = async (userLocation, question, host, port) => {
  if (!userLocation) {
    return {
      _id: Math.random().toString(36).substring(7),
      text: '위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.',
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
  }

  try {
    // GPT로 질문에 대한 답변 얻기
    const { gptResponse, needHospital } = await getGPTResponse(question);

    let finalResponse = gptResponse;

    if (needHospital) {
      // 근처 병원 정보 가져오기
      const { latitude, longitude } = userLocation;
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=3000&type=hospital&key=${GOOGLE_MAPS_API_KEY}`;
  
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const hospitals = data.results.slice(0, 3).map(item => item.name).join(', ');
        finalResponse += `\n\n근처에 있는 병원으로는 ${hospitals}이 있습니다. 특정 병원에 대해 더 자세한 정보가 필요하신가요?`;
      } else {
        finalResponse += '\n\n죄송합니다. 현재 근처에서 영업 중인 병원을 찾을 수 없습니다.';
      }
    }

    return {
      _id: Math.random().toString(36).substring(7),
      text: finalResponse,
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      _id: Math.random().toString(36).substring(7),
      text: '정보를 가져오는 중 오류가 발생했습니다.',
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
  }
};

const getGPTResponse = async (question) => {
  const systemMessage = `
  당신은 병원 정보 제공 전문가입니다. 병원과 관련된 질문에 대해 다음과 같이 답변해주세요:
  1. 질문에 대한 간단하고 명확한 답변을 제공하세요.
  2. 답변은 150자를 넘지 않도록 하되, 질문자의 요청이 있을 경우 넘도록 하세요.
  3. 병원 방문의 중요성과 필요성에 대해 설명하세요.
  4. 특정 진료나 의료 서비스에 대한 일반적인 정보를 제공하세요.
  5. 사용자의 질문에 따라 적절한 병원 유형(예: 소아과, 내과, 응급실 등)을 추천하세요.
  6. 답변의 마지막 줄에 반드시 병원 방문이 필요한지 여부를 명확히 표시하세요. "NEED_HOSPITAL: YES" 또는 "NEED_HOSPITAL: NO"로 표시하세요.
  7. 병원 방문이 필요하지 않고 크게 걱정하지 않아도 될 경우에만 "NEED_HOSPITAL: NO"를 사용하세요.
  8. 증상이 지속될 경우 병원 방문을 권장하는 등 어떤 방식으로든 병원 방문을 권장하는 경우에는 "NEED_HOSPITAL: YES"를 사용하세요.
  답변은 대화 형태로 이어지도록 작성하되, 전문적이고 신뢰할 수 있는 정보를 제공해야 합니다.
  필요한 경우 추가 질문을 통해 더 자세한 정보를 얻을 수 있도록 유도하세요.
  `;

  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: question }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
    }),
  });

  const data = await response.json();
  const gptResponse = data.choices[0].message.content.trim();
  console.log(gptResponse)
  
  // 병원 방문 필요 여부 확인
  const needHospital = gptResponse.includes("NEED_HOSPITAL: YES");
  
  // 키워드 기반 추가 체크
  const keywords = ['병원', '진료', '의사', '응급실', '치료'];
  const additionalCheck = keywords.some(keyword => gptResponse.includes(keyword));
  
  return {
    gptResponse: gptResponse.replace(/NEED_HOSPITAL: (YES|NO)/, '').trim(),
    needHospital: needHospital || additionalCheck
  };
};