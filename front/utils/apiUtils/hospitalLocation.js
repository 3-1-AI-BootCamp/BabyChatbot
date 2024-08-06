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
    const gptResponse = await getGPTResponse(question);

    // 근처 병원 정보 가져오기
    const { latitude, longitude } = userLocation;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=3000&type=hospital&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    
    let hospitalInfo = '';
    if (data.results && data.results.length > 0) {
      const hospitals = data.results.slice(0, 3).map(item => `${item.name} (${item.vicinity})`).join('\n');
      hospitalInfo = `\n\n근처에 있는 병원 정보입니다:\n${hospitals}`;
    } else {
      hospitalInfo = '\n\n근처에 병원을 찾을 수 없습니다.';
    }

    return {
      _id: Math.random().toString(36).substring(7),
      text: gptResponse + hospitalInfo,
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
  당신은 육아 및 의료 전문가입니다. 병원과 관련된 질문에 대해 다음과 같이 답변해주세요:
  1. 질문에 대한 간단한 답변을 제공하세요.
  2. 필요한 경우 병원 방문의 중요성을 설명하세요.
  3. 예방접종이나 특정 진료에 대한 일반적인 정보를 제공하세요.
  답변은 100자 이내로 작성해주세요. 단, 사용자가 원할 경우 답변을 더 길게 제공해도 됩니다.
  어조는 친절하고 전문적이어야 합니다.
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
  return data.choices[0].message.content.trim();
};