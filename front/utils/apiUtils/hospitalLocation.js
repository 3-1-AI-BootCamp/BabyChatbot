import { GOOGLE_MAPS_API_KEY, API_KEY } from '@env';
import * as Location from 'expo-location';
import { host, port } from '@env';
import { openMap } from './mapUtils';

export const getHospital = async (userLocation, question) => {
  if (!userLocation) {
    return createResponse('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
  }

  console.log('Question:', question);
  console.log(`현재 위치 - 위도: ${userLocation.latitude}, 경도: ${userLocation.longitude}`);

  try {
    // 1. 첫 번째 대화: initialPrompt를 통해 태그 분류
    const { needHospital, hospitalInfo, hospitalType } = await getInitialTags(question);

    console.log(`병원 유형: ${hospitalType}`);
    console.log(`NEED_HOSPITAL: ${needHospital}, HOSPITAL_INFO: ${hospitalInfo}`);

    const isDirectionsRequest = question.includes('가는 길') || question.includes('길찾기') || question.includes('어떻게 가') || question.includes('찾아줘');

    // 2. 두 번째 대화: 태그 분류 결과에 따라 추가 GPT 대화 또는 특정 기능 처리
    // 병원 정보를 요청했을 경우
    if (hospitalInfo && !isDirectionsRequest) {
      return await handleHospitalInfo(question, userLocation, hospitalType);
    }

    // 길찾기를 요청했을 경우
    if (isDirectionsRequest) {
      return await handleDirectionsRequest(question, userLocation, hospitalType);
    }

    // 병에 대한 얘기가 나왔을 경우
    if (needHospital && !isDirectionsRequest) {
      return await handleNeedHospital(userLocation, hospitalType, question);
    }

    // 병원 정보 필요 없고 길 안내도 아닌 경우
    return createResponse(`현재는 병원 관련 정보를 주로 다루고 있어 자세한 답변은 어렵습니다만, ${hospitalType} 관련 정보가 필요하시면 병원 정보를 요청해주세요.`);
  } catch (error) {
    console.error('Error:', error);
    return createResponse(`정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
  }
};

// 첫 번째 GPT 대화에서 태그를 분류하는 함수
const getInitialTags = async (question) => {
  const initialPrompt = `
  병원과 관련된 질문에 대해 다음과 같이 답변해주세요:

  사용자의 질문에 따라 적절한 병원 유형(목록: 내과|신경과|정신건강의학과|외과|정형외과|신경외과|심장혈관흉부외과|성형외과|마취통증의학과|산부인과|소아청소년과|안과|이비인후과|피부과|비뇨의학과|영상의학과|방사선종양학과|병리과|진단검사의학과|결핵과|재활의학과|핵의학과|가정의학과|응급의학과|직업환경의학과|예방의학과|치과|구강악안면외과|치과보철과|치과교정과|소아치과|치주과|치과보존과|구강내과|영상치의학과|구강병리과|예방치과|통합치의학과|한방내과|한방부인과|한방소아과|한방안·이비인후·피부과|한방신경정신과|침구과|한방재활의학과|사상체질과|한방응급)을 추천하세요.
  답변에서 해당 병원 유형을 명확히 기술해주세요.
  답변의 마지막 줄에 반드시 병원 방문이 필요한지 여부를 명확히 표시하세요. "NEED_HOSPITAL: YES" 또는 "NEED_HOSPITAL: NO"로 표시하세요.
  병원 방문이 필요하지 않고 크게 걱정하지 않아도 될 경우에만 "NEED_HOSPITAL: NO"를 사용하세요.
  증상이 지속될 경우 병원 방문을 권장하는 등 어떤 방식으로든 병원 방문을 권장하는 경우에는 "NEED_HOSPITAL: YES"를 사용하세요.
  다음 경우에 "HOSPITAL_INFO: YES"로 표시하세요:
  병원의 기관명을 원할 경우
  병원의 주소를 원할 경우
  병원의 전화번호를 원할 경우
  병원의 홈페이지 주소를 원할 경우
  병원의 의사 수를 원할 경우
  병원의 진료 과목을 원할 경우
  그 외의 경우에는 "HOSPITAL_INFO: NO"로 표시하세요.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: initialPrompt },
        { role: 'user', content: question },
      ],
    }),
  });

  const responseData = await response.json();
  const gptMessage = responseData.choices[0].message.content;

  let needHospital = gptMessage.includes("NEED_HOSPITAL: YES");
  let hospitalInfo = gptMessage.includes("HOSPITAL_INFO: YES");
  const hospitalType = gptMessage.match(/(내과|신경과|정신건강의학과|외과|정형외과|신경외과|심장혈관흉부외과|성형외과|마취통증의학과|산부인과|소아청소년과|안과|이비인후과|피부과|비뇨의학과|영상의학과|방사선종양학과|병리과|진단검사의학과|결핵과|재활의학과|핵의학과|가정의학과|응급의학과|직업환경의학과|예방의학과|치과|구강악안면외과|치과보철과|치과교정과|소아치과|치주과|치과보존과|구강내과|영상치의학과|구강병리과|예방치과|통합치의학과|한방내과|한방부인과|한방소아과|한방안·이비인후·피부과|한방신경정신과|침구과|한방재활의학과|사상체질과|한방응급)/)?.[0] || '병원';

  return {
    needHospital,
    hospitalInfo,
    hospitalType,
  };
};

