// 질문에 대한 태그를 붙이는 함수
export const getTag = async (question, host, port) => {
    try {
        const messages = [
            { role: 'user', content: question },
            {
                role: 'system',
                content: '다음 문장의 주제를 분류하고, [Tags: 주제] 형식으로 태그를 추가해주세요. 태그는 가장 유사한 내용으로 다음 중 한 가지만 달아야 합니다: 병원 위치, 병원, 의학 정보, 태몽, 사주, 별자리 운세, 십이지 운세, 부모 고민 상담, 다른 부모들의 답변, 기타'
            }
        ];
        console.log('host, port:', host, port);

        const response = await fetch(`http://${host}:${port}/api/llm/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                modelType: 'openai',
                chatSentence: messages.map(message => message.content).join(' ')
            }),
        });

        const text = await response.text();
        console.log('Response from server:', text);

        // 서버 응답이 이미 태그 형식이므로 바로 처리
        const tagsMatch = text.match(/\[Tags: (.+?)\]/);
        if (!tagsMatch) {
            throw new Error("Invalid response format from server");
        }

        const tags = tagsMatch[1].split(',').map(tag => tag.trim());
        return { text: '', tags }; // text는 빈 문자열로 설정, 태그만 반환

    } catch (error) {
        console.error("Error fetching tag:", error);
        throw error;
    }
};