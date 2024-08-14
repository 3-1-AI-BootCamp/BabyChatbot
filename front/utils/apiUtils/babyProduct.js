import { API_KEY, NAVER_SHOP_ID, NAVER_SHOP_SECRET } from '@env';

const categories = {
  수유용품: [
    "젖병", "분유", "모유저장팩", "유축기", "수유쿠션", "수유패드", "젖병소독기",
    "쪽쪽이", "젖꼭지", "젖병브러시", "젖병건조대", "유축기세정제", "모유수유겸용젖병",
    "손목지지대", "모유촉진차", "수유브라", "수유복", "모유수유가이드북", "수유의자",
    "유아트레이", "수유담요", "수유등", "모유저장팩스탠드", "유축기모터", "분유보관함",
    "분유저장팩", "유축기파우치", "유아식탁의자", "유아컵", "모유착유기", "수유베개커버",
    "분유보온기", "분유메이커", "젖병전용세제", "아기세정제", "젖병보관함", "모유보관가방",
    "유축기용패드", "모유보관용기", "수유베개", "모유보관병", "유축기백팩", "분유포트",
    "수유조끼", "유아식기세트", "분유가열기", "모유보관냉장고", "수유위생티슈", "젖병집"
  ],
  이유식용품: [
    "이유식", "이유식마스터기", "이유식용기", "아기수저", "아기포크", "빨대컵",
    "이유식도서", "이유식스푼", "이유식냄비", "이유식보관용기", "이유식가위",
    "이유식칼", "이유식매트", "아기턱받이", "이유식메이커", "아기밥그릇", "이유식조리기구",
    "이유식시트", "이유식책", "이유식레시피북", "이유식마커", "이유식얼음틀", "이유식포크세트",
    "이유식저장팩", "이유식냉동기", "이유식필러", "이유식보온기", "이유식밀봉기",
    "이유식보관병", "이유식보온병", "아기접시", "이유식보온컵", "아기용도마", "이유식보관통",
    "이유식스팀기", "아기스낵용기", "아기이유식그릇", "이유식도구세트", "이유식자석숟가락",
    "이유식기타", "이유식식탁매트", "아기용앞치마", "이유식텀블러",
    "이유식실리콘매트", "이유식세척기", "이유식가열기", "이유식보온가방", "이유식물병"
  ],
  기저귀용품: [
    "기저귀", "물티슈", "기저귀케이크", "기저귀가방", "기저귀정리함", "기저귀갈이대",
    "기저귀쓰레기통", "기저귀크림", "기저귀교환매트", "기저귀트레이닝팬츠",
    "아기피부보호크림", "기저귀보관함", "기저귀알람", "기저귀교체패드", "기저귀스프레이",
    "기저귀가루", "기저귀테이블", "아기피부장벽크림", "유기농기저귀", "기저귀수납백",
    "기저귀교환가방", "기저귀교환대", "기저귀교환트레이", "기저귀갈이매트", 
    "기저귀바구니", "기저귀수거통", "기저귀가방클립", "기저귀방수커버", "기저귀분리기",
    "기저귀변기", "기저귀패드", "기저귀갈이시트", "기저귀크림발림기", "기저귀보관장",
    "기저귀목욕가방", "기저귀분리함", "기저귀폐기기", "기저귀가방세트", "기저귀교환쿠션",
    "기저귀알람기", "기저귀교환대카트", "기저귀보온기", "기저귀변기청소기",
    "기저귀용품함", "기저귀교환매트커버", "기저귀보관함커버", "기저귀폐기용가방"
  ],
  목욕스킨케어: [
    "베이비로션", "베이비오일", "아기샴푸", "아기욕조", "목욕타올", "아기면봉",
    "베이비바스", "베이비바디워시", "베이비파우더", "베이비선크림", "목욕장난감",
    "욕조거치대", "유아칫솔", "베이비스파", "베이비욕조온도계", "베이비비누",
    "베이비샴푸캡", "목욕의자", "베이비스킨크림", "베이비입욕제", "목욕비누받침대",
    "베이비스파수건", "아기목욕물티슈", "베이비목욕비누", "베이비샤워젤", "목욕타올거치대",
    "아기샴푸거품기", "목욕가운", "베이비목욕바구니", "목욕물놀이장난감", "아기목욕물컵",
    "베이비샤워캡", "목욕비누", "목욕거품놀이", "아기욕조매트", "아기목욕놀이장난감",
    "베이비목욕크림", "베이비목욕솔", "베이비목욕보조의자", "아기목욕거울", "베이비목욕터틀",
    "베이비목욕타임세트", "베이비샴푸기", "베이비욕조뚜껑", "베이비샤워파우더", "아기목욕비누",
    "베이비목욕온도조절기", "베이비목욕타올세트", "아기목욕장난감거치대", 
    "베이비목욕목재", "아기목욕비눗방울기"
  ],
  수면용품: [
    "아기침대", "유아베개", "스와들", "아기이불", "수면등",
    "아기침구세트", "베이비매트리스", "아기이불세트", "아기속싸개", "수면인형",
    "백색소음기", "아기요람", "방수요", "아기침대범퍼", "아기수면복", "유아침대보호가드",
    "아기매트", "수면조끼", "아기침대보호대", "아기요정의자", "아기침대커버",
    "수면쿠션", "아기베개커버", "유아수면조끼", "아기수면매트", "아기침대안전망", "아기침대테이블",
    "아기이불커버", "유아수면베개", "아기수면토퍼", "아기침대오르가니저", "아기요람매트리스",
    "아기수면등가습기", "유아침대", "아기침대트레이", "유아수면바지", "유아잠옷",
    "아기수면등스탠드", "유아침대보호대", "아기침대캐노피", "아기수면시계", "아기침대프레임",
    "아기요람커버", "아기수면이불", "아기침대발판", "아기요람보호대", "아기침대매트리스커버"
  ],
  의류: [
    "아기옷", "바디수트", "아기내복", "아기양말", "아기모자", 
    "아기우주복", "아기바디슈트", "아기레깅스", "아기속옷", "아기드레스", 
    "아기자켓", "아기모자세트", "아기신발", "아기슈트", "아기패딩", "아기레인코트", 
    "아기수영복", "아기덧신", "아기슬리퍼", "아기바람막이", "아기외투", "아기모피옷",
    "아기장갑", "아기니트", "아기비니", "아기잠옷", "아기카디건", "아기조끼",
    "아기티셔츠", "아기청바지", "아기치랭스", "아기레이어드드레스", 
    "아기무스탕", "아기털모자", "아기바디수트세트", "아기패션소품", "아기용스카프",
    "아기햇빛가리개", "아기발목양말", "아기후드티", "아기레깅스팬츠", "아기퍼자켓",
    "아기보넷", "아기겨울점퍼", "아기하트의류", "아기액세서리", "아기귀도리"
  ],
  외출용품: [
    "유모차", "아기띠", "카시트", "아기가방", "보행기", "아기썬캡", "아기선글라스", 
    "아기담요", "아기캐리어", "아기슬링", "유모차장난감", "유모차방풍커버", 
    "유모차쿨러", "카시트커버", "카시트오가닉패드", "카시트사이드미러", 
    "아기차양막", "유모차걸이", "아기목보호대", "아기방수담요", 
    "유모차컵홀더", "유모차발판", "아기멀미방지패치", "아기유모차잠금장치",
    "아기체인백", "아기피크닉매트", "유모차가방", "아기방풍커버", "아기캐리어벨트",
    "아기카시트쿠션", "아기등받이", "유모차모기장", "아기유모차햇빛가리개", "유모차걸이바구니",
    "유모차차양막", "유모차바람막이", "아기보행기커버", "아기보행기쿠션", "유모차핸드워머",
    "유모차레인커버", "아기카시트오가닉커버", "아기오가닉캐리어", "유모차양산", "아기스포츠웨어",
    "유모차풋머프", "아기등산장비", "유모차난로", "아기목욕튜브"
  ],
  놀이교육용품: [
    "장난감", "소리나는책", "블록", "모빌", "치발기", "아기체육관", "아기책", 
    "쌓기놀이", "퍼즐", "아기공", "아기악기", "원목교구", "감각발달장난감", 
    "아기미술도구", "아기캐릭터인형", "아기학습완구", "아기그림책", "아기색칠놀이", 
    "아기프린트북", "아기퍼즐매트", "아기독서대", "아기원목책장", "아기그림자극기구",
    "아기낚시놀이", "아기퍼즐보드", "아기실내놀이", "아기수공예세트", "아기색칠북",
    "아기도형놀이", "아기창의놀이", "아기조립놀이", "아기운동기구", "아기교구장",
    "아기퍼즐블록", "아기탐구놀이", "아기감각놀이", "아기양말인형", "아기미니악기",
    "아기상상놀이", "아기종이접기", "아기교육카드", "아기음악놀이", "아기스티커놀이",
    "아기브릭", "아기정리함", "아기색채놀이", "아기놀이방매트", "아기미술책상"
  ],
  안전용품: [
    "베이비모니터", "콘센트커버", "모서리보호대", "안전문", "미끄럼방지매트", 
    "아기안전벨트", "유아차량용시트", "아기침대가드", "아기손잡이보호대", 
    "아기문손잡이커버", "유아계단안전바", "유아용창문잠금장치", "아기안전모자", 
    "아기문잠금장치", "유아가전보호커버", "아기침대난간보호대", "유아가구모서리커버", 
    "아기계단안전커버", "아기미끄럼방지양말", "유아안전락", "아기문가드", "아기차량햇빛가리개",
    "아기침대잠금장치", "아기안전그네", "아기미끄럼방지테이프", "유아창문보호대", "유아침대안전난간",
    "아기안전패드", "아기창문잠금기", "유아문손잡이커버", "아기낙상방지쿠션", "유아차량햇빛가리개",
    "아기화재감지기", "아기독가스탐지기", "아기안전의자", "아기안전망", "유아문보호대",
    "아기침대보호난간", "아기모서리안전커버", "아기미끄럼방지패드", "유아차량창문커버", "유아안전난간",
    "아기손보호대", "유아가전안전장치", "아기욕조안전매트", "아기침대보호기", "유아가구보호대"
  ],

  위생용품: [
    "손소독제", "마스크", "체온계", "콧물흡입기", "아기치약", "아기칫솔", 
    "네일케어세트", "베이비면봉", "베이비세정제", "아기손톱깎이", "아기발톱가위", 
    "아기양치컵", "아기비누", "유아샤워필터", "베이비칫솔세트", "아기코세정제", 
    "아기치아발육기", "아기바디크림", "아기온도계", "아기콧물제거기", "유아손소독티슈", 
    "유아마스크스트랩", "아기칫솔보관함", "아기치약세트", "아기코흡입기", "유아양치컵세트",
    "아기샴푸캡", "아기손세정제", "아기미용가위", "유아발보습제", "아기목욕바디솔트",
    "유아비누", "아기발톱정리세트", "아기욕조세정제", "유아욕조매트", "아기손톱보호기",
    "아기입욕제", "아기입욕솔트", "유아손소독기", "아기얼굴세정제", "아기욕조비누",
    "아기피부보호제", "아기샴푸세트", "유아세정제", "아기면봉케이스", "아기손톱정리기"
  ]
};

