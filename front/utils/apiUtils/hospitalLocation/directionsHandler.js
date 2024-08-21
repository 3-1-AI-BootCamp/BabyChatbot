import { extractLocationAndHospital, createResponse } from './utils';
import { openMap } from '../mapUtils';

// 만약 길찾기를 원헀다면...
export const handleDirectionsRequest = async (question, userLocation, host, port) => {
    try {
      // 병원 이름과 위치 추출
      const { location, hospitalName } = extractLocationAndHospital(question);
  
      if (!hospitalName) {
        throw new Error('병원 이름이 필요합니다.');
      }
  
      // 병원 이름과 사용자위치를 필수로 제공하고, 질문에서 지역이 추출되었다면 지역도 제공
      const requestBody = {
        요양기관명: hospitalName,
        사용자위치: {
          위도: userLocation.latitude,
          경도: userLocation.longitude,
        },
      };
      if (location) requestBody["지역"] = location;

      console.log('Request Body:', requestBody);
  
      // mongoDB에서 병원 정보를 검색한 후 가져옴(백엔드 처리)
      const searchUrl = `http://${host}:${port}/api/search`;
      const searchResponse = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const searchData = await searchResponse.json();
  
      console.log('Search Data:', searchData);
  
      // 검색 결과가 '0건' 이라면 오류 메시지 출력
      if (!searchData || searchData.length === 0) {
        throw new Error(`"${hospitalName}"에 대한 검색 결과가 없습니다.`);
      }
  
      const hospital = searchData[0];
  
      // 찾은 병원과 현재 위치를 이용한 길찾기 URL 검색
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${hospital.좌표.Y},${hospital.좌표.X}&dirflg=d`;
  
      console.log('Directions URL:', directionsUrl);

      // 길찾기 URL을 이용해 지도 열기
      openMap(directionsUrl);
  
      // 길찾기 시작 메시지 출력
      return createResponse(`"${hospital.요양기관명}"까지의 길찾기를 시작합니다. 주소: ${hospital.주소}. 지도를 확인해주세요.`);
    } catch (error) {
      console.error('Directions Request Error:', error);
      return createResponse(`길찾기 정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
    }
  };