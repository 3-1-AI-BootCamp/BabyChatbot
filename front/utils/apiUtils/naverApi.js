import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from '@env';

export const searchNearbyHospitals = async (userLocation) => {
  if (!userLocation) {
    return '위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.';
  }

  const { latitude, longitude } = userLocation;
  const url = `https://naveropenapi.apigw.ntruss.com/map-place/v1/search?query=병원&coordinate=${longitude},${latitude}&radius=2000`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
      },
    });
    const data = await response.json();
    console.log('Response:', data);
    
    if (data.places && data.places.length > 0) {
      const hospitals = data.places.slice(0, 3).map(item => `${item.name} (${item.road_address})`).join('\n');
      return `근처에 있는 병원 정보입니다:\n\n${hospitals}`;
    } else {
      return '근처에 병원을 찾을 수 없습니다.';
    }
  } catch (error) {
    console.error('Error fetching nearby hospitals:', error);
    return '병원 정보를 가져오는 중 오류가 발생했습니다.';
  }
};
