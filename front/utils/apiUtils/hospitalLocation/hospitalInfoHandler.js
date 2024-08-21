import { extractLocationAndHospital, createResponse } from './utils';

// 만약 병원 정보를 원했다면...
export const handleHospitalInfo = async (question, userLocation, hospitalType, host, port) => {
  // 병원 이름과 위치 추출
  const { location, hospitalName } = await extractLocationAndHospital(question);
  console.log("Location: ", location);
  console.log("Hospital Name: ", hospitalName);

  try {
    // 병원유형과 사용자위치를 필수로 제공하고, 질문에서 병원 이름과 지역이 추출되었다면 병원 이름과 지역도 제공
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

    // 검색 결과가 존재한다면 해당 병원에 대한 정보 출력
    if (Array.isArray(searchData) && searchData.length > 0) {
      const { 요양기관명, 종별코드명, 주소, 전화번호, 병원홈페이지, 진료과목 } = searchData[0];

      console.log("location: ", location);

      let responseText = '';

      // 지역이 있었을 경우 지역 소개 추가
      if (location == null) {
        responseText = `${location}에 있는 ${요양기관명}에 대해 설명드리겠습니다.`;
      }

      responseText += `${요양기관명}은(는) ${종별코드명}에 속하며,`;

      // 주소, 전화번호, 병원홈페이지, 진료과목이 있을 경우 추가
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
