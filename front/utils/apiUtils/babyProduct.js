import { NAVER_SHOP_ID, NAVER_SHOP_SECRET } from '@env';

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

export const getBabyProduct = async (question) => {
  if (!question || typeof question !== 'string') {
    return {
      _id: Math.random().toString(36).substring(7),
      text: "죄송합니다. 유효한 질문을 입력해주세요.",
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
  }

  const lowercaseQuestion = question.toLowerCase();
  const tags = ['아기 용품'];
  const keywords = lowercaseQuestion.match(/\b\w+\b/g) || [];

  // 키워드 및 카테고리 매칭
  for (const [category, keywordsList] of Object.entries(categories)) {
    for (const keyword of keywordsList) {
      if (lowercaseQuestion.includes(keyword.toLowerCase())) {
        tags.push(keyword, category);
        break;
      }
    }
  }

  const uniqueTags = [...new Set(tags)];
  let query = uniqueTags.join(" ") + " " + keywords.join(" ");
  query = encodeURIComponent(query.trim());

  try {
    const url = `https://openapi.naver.com/v1/search/shop.json?query=${query}&display=3`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': NAVER_SHOP_ID,
        'X-Naver-Client-Secret': NAVER_SHOP_SECRET,
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    //console.log('Response headers:', JSON.stringify(response.headers));

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('API response:', JSON.stringify(data, null, 2));
    
    if (data.items && data.items.length > 0) {
      const recommendedProducts = data.items.slice(0, 3);

      const productList = recommendedProducts.map((item, index) => 
        `${index + 1}. ${item.title} - ${parseInt(item.lprice).toLocaleString()}원\n   링크: ${item.link}`
      ).join('\n\n');

      return {
        _id: Math.random().toString(36).substring(7),
        text: `"${decodeURIComponent(query)}" 검색 결과 추천 상품:\n\n${productList}`,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
      };
    }

    return {
      _id: Math.random().toString(36).substring(7),
      text: `죄송합니다. "${decodeURIComponent(query)}"에 대한 상품을 찾지 못했습니다.`,
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };

  } catch (error) {
    console.error('Error searching for baby products:', error);
    return {
      _id: Math.random().toString(36).substring(7),
      text: "상품을 검색하는 데 문제가 발생했습니다. 나중에 다시 시도해주세요.",
      createdAt: new Date(),
      user: { _id: 2, name: 'ChatGPT' },
    };
  }
};
