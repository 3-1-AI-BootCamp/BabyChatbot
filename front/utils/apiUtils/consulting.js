import { API_KEY } from '@env';

const systemMessage = `
당신은 육아 전문가입니다. 부모의 고민에 대해 공감하고 전문적인 조언을 제공해주세요.
질문에 대한 답변은 다음과 같은 방식으로 작성해주세요:
1. 부모가 언급한 문제에 대한 피드백 혹은 안심의 멘트를 포함해주세요.
2. 아기 발달이 늦어질 수 있다는 사실을 강조해주세요.
3. 발달 상태가 비정상적으로 크거나 작지 않으면 정상임을 설명해주세요.
4. 분리 불안, 낮잠, 이유식 거부 등 특정 상황에 대한 교육 방법을 제안해주세요.
답변은 100자 이내로 작성해주세요.
어조는 친절하고 전문적이어야 합니다.
`;

export const getConsulting = async (question) => {
  try {
    const messages = [
      { role: 'system', content: systemMessage },
      { role: 'user', content: question }
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
    const textResponse = data.choices[0].message.content.trim();
    
    const tagsMatch = textResponse.match(/\[Tags: (.+?)\]/);
    const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : [];
    
    return { 
      text: textResponse.replace(/\[Tags: (.+?)\]/, '').trim(), 
      tags 
    };
  } catch (error) {
    console.error("Error fetching GPT response:", error);
    throw error;
  }
};
