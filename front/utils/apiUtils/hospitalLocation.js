import { GOOGLE_MAPS_API_KEY } from '@env';

export const getHospitalLocation = async (userLocation) => {
  if (!userLocation) {
    return {
      _id: Math.random().toString(36).substring(7),
      text: '위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.',
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
  }

  try {
    const { latitude, longitude } = userLocation;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=3000&type=hospital&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const hospitals = data.results.slice(0, 3).map(item => `${item.name} (${item.vicinity})`).join('\n');
      return {
        _id: Math.random().toString(36).substring(7),
        text: `근처에 있는 병원 정보입니다:\n\n${hospitals}`,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    } else {
      return {
        _id: Math.random().toString(36).substring(7),
        text: '근처에 병원을 찾을 수 없습니다.',
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    }
  } catch (error) {
    console.error('Error fetching nearby hospitals:', error);
    return {
      _id: Math.random().toString(36).substring(7),
      text: '병원 정보를 가져오는 중 오류가 발생했습니다.',
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
  }
};