export const getBabyProduct = async (question) => {
  console.log("[getBabyProduct] Received question:", question);

  if (!question || typeof question !== 'string') {
    console.log("[getBabyProduct] Invalid question");
    return createErrorResponse("유효한 질문을 입력해주세요.");
  }

  try {
    const intent = await analyzeIntent(question);
    console.log("[getBabyProduct] Analyzed intent:", intent);

    if (intent.isNotBabyProduct) {
      console.log("[getBabyProduct] Not a baby product question");
      return createErrorResponse("죄송합니다. 아기 용품과 관련된 질문만 답변할 수 있어요.");
    } else if (intent.needsClarification) {
      console.log("[getBabyProduct] Needs clarification");
      return {
        _id: Math.random().toString(36).substring(7),
        text: `"${intent.suggestedKeyword}"를 찾으시는 건가요? 맞다면 "${intent.suggestedKeyword} 찾아줘"라고 말씀해 주세요!`,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    } else if (question.toLowerCase().includes('찾아줘')) {
      console.log("[getBabyProduct] Searching for product");
      return await searchProduct(intent.keyword, intent.priceRange);
    } else {
      console.log("[getBabyProduct] Suggesting search");
      return {
        _id: Math.random().toString(36).substring(7),
        text: `${intent.keyword}에 대해 검색하고 싶으시면 "${intent.keyword} 찾아줘"라고 말씀해 주세요!`,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    }
  } catch (error) {
    console.error('[getBabyProduct] Error:', error);
    if (error.message.includes("API")) {
      return createErrorResponse("서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해 주세요.");
    } else {
      return createErrorResponse("처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }
};

async function analyzeIntent(question) {
  console.log("[analyzeIntent] Starting analysis for question:", question);
  console.log("[analyzeIntent] API Key (first 4 chars):", API_KEY.substring(0, 4));

  const allKeywords = Object.values(categories).flat();
  const prompt = `
사용자의 질문: "${question}"

다다음은 유효한 아기 용품 키워드 목록입니다:
${allKeywords.join(', ')}

이 질문이 아기 용품과 관련된 것인지 분석해주세요. 다음 형식으로 응답해주세요:
{
  "needsClarification": boolean,
  "keyword": string,
  "suggestedKeyword": string | null,
  "isNotBabyProduct": boolean,
  "priceRange": {
    "min": number | null,
    "max": number | null
  }
}

- needsClarification: 사용자의 질문이 모호하여 추가 설명이 필요한 경우 true
- keyword: 질문에서 찾은 아기 용품 관련 키워드. 반드시 위의 키워드 목록에 있는 것이어야 합니다.
- suggestedKeyword: 질문이 모호할 경우 제안할 키워드. 반드시 위의 키워드 목록에 있는 것이어야 합니다.
- isNotBabyProduct: 질문이 아기 용품과 관련이 없거나, 키워드가 위 목록에 없는 경우 true
- priceRange: 사용자가 언급한 가격 범위. 만원 단위로 해석합니다. 예를 들어, "3만원대"는 min: 30000, max: 39999로 설정합니다.

주의: 
1. keyword와 suggestedKeyword는 반드시 위의 키워드 목록에 있는 것이어야 합니다.
2. 질문이 아기 용품과 관련이 있어 보이더라도, 정확히 일치하는 키워드가 목록에 없다면 isNotBabyProduct를 true로 설정하세요.
3. needsClarification이 true일 경우, suggestedKeyword를 반드시 제공해야 하며, 이 역시 키워드 목록에 있어야 합니다.
4. isNotBabyProduct가 true일 때는 '죄송합니다. 아기 용품과 관련된 질문만 답변할 수 있어요.'라고 답해야 합니다.
5. 가격 범위가 명시되지 않았다면 priceRange의 min과 max를 null로 설정하세요.

예시:
질문: "3만원대의 기저귀 찾아줘"
답변:
{
  "needsClarification": false,
  "keyword": "기저귀",
  "suggestedKeyword": null,
  "isNotBabyProduct": false,
  "priceRange": {
    "min": 30000,
    "max": 39999
  }
}

질문: "아기가 잘 때 위에 빙글빙글 도는 게 뭐였지?"
답변:
{
  "needsClarification": true,
  "keyword": "모빌",
  "suggestedKeyword": "모빌",
  "isNotBabyProduct": false
}

질문: "아기 침대 추천해줘"
답변:
{
  "needsClarification": false,
  "keyword": "아기침대",
  "suggestedKeyword": null,
  "isNotBabyProduct": false
}

질문: "자동차 추천해줘"
답변:
{
  "needsClarification": false,
  "keyword": "",
  "suggestedKeyword": null,
  "isNotBabyProduct": true
}

`;

try {
  console.log("[analyzeIntent] Sending request to OpenAI API");
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    console.error("[analyzeIntent] API response not OK:", response.status, response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("[analyzeIntent] Full API Response:", JSON.stringify(data, null, 2));

  if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
    let result;
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error("[analyzeIntent] Error parsing API response:", parseError);
      console.log("[analyzeIntent] Raw content:", data.choices[0].message.content);
      throw new Error("Failed to parse API response");
    }

    console.log("[analyzeIntent] Parsed API Response:", result);

    // Additional validation
    if ((!result.keyword || !allKeywords.includes(result.keyword)) && 
        (!result.suggestedKeyword || !allKeywords.includes(result.suggestedKeyword))) {
      console.log("[analyzeIntent] Setting isNotBabyProduct to true due to invalid keywords");
      result.isNotBabyProduct = true;
    } else {
      result.isNotBabyProduct = false;
      if (!result.keyword && result.suggestedKeyword) {
        console.log("[analyzeIntent] Setting keyword to suggestedKeyword");
        result.keyword = result.suggestedKeyword;
      }
    }

    return result;
  } else {
    console.error("[analyzeIntent] Unexpected API response structure:", data);
    throw new Error("Invalid API response structure");
  }
} catch (error) {
  console.error("[analyzeIntent] Error:", error);
  if (error.message.includes("401")) {
    console.error("[analyzeIntent] API 인증 오류. API 키를 확인하세요.");
    throw new Error("API 인증 오류");
  }
  throw error;
}
}

async function searchProduct(keyword, priceRange) {
console.log("[searchProduct] 검색 키워드:", keyword);
console.log("[searchProduct] 가격 범위:", priceRange);
try {
  const query = encodeURIComponent(keyword);
  const url = `https://openapi.naver.com/v1/search/shop.json?query=${query}&display=100`;

  console.log("[searchProduct] Naver Shopping API URL:", url);
  console.log("[searchProduct] Naver Client ID (first 4 chars):", NAVER_SHOP_ID.substring(0, 4));

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Naver-Client-Id': NAVER_SHOP_ID,
      'X-Naver-Client-Secret': NAVER_SHOP_SECRET,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    console.error("[searchProduct] Naver API response not OK:", response.status, response.statusText);
    throw new Error(`Naver API HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("[searchProduct] Naver API Response:", JSON.stringify(data, null, 2));
  
  if (data.items && data.items.length > 0) {
    let filteredProducts = data.items.filter(item => {
      const price = parseInt(item.lprice);
      return (priceRange.min === null || price >= priceRange.min) &&
             (priceRange.max === null || price <= priceRange.max);
    });

    if (filteredProducts.length === 0) {
      console.log("[searchProduct] No products found in the specified price range");
      return createErrorResponse(`죄송합니다. "${keyword}"에 관련된 제품 중 지정된 가격대의 제품을 찾지 못했습니다.`);
    }

    const products = filteredProducts.slice(0, 3).map((item, index) => {
      const title = item.title.replace(/<\/?[^>]+(>|$)/g, "");
      const lprice = parseInt(item.lprice);
      return `${index + 1}. ${title}\n   가격: ${lprice.toLocaleString()}원\n   판매처: ${item.mallName}\n   링크: ${item.link}`;
    }).join('\n\n');

    const priceRangeText = priceRange.min !== null && priceRange.max !== null
      ? `${priceRange.min.toLocaleString()}원에서 ${priceRange.max.toLocaleString()}원 사이의 `
      : '';

    const responseText = `"${keyword}"에 관련된 ${priceRangeText}제품들입니다:\n\n${products}`;

    console.log("[searchProduct] Response:", responseText);

    return {
      _id: Math.random().toString(36).substring(7),
      text: responseText,
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
  } else {
    console.log("[searchProduct] No products found");
    return createErrorResponse(`죄송합니다. "${keyword}"에 관련된 제품을 찾지 못했습니다.`);
  }
} catch (error) {
  console.error('[searchProduct] 제품 검색 오류:', error);
  return createErrorResponse("제품 검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
}
}

function createErrorResponse(message) {  
console.log("[createErrorResponse] Creating error response:", message);
return {
  _id: Math.random().toString(36).substring(7),
  text: message,
  createdAt: new Date(),
  user: { _id: 2, name: 'ChatGPT' },
};
}

export const handleUserResponse = async (response) => {
console.log("[handleUserResponse] Handling user response:", response);
return await getBabyProduct(response);
};