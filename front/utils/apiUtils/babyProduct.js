import { API_KEY, NAVER_SHOP_ID, NAVER_SHOP_SECRET } from '@env';



const categories = {
  수유용품: ['젖병', '분유', '모유저장팩', '유축기', '수유쿠션', '수유패드', '젖병소독기', '수유등', '수유티', '젖꼭지', '젖병브러쉬', '분유케이스', '분유포트', '수유팔찌'],
  이유식용품: ['이유식', '이유식마스터기', '이유식용기', '이유식냄비', '아기수저', '아기포크', '빨대컵', '이유식책', '이유식틀', '유아식판', '유아식탁보', '이유식가위', '이유식스푼', '실리콘턱받이'],
  기저귀용품: ['기저귀', '물티슈', '기저귀케이크', '기저귀가방', '기저귀정리함', '기저귀갈이대', '기저귀크림', '엉덩이파우더', '기저귀털이', '기저귀스프레이', '천기저귀', '수영장기저귀'],
  목욕스킨케어: ['베이비로션', '베이비오일', '아기샴푸', '아기욕조', '목욕타올', '아기면봉', '베이비파우더', '아기선크림', '아기비누', '아기bath', '목욕장난감', '아기샤워기', '아기목욕의자', '배꼽소독솜', '아기손톱가위', '아기빗', '아기면봉', '아기귀걸이'],
  수면용품: ['아기침대', '유아베개', '스와들', '아기이불', '모빌', '백색소음기', '수면조끼', '아기침대가드', '유아베개', '아기침구세트', '아기요', '아기매트리스', '아기침대모기장', '수유쿠션'],
  의류: ['아기옷', '바디수트', '아기내복', '아기양말', '아기모자', '턱받이', '속싸개', '아기외출복', '아기신발', '아기장갑', '아기우비', '아기수영복', '아기한복', '아기카디건', '아기조끼', '아기잠옷'],
  외출용품: ['유모차', '아기띠', '카시트', '아기가방', '보행기', '아기썬캡', '아기선글라스', '아기슬링', '유모차정리함', '유모차레인커버', '아기모기장', '아기미아방지용품', '아기보냉백'],
  놀이교육용품: ['장난감', '소리나는책', '블록', '모빌', '치발기', '아기체육관', '아기책', '아기퍼즐', '아기그림책', '아기악기', '아기놀이매트', '아기워커', '아기그네', '아기점프', '아기볼풀', '미술놀이세트', '아기칠판'],
  안전용품: ['베이비모니터', '콘센트커버', '모서리보호대', '안전문', '미끄럼방지매트', '아기안전경보기', '유아안전벨트', '아기안전가드', '아기안전잠금장치', '아기차량용품', '유아헬멧'],
  위생용품: ['손소독제', '마스크', '체온계', '콧물흡입기', '아기치약', '아기칫솔', '네일케어세트', '귀체온계', '아기면봉', '아기손수건', '살균소독기', '공기청정기'],
  기타육아용품: ['쪽쪽이', '떡뻥', '아기의자', '아기식탁의자', '아기체중계', '아기발달체조', '아기학습테이블', '유아변기', '유아세면대', '아기욕실의자', '아기발육알림판'],
  부모용품: ['수유브라', '수유복', '산모패드', '산모벨트', '산후복대', '유축기가방', '산모영양제', '산모방석', '산모슬리퍼', '산모클렌징', '산모마사지크림', '산모좌욕기'],
  신생아용품: ['배냇저고리', '손싸개', '발싸개', '배띠', '가제수건', '신생아모자', '신생아손발싸개', '탯줄관리용품', '신생아내복']
};

const systemMessage = `
당신은 육아 용품 전문가입니다. 부모의 질문을 듣고 관련된 아기 용품의 키워드를 추출해주세요.
추출한 키워드는 다음과 같은 형식으로 작성해주세요:

[Keywords: 키워드1, 키워드2, ...]

키워드는 최대 3개까지만 추출해주세요.
키워드 외의 다른 설명은 필요하지 않습니다.
`;

