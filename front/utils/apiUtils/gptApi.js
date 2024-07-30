//import { API_KEY } from '@env';

// export const generateGPTResponse = async (question, includeTags = false) => {
//   try {
//     const messages = [
//       { role: 'user', content: question }
//     ];

//     if (includeTags) {
//       messages.push({
//         role: 'system',
//         content: '다음 문장의 주제를 분류하고, [Tags: 주제] 형식으로 태그를 추가해주세요. 태그는 가장 유사한 것으로 한 가지만 달아야 합니다: 병원 위치, 병원, 의학 정보, 아이 태몽, 아이 사주, 아이 별자리, 오늘의 운세, 부모 고민 상담, 기타'
//       });
//     }

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'gpt-3.5-turbo',
//         messages: messages,
//       }),
//     });
//     const data = await response.json();

//     if (includeTags) {
//       const textResponse = data.choices[0].message.content.trim();
//       const tagsMatch = textResponse.match(/\[Tags: (.+?)\]/);
//       const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : [];
//       return { text: textResponse.replace(/\[Tags: (.+?)\]/, '').trim(), tags };
//     }

//     return data.choices[0].message.content.trim();
//   } catch (error) {
//     console.error("Error fetching GPT response:", error);
//     throw error;
//   }
// };

// apiUtils.js 또는 해당 파일 내에 있는 generateGPTResponse 함수
export const generateGPTResponse = async (question, flag) => {
    // 고정된 응답을 반환하도록 설정
    return {
      text: "병원 위치",
      tags: ["병원 위치"],
    };
  };
  