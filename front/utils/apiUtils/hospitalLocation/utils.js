import { GOOGLE_MAPS_API_KEY, API_KEY } from '@env';

// 초기 태그 추출용 함수
export const getInitialTags = async (question) => {
    const prompt = `
    병원과 관련된 질문에 대해 다음과 같은 형식으로 답변해주세요:
    {
      NEED_HOSPITAL: boolean,
      HOSPITAL_INFO: boolean,
      NEARBY_HOSPITALS: boolean,
      병원 유형: string
    }
    형식에서 큰따옴표를 붙이지 마세요.
    NEED_HOSPITAL와 HOSPITAL_INFO는 둘 다 YES가 될 수 없습니다.
    또한, NEARBY_HOSPITALS와 NEED_HOSPITAL은 둘 다 YES가 될 수 없습니다.
    사용자의 질문에 따라 적절한 병원 유형(목록: 내과|신경과|정신건강의학과|외과|정형외과|신경외과|심장혈관흉부외과|성형외과|마취통증의학과|산부인과|소아청소년과|안과|이비인후과|피부과|비뇨의학과|영상의학과|방사선종양학과|병리과|진단검사의학과|결핵과|재활의학과|핵의학과|가정의학과|응급의학과|직업환경의학과|예방의학과|치과|구강악안면외과|치과보철과|치과교정과|소아치과|치주과|치과보존과|구강내과|영상치의학과|구강병리과|예방치과|통합치의학과|한방내과|한방부인과|한방소아과|한방안·이비인후·피부과|한방신경정신과|침구과|한방재활의학과|사상체질과|한방응급|소아과)을 추천하세요.
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
    특정 병원 유형의 근처 병원을 추천해 달라는 요청이 있는 경우 "NEARBY_HOSPITALS: YES"를 사용하세요.
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
          { role: 'system', content: prompt },
          { role: 'user', content: question },
        ],
      }),
    });
  
    const responseData = await response.json();
    const gptMessage = responseData.choices[0].message.content;

    console.log('GPT Message:', gptMessage);
  
    let needHospital = gptMessage.includes("NEED_HOSPITAL: YES");
    let hospitalInfo = gptMessage.includes("HOSPITAL_INFO: YES");
    let nearbyHospitals = gptMessage.includes("NEARBY_HOSPITALS: YES");
    const hospitalTypeMatch = gptMessage.match(/(내과|신경과|정신건강의학과|외과|정형외과|신경외과|심장혈관흉부외과|성형외과|마취통증의학과|산부인과|소아청소년과|안과|이비인후과|피부과|비뇨의학과|영상의학과|방사선종양학과|병리과|진단검사의학과|결핵과|재활의학과|핵의학과|가정의학과|응급의학과|직업환경의학과|예방의학과|치과|구강악안면외과|치과보철과|치과교정과|소아치과|치주과|치과보존과|구강내과|영상치의학과|구강병리과|예방치과|통합치의학과|한방내과|한방부인과|한방소아과|한방안·이비인후·피부과|한방신경정신과|침구과|한방재활의학과|사상체질과|한방응급|소아과)/);
    const hospitalType = hospitalTypeMatch ? hospitalTypeMatch[0] : '병원';
    
    return {
      needHospital,
      hospitalInfo,
      nearbyHospitals,
      hospitalType,
    };
  };

// 병원 정보를 원할 때 사용하는 함수
export const extractLocationAndHospital = async (question) => {
    const prompt = `
    해당 질문에서 지역과 병원이름을 추출하세요.
    지역은 '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'중 하나입니다.
    병원이름은 실제 병원 이름입니다. 예를 들어 '서울대학교병원'입니다. '정형외과'는 병원이름이 아닙니다.
    답변 형식은 아래와 같이 주세요.
    {
      location: string,
      hospitalName: string
    }
    큰 따옴표를 붙이지 마세요.
    만일 질문의 지역에서 오타가 있으면 수정해서 주세요.
    만일 값에서 지역이나 병원 이름을 찾을 수 없다면 null로 설정하세요.
    `;
  
    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: question },
        ],
      }),
    });
  
    const responseData = await response.json();
    const gptMessage = responseData.choices[0].message.content;

    console.log("gptMessage: ", gptMessage);

    let location = gptMessage.split('location:')[1].split(',')[0].trim();
    let hospitalName = gptMessage.split('hospitalName:')[1].trim();
  
    return { location, hospitalName };
};

// 병원에 가야된다고 판단했을 때 실행되는 함수
export const getGPTResponse = async (question, hospitalType) => {
  const prompt = `
  당신은 병원 정보 제공 전문가입니다. 질문자는 12개월 된 아이의 보호자입니다.
  답변은 한국어로만 알기 쉽게 작성해주세요.
  현재 질문에 대해 ${hospitalType}와 관련된 간단하고 명확한 답변을 제공해주세요.
  현재 상태에 대한 간단한 평가를 포함하세요.
  답변은 되도록 100자를 넘지 않도록 하되, 유저의 요청에 따라 넘을 수 있습니다.
  병원 방문의 중요성과 필요성에 대해 설명하세요.
  특정 진료나 의료 서비스에 대한 일반적인 정보를 제공하세요.
  마무리에 부모를 안심시킬 수 있는 문장을 포함해주세요.
  마지막 문장이 반드시 "근처의 병원을 알려드리겠습니다."로 끝나도록 답변을 작성하세요.
  `;

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
        { role: 'system', content: prompt },
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

// 현재 위치에서 가장 가까운 병원 3개를 찾는 함수
export const getNearbyHospitals = async (userLocation, hospitalType = '병원') => {
  // 병원 유형으로 검색
  const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.latitude},${userLocation.longitude}&radius=5000&type=hospital&keyword=${encodeURIComponent(hospitalType)}&key=${GOOGLE_MAPS_API_KEY}`;
  const placesResponse = await fetch(placesUrl);
  const placesData = await placesResponse.json();

  if (placesData.status === 'OK' && placesData.results.length > 0) {
    return placesData.results.slice(0, 3);
  }
  return [];
};
  
// 객체 형식의 응답을 bubble에 올리기 위해 필요한 함수, 즉 대답을 왼쪽 말풍선에 띄우기 위한 함수라고 보면 됨
export const createResponse = (text) => ({
    _id: Math.random().toString(36).substring(7),
    text,
    createdAt: new Date(),
    user: { _id: 2, name: 'ChatGPT' },
  });