export const getBabyProduct = async (question) => {
  if (!question || typeof question !== 'string') {
    return {
      _id: Math.random().toString(36).substring(7),
      text: "죄송합니다. 유효한 질문을 입력해주세요.",
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
  }

  try {
    // GPT-3.5-turbo를 사용하여 키워드 추출
    const extractedKeywords = await extractKeywordsUsingGPT(question);

    if (extractedKeywords.length === 0) {
      return {
        _id: Math.random().toString(36).substring(7),
        text: "죄송합니다. 질문에서 키워드를 추출하지 못했어요. 다른 방식으로 질문해 주시겠어요?",
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    }

    const mainKeyword = extractedKeywords[0];
  
    const confirmationMessage = `"${mainKeyword}"을(를) 찾으시는 것 같아요. 맞다면 "${mainKeyword} 검색해줘" , 아니라면 "아니오"라고 대답해 주세요.`;
    
    return {
      _id: Math.random().toString(36).substring(7),
      text: confirmationMessage,
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
      extractedKeyword: mainKeyword  // 추출된 키워드를 포함
    };

  } catch (error) {
    console.error('Error in getBabyProduct:', error);
    return {
      _id: Math.random().toString(36).substring(7),
      text: "죄송해요. 지금 제품을 찾는 데 문제가 생겼어요. 잠시 후에 다시 시도해 주시겠어요?",
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
  }
};

export const handleUserResponse = async (response, previousMessage) => {
  console.log('handleUserResponse called with:', response, previousMessage);
  const lowercaseResponse = response.toLowerCase().trim();

  if (lowercaseResponse.includes('검색해줘')) {
    // '검색해줘'가 포함된 경우, 검색어를 추출하여 검색 수행
    const searchKeyword = lowercaseResponse.replace('검색해줘', '').trim();
    console.log('Searching for:', searchKeyword);
    return await searchProduct(searchKeyword);
  } else {
    // 검색 요청이 아닌 경우, 새로운 질문으로 처리
    return await getBabyProduct(response);
  }
};

async function extractKeywordsUsingGPT(question) {
  const messages = [
    { role: 'system', content: '아기 용품과 관련된 질문에서 가장 적절한 키워드를 추출해주세요. 설명적인 문장이 주어질 경우, 그 설명에 가장 잘 맞는 아기 용품을 찾아주세요.' },
    { role: 'user', content: question },
    { role: 'assistant', content: '이 질문에서 가장 적절한 아기 용품 키워드는 무엇인가요?' },
    { role: 'user', content: '한 단어로 대답해주세요.' }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
    }),
  });

  const data = await response.json();
  const keyword = data.choices[0].message.content.trim();
  return [keyword]; // 단일 키워드를 배열로 반환
}

async function analyzeResponseUsingGPT(response) {
  // GPT API를 사용하여 응답이 부정적인지 분석
  const messages = [
    { role: 'system', content: '사용자의 응답이 부정적인지 판단해주세요. "예" 또는 "아니오"로만 대답해주세요.' },
    { role: 'user', content: `사용자 응답: "${response}". 이 응답이 부정적인가요?` }
  ];

  const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
    }),
  });

  const data = await gptResponse.json();
  const analysis = data.choices[0].message.content.trim().toLowerCase();
  return analysis === '예';
}

async function searchProduct(keyword) {
  console.log('searchProduct function called with keyword:', keyword);
  try {
    const query = encodeURIComponent(keyword);
    const url = `https://openapi.naver.com/v1/search/shop.json?query=${query}&display=3`;
    console.log('Sending request to URL:', url);

    const naverResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': NAVER_SHOP_ID,
        'X-Naver-Client-Secret': NAVER_SHOP_SECRET,
        'Accept': 'application/json',
      },
    });

    console.log('Naver API response status:', naverResponse.status);
    const naverData = await naverResponse.json();
    console.log('Naver API response data:', naverData);
    
    if (naverData.items && naverData.items.length > 0) {
      const recommendedProducts = naverData.items.slice(0, 3);

      const productList = recommendedProducts.map((item, index) => 
        `${index + 1}. ${item.title} - ${parseInt(item.lprice).toLocaleString()}원\n   링크: ${item.link}`
      ).join('\n\n');

      let responseText = `제가 "${keyword}"에 관련된 제품을 찾아봤어요. 어떠세요?\n\n${productList}`;

      return {
        _id: Math.random().toString(36).substring(7),
        text: responseText,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    } else {
      console.log('No products found for keyword:', keyword);
      return {
        _id: Math.random().toString(36).substring(7),
        text: `죄송해요. "${keyword}"에 관련된 제품을 찾지 못했어요. 다른 키워드로 다시 물어봐 주시겠어요?`,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    }
  } catch (error) {
    console.error('Error searching for products:', error);
    return {
      _id: Math.random().toString(36).substring(7),
      text: "죄송해요. 지금 제품을 찾는 데 문제가 생겼어요. 잠시 후에 다시 시도해 주시겠어요?",
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
  }
}