const handleHospitalInfo = async (question, userLocation, hospitalType) => {
  const { location, hospitalName } = extractLocationAndHospital(question);
  
  if (hospitalName) {
    try {
      const searchUrl = `http://${host}:${port}/api/search`;
      const requestBody = {
        요양기관명: hospitalName,
      };
      if (location) requestBody["지역"] = location; // 만약 지역 정보를 찾았다면 지역까지 검색 대상에 추가
      
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


const extractLocationAndHospital = (question) => {
  const locations = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
  let location = null;
  let hospitalName = null;

  // 지역 추출
  for (let loc of locations) {
    if (question.includes(loc)) {
      location = loc;
      break;
    }
  }

  // 병원 이름 추출
  const hospitalMatch = question.match(/([가-힣\s]+(?:병원|의원|의료원|치과|보건진료소|보건지소))/);
  if (hospitalMatch) {
    hospitalName = hospitalMatch[0];
  }

  return { location, hospitalName };
};

const handleDirectionsRequest = async (question, userLocation) => {
  try {
    const { location, hospitalName } = extractLocationAndHospital(question);

    // 요양기관명 필수, 지역 선택
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

    // JSON 응답이 비어있을 경우 처리
    const searchData = await searchResponse.json();

    console.log('Search Data:', searchData);

    if (!searchData || searchData.length === 0) {
      throw new Error(`"${hospitalName}"에 대한 검색 결과가 없습니다.`);
    }

    const hospital = searchData[0]; // 첫 번째 결과를 사용

    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${hospital.좌표.Y},${hospital.좌표.X}&dirflg=d`;

    console.log('Directions URL:', directionsUrl);
    openMap(directionsUrl);

    return createResponse(`"${hospital.요양기관명}"까지의 길찾기를 시작합니다. 주소: ${hospital.주소}. 지도를 확인해주세요.`);
  } catch (error) {
    console.error('Directions Request Error:', error);
    return createResponse(`길찾기 정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
  }
};

const handleNeedHospital = async (userLocation, hospitalType, question) => {
  try {
    const nearbyHospitals = await getNearbyHospitals(userLocation, hospitalType);
    const { gptResponse } = await getGPTResponse(question, hospitalType);

    let responseText = gptResponse;

    console.log('responseText:', responseText);

    if (nearbyHospitals.length > 0) {
      const hospitalList = nearbyHospitals.map(item => item.name).join(', ');
      responseText += ` 근처에서 찾은 ${hospitalType}(으)로는 ${hospitalList} 등이 있습니다.`;
    } else {
      responseText += ` 하지만 죄송하게도 근처에서 ${hospitalType}을(를) 찾을 수 없습니다.`;
    }

    return createResponse(responseText);
  } catch (error) {
    console.error('Nearby Hospitals Error:', error);
    return createResponse(`근처 병원 정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
  }
};

const getNearbyHospitals = async (userLocation, hospitalType) => {
  const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.latitude},${userLocation.longitude}&radius=5000&type=hospital&keyword=${encodeURIComponent(hospitalType)}&key=${GOOGLE_MAPS_API_KEY}`;
  const placesResponse = await fetch(placesUrl);
  const placesData = await placesResponse.json();

  if (placesData.status === 'OK' && placesData.results.length > 0) {
    return placesData.results.slice(0, 3);
  }
  return [];
};

const createResponse = (text) => ({
  _id: Math.random().toString(36).substring(7),
  text,
  createdAt: new Date(),
  user: { _id: 2, name: 'ChatGPT' },
});

const getGPTResponse = async (question, hospitalType) => {
  // 공통 프롬프트
  const commonPrompt = `
  당신은 병원 정보 제공 전문가입니다. 질문자는 12개월 된 아이의 보호자입니다.
  현재 질문에 대해 ${hospitalType}와 관련된 간단하고 명확한 답변을 제공해주세요.
  현재 상태에 대한 간단한 평가를 포함하세요.
  답변은 되도록 100자를 넘지 않도록 하되, 유저의 요청에 따라 넘을 수 있습니다.
  병원 방문의 중요성과 필요성에 대해 설명하세요.
  특정 진료나 의료 서비스에 대한 일반적인 정보를 제공하세요.
  마무리에 부모를 안심시킬 수 있는 문장을 포함해주세요.
  마지막 문장이 반드시 "근처의 병원을 알려드리겠습니다."로 끝나도록 답변을 작성하세요.
  `;

  // 프롬프트 선택에 따라 GPT 응답을 조합
  let finalPrompt = commonPrompt;

  // OpenAI API 호출
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: finalPrompt },
        { role: 'user', content: question },
      ],
    }),
  });

  const responseData = await response.json();
  const gptMessage = responseData.choices[0].message.content;

  return {
    gptResponse: gptMessage.replace(/NEED_HOSPITAL:.+|HOSPITAL_INFO:.+/g, '').trim(),
  };
};
