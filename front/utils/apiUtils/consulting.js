import { API_KEY } from '@env';

const systemMessage = `
당신은 육아 전문가입니다. 부모의 고민에 대해 공감하고 전문적인 조언을 제공해주세요.
질문에 대한 답변은 다음과 같은 방식으로 작성해주세요:
부모가 언급한 문제에 대한 피드백을 제공하거나 안심시켜주세요.

발달에 문제가 있다는 질문의 경우, "괜찮다"는 말을 강조해주세요.
발달 상태가 비정상적으로 크거나 작지 않다면, 정상임을 설명해주세요.

특정 상황에 대한 교육 방법 제안:
분리 불안, 낮잠, 이유식 거부 등 특정 상황에 대한 교육 방법을 제안해주세요.

친절하고 안심을 줄 수 있는 어조로 답변해주세요.
답변에 문법과 맞춤법을 한 번 더 확인해주세요.

답변에 질문을 넣어 대화 형식이 되도록 해주세요.
하지만, 답변이 충분하고 대화를 마쳐야 할 때는 질문을 넣지 마세요.

답변은 250자 이내로 짧게 작성해주세요.
필요에 따라 긴 답변도 가능합니다.
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
