import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, API_KEY } from '@env';

export const searchNearbyHospitals = async (userLocation) => {
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

export const generateGPTResponse = async (question) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
    });
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching GPT response:", error);
    throw error;
  }
};