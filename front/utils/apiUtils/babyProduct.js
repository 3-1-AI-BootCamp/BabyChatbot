import { API_KEY, NAVER_SHOP_ID, NAVER_SHOP_SECRET } from '@env';
import { categories } from '../../constants/categories'; 
import { startTokenUsageTracking, endTokenUsageTracking, trackTokenUsage, isTracking, getAccumulatedTokenUsage } from './tokenTracker';


startTokenUsageTracking();

//질문관련 프롬포트 생성
const generateBasePrompt = (question, allKeywords) => `
사용자의 질문: "${question}"
유효한 아기 용품 키워드: ${allKeywords.join(', ')}
`;


//사용자의 질문이 정보요청인지 확인하기 위한 프롬포트
const generateInfoRequestPrompt = (question, allKeywords) => `
${generateBasePrompt(question, allKeywords)}

이 질문이 아기 용품에 대한 정보 요청인지 분석해주세요. 다음 형식으로 응답해주세요:
{
  "needsClarification": boolean,
  "keyword": string,
  "suggestedKeyword": string | null,
  "isNotBabyProduct": boolean
}

- needsClarification: 사용자의 질문이 모호하여 추가 설명이 필요한 경우 true
- keyword: 질문에서 찾은 아기 용품 관련 키워드. 가능한 한 위의 키워드 목록에 있는 것을 선택하세요.
- suggestedKeyword: 질문이 모호할 경우 제안할 키워드. 가능한 한 위의 키워드 목록에 있는 것을 선택하세요.
- isNotBabyProduct: 질문이 아기 용품과 전혀 관련이 없는 경우에만 true로 설정하세요.

주의사항:
1. keyword와 suggestedKeyword는 가능한 한 위의 키워드 목록에 있는 것을 선택하되, 정확히 일치하지 않더라도 가장 연관성 있는 키워드를 선택하세요.
2. 질문이 간접적으로라도 아기 용품과 관련이 있다면, isNotBabyProduct를 false로 설정하고 가장 적절한 키워드를 선택하세요.

사용자의 질문을 분석하고 위의 지침에 따라 JSON 형식으로만 응답해주세요.
`;

//사용자의 질문이 아기용품 검색인지 확인하기 위한 프롬포트
const generateProductSearchPrompt = (question, allKeywords) => `
${generateBasePrompt(question, allKeywords)}

이 질문이 아기 용품을 찾는 요청인지 분석해주세요. 다음 형식으로 응답해주세요:
{
  "needsClarification": boolean,
  "keyword": string,
  "additionalKeywords": string[],
  "isNotBabyProduct": boolean,
  "priceRange": {
    "min": number | null,
    "max": number | null
  },
  "isBabyProductButNotInList": boolean
}

- needsClarification: 사용자의 질문이 모호하여 추가 설명이 필요한 경우 true
- keyword: 질문에서 찾은 주요 아기 용품 관련 키워드. 가능한 한 위의 키워드 목록에 있는 것을 선택하세요. 정확히 일치하는 키워드가 없다면, 가장 유사하거나 연관성 있는 키워드를 선택하세요.
- additionalKeywords: 주요 키워드와 함께 검색에 포함할 추가 키워드들. 최대 2개까지 포함할 수 있습니다. 이는 키워드 목록에 없는 단어일 수 있습니다.
- isNotBabyProduct: 질문이 아기 용품과 전혀 관련이 없는 경우에만 true로 설정하세요.
- priceRange: 사용자가 언급한 가격 범위. 만원 단위로 해석합니다. 예를 들어, "3만원대"는 min: 30000, max: 39999로 설정합니다.
- isNotBabyProduct: 질문이 아기 용품과 전혀 관련이 없는 경우에만 true로 설정하세요.
  "isBabyProductButNotInList": boolean
}

- needsClarification: 사용자의 질문이 모호하여 추가 설명이 필요한 경우 true
- keyword: 질문에서 찾은 주요 아기 용품 관련 키워드. 가능한 한 위의 키워드 목록에 있는 것을 선택하세요. 정확히 일치하는 키워드가 없다면, 가장 유사하거나 연관성 있는 키워드를 선택하세요.
- additionalKeywords: 주요 키워드와 함께 검색에 포함할 추가 키워드들. 최대 2개까지 포함할 수 있습니다. 이는 키워드 목록에 없는 단어일 수 있습니다.
- isNotBabyProduct: 질문이 아기 용품과 전혀 관련이 없는 경우에만 true로 설정하세요.
- priceRange: 사용자가 언급한 가격 범위. 만원 단위로 해석합니다. 예를 들어, "3만원대"는 min: 30000, max: 39999로 설정합니다.
- isBabyProductButNotInList: 질문이 아기 용품과 관련이 있지만, 주어진 키워드 목록에 없는 경우 true로 설정하세요.

주의사항:
1. keyword는 가능한 한 위의 키워드 목록에 있는 것을 선택하되, 정확히 일치하지 않더라도 가장 연관성 있는 키워드를 선택하세요.
2. 질문이 간접적으로라도 아기 용품과 관련이 있다면, isNotBabyProduct를 false로 설정하고 가장 적절한 키워드를 선택하세요.
3. 가격 범위가 명시되지 않았다면 priceRange의 min과 max를 null로 설정하세요.
4. 질문이 모호하거나 추가 설명이 필요한 경우 needsClarification을 true로 설정하세요.
5. 간접적인 표현(예: "하늘에 빙글빙글 도는 것")에 대해서도 적절한 키워드(예: "모빌")를 선택하세요.
6. "장난감"이 언급된 경우, keyword를 "장난감"으로 설정하고 다른 관련 단어들을 additionalKeywords에 포함시키세요.
7. 모호한 질문의 경우에도 가능한 한 관련된 키워드를 추측하여 제공하세요. needsClarification이 true인 경우에도 가장 적절해 보이는 키워드를 선택하세요.
8. 키워드가 주어진 목록에 없더라도, 질문이 아기 용품과 관련이 있다고 판단되면 isNotBabyProduct는 false로, isBabyProductButNotInList는 true로 설정하세요.
9. 아기체온계, 손소독제 등과 같이 목록에 없지만 아기와 관련될 수 있는 제품도 아기 용품으로 간주하세요.

사용자의 질문을 분석하고 위의 지침에 따라 JSON 형식으로만 응답해주세요.
`;

