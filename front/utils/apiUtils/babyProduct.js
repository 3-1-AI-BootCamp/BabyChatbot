import { API_KEY, NAVER_SHOP_ID, NAVER_SHOP_SECRET } from '@env';

const categories = {
  수유용품: ['젖병', '분유', '모유저장팩', '유축기', '수유쿠션', '수유패드', '젖병소독기', '쪽쪽이', '젖꼭지'],
  이유식용품: ['이유식', '이유식마스터기', '이유식용기', '아기수저', '아기포크', '빨대컵'],
  기저귀용품: ['기저귀', '물티슈', '기저귀케이크', '기저귀가방', '기저귀정리함', '기저귀갈이대'],
  목욕스킨케어: ['베이비로션', '베이비오일', '아기샴푸', '아기욕조', '목욕타올', '아기면봉'],
  수면용품: ['아기침대', '유아베개','아기 베개', '스와들', '아기이불', '모빌', '수면등', '아기침구세트'],
  의류: ['아기옷', '바디수트', '아기내복', '아기양말', '아기모자', '턱받이', '속싸개'],
  외출용품: ['유모차', '아기띠', '카시트', '아기가방', '보행기', '아기썬캡', '아기선글라스'],
  놀이교육용품: ['장난감', '소리나는책', '블록', '모빌', '치발기', '아기체육관', '아기책'],
  안전용품: ['베이비모니터', '콘센트커버', '모서리보호대', '안전문', '미끄럼방지매트'],
  위생용품: ['손소독제', '마스크', '체온계', '콧물흡입기', '아기치약', '아기칫솔', '네일케어세트']
};

export const getBabyProduct = async (question) => {
  console.log("Received question:", question);

  if (!question || typeof question !== 'string') {
    return createErrorResponse("유효한 질문을 입력해주세요.");
  }

  try {
    const intent = await analyzeIntent(question);
    console.log("Analyzed intent:", intent);

    if (intent.isNotBabyProduct) {
      return createErrorResponse("죄송합니다. 아기 용품과 관련된 질문만 답변할 수 있어요.");
    } else if (intent.needsClarification) {
      return {
        _id: Math.random().toString(36).substring(7),
        text: `"${intent.suggestedKeyword}"를 찾으시는 건가요? 맞다면 "${intent.suggestedKeyword} 찾아줘"라고 말씀해 주세요!`,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    } else if (question.toLowerCase().includes('찾아줘')) {
      return await searchProduct(intent.keyword);
    } else {
      return {
        _id: Math.random().toString(36).substring(7),
        text: `${intent.keyword}에 대해 검색하고 싶으시면 "${intent.keyword} 찾아줘"라고 말씀해 주세요!`,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    }
  } catch (error) {
    console.error('Error in getBabyProduct:', error);
    return createErrorResponse("처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};

async function analyzeIntent(question) {
  const allKeywords = Object.values(categories).flat();
  const prompt = `
사용자의 질문: "${question}"

다음은 유효한 아기 용품 키워드 목록입니다:
${allKeywords.join(', ')}

이 질문이 아기 용품과 관련된 것인지 분석해주세요. 다음 형식으로 응답해주세요:
{
  "needsClarification": boolean,
  "keyword": string,
  "suggestedKeyword": string | null,
  "isNotBabyProduct": boolean
}

- needsClarification: 사용자의 질문이 모호하여 추가 설명이 필요한 경우 true
- keyword: 질문에서 찾은 아기 용품 관련 키워드. 반드시 위의 키워드 목록에 있는 것이어야 합니다.
- suggestedKeyword: 질문이 모호할 경우 제안할 키워드. 반드시 위의 키워드 목록에 있는 것이어야 합니다.
- isNotBabyProduct: 질문이 아기 용품과 관련이 없거나, 키워드가 위 목록에 없는 경우 true

주의: 
1. keyword와 suggestedKeyword는 반드시 위의 키워드 목록에 있는 것이어야 합니다.
2. 질문이 아기 용품과 관련이 있어 보이더라도, 정확히 일치하는 키워드가 목록에 없다면 isNotBabyProduct를 true로 설정하세요.
3. needsClarification이 true일 경우, suggestedKeyword를 반드시 제공해야 하며, 이 역시 키워드 목록에 있어야 합니다.
4. isNotBabyProduct가 true일 때는 '죄송합니다. 아기 용품과 관련된 질문만 답변할 수 있어요.'라고 답해야 합니다.

예시:
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

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      const result = JSON.parse(data.choices[0].message.content);
      console.log("API Response:", result);

      // 추가 검증
      if ((!result.keyword || !allKeywords.includes(result.keyword)) && 
          (!result.suggestedKeyword || !allKeywords.includes(result.suggestedKeyword))) {
        result.isNotBabyProduct = true;
      } else {
        result.isNotBabyProduct = false;
        if (!result.keyword && result.suggestedKeyword) {
        result.keyword = result.suggestedKeyword;
      }
}

return result;
    } else {
      throw new Error("Invalid API response");
    }
  } catch (error) {
    console.error("Error in analyzeIntent:", error);
    throw error;
  }
}

async function searchProduct(keyword) {
  console.log("searchProduct - 검색 키워드:", keyword);
  try {
    const query = encodeURIComponent(keyword);
    const url = `https://openapi.naver.com/v1/search/shop.json?query=${query}&display=3`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': NAVER_SHOP_ID,
        'X-Naver-Client-Secret': NAVER_SHOP_SECRET,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const products = data.items.slice(0, 3).map((item, index) => {
        const title = item.title.replace(/<\/?[^>]+(>|$)/g, "");
        const lprice = parseInt(item.lprice);
        const hprice = parseInt(item.hprice);
        let priceText = `${lprice.toLocaleString()}원`;
        if (hprice > 0 && hprice !== lprice) {
          priceText = `${lprice.toLocaleString()}원 ~ ${hprice.toLocaleString()}원`;
        }
        return `${index + 1}. ${title}\n   가격: ${priceText}\n   판매처: ${item.mallName}\n   링크: ${item.link}`;
      }).join('\n\n');

      console.log("searchProduct - 검색 결과:", products);
      return {
        _id: Math.random().toString(36).substring(7),
        text: `"${keyword}"에 관련된 제품들입니다:\n\n${products}`,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    } else {
      return createErrorResponse(`죄송합니다. "${keyword}"에 관련된 제품을 찾지 못했습니다.`);
    }
  } catch (error) {
    console.error('searchProduct - 제품 검색 오류:', error);
    return createErrorResponse("제품 검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
}

function createErrorResponse(message) {
  return {
    _id: Math.random().toString(36).substring(7),
    text: message,
    createdAt: new Date(),
    user: { _id: 2, name: 'ChatGPT' },
  };
}

export const handleUserResponse = async (response) => {
  return await getBabyProduct(response);
};