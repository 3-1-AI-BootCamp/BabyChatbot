// 아기 용품 태그가 나왔을 경우 처리
import { API_KEY } from '@env';

export const getBabyProduct = async (question) => {
  try {
    const messages = [
      { role: 'user', content: question }
    ];

    if (includeTags) {
      messages.push({
        role: 'system',
        content: '부모 고민 상담에 붙여 줄 메시지를 작성'
      });
    }

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

    if (includeTags) {
      const textResponse = data.choices[0].message.content.trim();
      const tagsMatch = textResponse.match(/\[Tags: (.+?)\]/);
      const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : [];
      return { text: textResponse.replace(/\[Tags: (.+?)\]/, '').trim(), tags };
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching GPT response:", error);
    throw error;
  }
  };