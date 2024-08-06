import { API_KEY } from '@env';

export const getConsulting = async (question) => {
  try {
    const messages = [
      { 
        role: 'system', 
        content: '아기 용품에 대한 정보' 
      },
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