import { API_KEY } from '@env';

export const getInitialTags = async (question) => {
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