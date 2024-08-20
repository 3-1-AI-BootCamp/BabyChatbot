import { host, port } from '@env';
import { extractLocationAndHospital, createResponse } from './utils';
import { openMap } from '../mapUtils';

export const handleDirectionsRequest = async (question, userLocation) => {
    try {
      const { location, hospitalName } = extractLocationAndHospital(question);
  
      if (!hospitalName) {
        throw new Error('병원 이름이 필요합니다.');
      }
  
      const requestBody = {
        요양기관명: hospitalName,
      };
      if (location) requestBody["지역"] = location;
  
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
  
      if (!searchData || searchData.length === 0) {
        throw new Error(`"${hospitalName}"에 대한 검색 결과가 없습니다.`);
      }
  
      const hospital = searchData[0];
  
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${hospital.좌표.Y},${hospital.좌표.X}&dirflg=d`;
  
      console.log('Directions URL:', directionsUrl);
      openMap(directionsUrl);
  
      return createResponse(`"${hospital.요양기관명}"까지의 길찾기를 시작합니다. 주소: ${hospital.주소}. 지도를 확인해주세요.`);
    } catch (error) {
      console.error('Directions Request Error:', error);
      return createResponse(`길찾기 정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
    }
  };