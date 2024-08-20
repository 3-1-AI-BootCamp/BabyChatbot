import { host, port } from '@env';
import { extractLocationAndHospital, createResponse, getNearbyHospitals } from './utils';

export const handleHospitalInfo = async (question, userLocation, hospitalType) => {
    const { location, hospitalName } = extractLocationAndHospital(question);
    
    if (hospitalName) {
      try {
        const searchUrl = `http://${host}:${port}/api/search`;
        const requestBody = {
          요양기관명: hospitalName,
        };
        if (location) requestBody["지역"] = location;
        
        const searchResponse = await fetch(searchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
  
        const searchData = await searchResponse.json();
  
        if (searchData && searchData.length > 0) {
          const { 요양기관명, 종별코드명, 주소, 전화번호, 병원홈페이지, 진료과목 } = searchData[0];
  
          let responseText = `${요양기관명}은(는) ${종별코드명}에 속하며,`;
  
          if (주소 && 주소.trim() !== '') {
            responseText += ` 주소는 ${주소}입니다.`;
          }
          if (전화번호 && 전화번호.trim() !== '') {
            responseText += ` 전화번호는 ${전화번호}입니다.`;
          }
          if (병원홈페이지 && 병원홈페이지.trim() !== '') {
            responseText += ` 병원 홈페이지는 ${병원홈페이지}입니다.`;
          }
          if (진료과목 && 진료과목.length > 0) {
            responseText += ` 주요 진료 과목은 ${진료과목.join(', ')}입니다.`;
          }
  
          return createResponse(responseText);
        } else {
          throw new Error(`${hospitalName}에 대한 정보를 찾을 수 없습니다.`);
        }
      } catch (error) {
        console.error('Hospital Search Error:', error);
        return createResponse(`병원 정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
      }
    } else {
      return await getNearbyHospitals(userLocation, hospitalType);
    }
  };