// 사용자의 질문을 처리하는 메인 함수
export const getBabyProduct = async (question) => {
  console.log("Starting getBabyProduct with question:", question);
  console.log("Is tracking enabled?", isTracking());
  
  // 질문의 유효성을 확인합니다
  if (!question || typeof question !== 'string') {
    return createErrorResponse("유효한 질문을 입력해주세요.");
  }

  try {
    // 질문에 대한 사용자의 의도를 분석합니다
    const intent = await analyzeIntent(question);
    console.log("Intent analysis result:", intent);

    let result;
    
    // 분석 결과에 따라 다양한 의도를 처리합니다
    if (intent.isNotBabyProduct) {
      result = createErrorResponse("죄송합니다. 아기 용품을 찾는 질문만 답변할 수 있어요.");
    } else if (intent.isBabyProductButNotInList) {
      // 제품이 아기 용품과 관련 있지만 미리 정의된 카테고리에 없는 경우
      result = await searchProduct(intent.keyword, intent.additionalKeywords, intent.attributes, intent.priceRange);
    } else if (intent.needsClarification) {
      const suggestedKeyword = intent.keyword || intent.additionalKeywords[0] || "아기 용품";
      result = createResponse(`"${suggestedKeyword}"에 대해 물어보시는 건가요? 조금 더 구체적으로 말씀해 주시겠어요?`);
    } else if (question.toLowerCase().includes('찾아줘')) {
      result = await searchProduct(intent.keyword, intent.additionalKeywords, intent.attributes, intent.priceRange);
    } else {
      result = createResponse(`${intent.keyword}에 대해 검색하고 싶으시면 "${intent.keyword} 찾아줘"라고 말씀해 주세요!`);
    }
    
    // 토큰 사용량 추적을 종료하고 요약을 출력합니다
    const usageResult = endTracking();
    console.log("\n===== Token Usage Summary =====");
    console.log(`Total tokens used: ${usageResult.totalTokens}`);
    console.log("Detailed usage:");
    usageResult.log.forEach((entry, index) => {
      console.log(`${index + 1}. "${entry.question.substring(0, 50)}...": ${entry.totalTokens} tokens`);
    });
    console.log("===============================\n");

    // 누적된 토큰 사용량을 출력합니다
    console.log(`\n===== Accumulated Token Usage =====`);
    console.log(`Total tokens used so far: ${getAccumulatedTokenUsage()} tokens`);
    console.log("===============================\n");

    // 다음 쿼리를 위해 토큰 추적을 다시 시작합니다
    startTracking();

    return result;
  } catch (error) {
    console.error('[getBabyProduct] Error:', error);
    return createErrorResponse("처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};

// GPT 기반 AI를 사용하여 사용자의 의도를 분석합니다
async function analyzeIntent(question) {
  const allKeywords = Object.values(categories).flat();
  
  let prompt;
  if (question.toLowerCase().includes('어떤') || question.toLowerCase().includes('무엇')) {
    prompt = generateInfoRequestPrompt(question, allKeywords);
  } else {
    prompt = generateProductSearchPrompt(question, allKeywords);
  }

  try {
    // 의도 분석을 위해 GPT-4 API에 프롬프트를 전송합니다
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 추적이 활성화된 경우 토큰 사용량을 기록합니다
    if (isTracking()) {
      trackTokenUsage(data.usage, question);
    }

    let result;
    try {
      const content = data.choices[0].message.content.trim();
      console.log("Raw API response:", content);

      // GPT의 메시지에서 JSON 응답을 추출합니다
      const jsonMatch = content.match(/{[\s\S]*}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("JSON 형식의 응답을 찾을 수 없습니다.");
      }
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError);
      console.log("파싱 실패한 내용:", data.choices[0].message.content);
      throw new Error("응답을 파싱할 수 없습니다.");
    }

    // 결과 유효성을 확인하고 필요에 따라 조정합니다
    if (!result || typeof result !== 'object') {
      throw new Error("유효하지 않은 응답 형식");
    }

    // attributes와 additionalKeywords 배열이 초기화되었는지 확인합니다
    if (!result.attributes) {
      result.attributes = [];
    }
    if (!result.additionalKeywords) {
      result.additionalKeywords = [];
    }

    // 질문에 "장난감"이 언급된 경우 처리합니다
    const isToySeeking = question.toLowerCase().includes('장난감');
    if (isToySeeking) {
      result.keyword = '장난감';
      result.isNotBabyProduct = false;
      const otherKeywords = question.toLowerCase().split(' ').filter(word => 
        word !== '장난감' && word !== '찾아줘' && !result.attributes.includes(word));
      result.additionalKeywords = [...(result.additionalKeywords || []), ...otherKeywords];
    } else {
      // "장난감"이 언급되지 않은 경우, 키워드가 아기 용품 목록에 없으면 isNotBabyProduct를 true로 설정합니다
      if (!allKeywords.includes(result.keyword)) {
        result.isNotBabyProduct = true;
      }
    }

    // priceRange 객체를 초기화합니다
    if (!result.priceRange || (result.priceRange.min === null && result.priceRange.max === null)) {
      result.priceRange = { min: null, max: null };
    }

    console.log("Processed intent:", result);  // 로그 추가
    return result;
  } catch (error) {
    console.error("[analyzeIntent] Error:", error);
    throw error;
  }
}

// 키워드, 추가 키워드, 속성 및 가격 범위에 따라 제품을 검색합니다
async function searchProduct(keyword, additionalKeywords, attributes, priceRange, isBabyProductButNotInList) {
  console.log("searchProduct called with:", { keyword, additionalKeywords, attributes, priceRange, isBabyProductButNotInList });
  try {
    const searchTerms = [keyword, ...additionalKeywords, ...attributes].filter(Boolean);
    
    let query;
    if (isBabyProductButNotInList) {
      query = encodeURIComponent(`아기 ${keyword} ${additionalKeywords.join(' ')}`);
    } else {
      query = encodeURIComponent(searchTerms.join(' '));
    }
    const url = `https://openapi.naver.com/v1/search/shop.json?query=${query}&display=100`;

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
    
    if (data.items && data.items.length > 0) {
      let filteredProducts = data.items;

      // 가격 범위가 지정된 경우 필터링을 적용합니다
      if (priceRange && (priceRange.min !== null || priceRange.max !== null)) {
        console.log("Applying price filter:", priceRange);
        filteredProducts = data.items.filter(item => {
          const price = parseInt(item.lprice);
          const minCheck = priceRange.min === null || price >= priceRange.min;
          const maxCheck = priceRange.max === null || price <= priceRange.max;
          return minCheck && maxCheck;
        });

        if (filteredProducts.length === 0) {
          console.log("[searchProduct] No products found in the specified price range");
          return createErrorResponse(`죄송합니다. "${searchTerms.join(' ')}"에 관련된 제품 중 지정된 가격대(${priceRange.min || ''}원 ~ ${priceRange.max || ''}원)의 제품을 찾지 못했습니다.`);
        }
      } else {
        console.log("No price filter applied");
      }

      const products = filteredProducts.slice(0, 3).map((item, index) => {
        const title = item.title.replace(/<\/?[^>]+(>|$)/g, "");
        const lprice = parseInt(item.lprice);
        return `${index + 1}. ${title}\n   가격: ${lprice.toLocaleString()}원\n   판매처: ${item.mallName}\n   링크: ${item.link}`;
      }).join('\n\n');

      const attributesText = attributes && attributes.length > 0 ? ` (${attributes.join(', ')})` : '';
      const additionalKeywordsText = additionalKeywords && additionalKeywords.length > 0 ? ` ${additionalKeywords.join(' ')}` : '';
      const responseText = `"${keyword}${attributesText}"에 관련된 제품들입니다:\n\n${products}`;

      console.log("[searchProduct] Response:", responseText);

      return {
        _id: Math.random().toString(36).substring(7),
        text: responseText,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    } else {
      console.log("[searchProduct] No products found");
      return createErrorResponse(`죄송합니다. "${searchTerms.join(' ')}"에 관련된 제품을 찾지 못했습니다.`);
    }
  } catch (error) {
    console.error('[searchProduct] 제품 검색 오류:', error);
    return createErrorResponse("제품 검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  } 
}

// 메시지를 생성하여 반환합니다
function createResponse(message) {
  return {
    _id: Math.random().toString(36).substring(7),
    text: message,
    createdAt: new Date(),
    user: { _id: 2, name: 'ChatGPT' },
  };
}

// 오류 메시지를 생성하여 반환합니다
function createErrorResponse(message) {
  return createResponse(message);
}

// 사용자의 응답을 처리하는 함수
export const handleUserResponse = getBabyProduct;

// 토큰 사용량 추적을 시작하고 종료하는 함수를 추가합니다
export const startTracking = startTokenUsageTracking;
export const endTracking = endTokenUsageTracking;
