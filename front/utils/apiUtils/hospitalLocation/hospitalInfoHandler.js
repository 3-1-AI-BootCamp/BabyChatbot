import { host, port } from '@env';
import { extractLocationAndHospital, createResponse } from './utils';

export const handleHospitalInfo = async (question, userLocation, hospitalType) => {
  const { location, hospitalName } = await extractLocationAndHospital(question);
  console.log("Location: ", location);
  console.log("Hospital Name: ", hospitalName);

  try {
    const searchUrl = `http://${host}:${port}/api/search`;
    const requestBody = {
      사용자위치: {
        위도: userLocation.latitude,
        경도: userLocation.longitude,
      },
      병원유형: hospitalType,
    };
    
    if (hospitalName != null) {
      requestBody["요양기관명"] = hospitalName;
    }
    if (location != null) {
      requestBody["지역"] = location;
    }

    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const searchData = await searchResponse.json();

    console.log('Search Data:', searchData);

    if (Array.isArray(searchData) && searchData.length > 0) {
      const { 요양기관명, 종별코드명, 주소, 전화번호, 병원홈페이지, 진료과목 } = searchData[0];

      console.log("location: ", location);

      let responseText = '';

      if (location == null) {
        responseText = `${location}에 있는 ${요양기관명}에 대해 설명드리겠습니다.`;
      }

      responseText += `${요양기관명}은(는) ${종별코드명}에 속하며,`;

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
      throw new Error(`${hospitalName ? hospitalName : "해당 지역"}에 대한 정보를 찾을 수 없습니다.`);
    }
  } catch (error) {
    console.error('Hospital Search Error:', error);
    if (error.message.includes('Unexpected end of input')) {
      return createResponse(`서버로부터 유효한 응답을 받지 못했습니다. 다시 시도해 주세요.`);
    }
    return createResponse(`병원 정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
  }
};
