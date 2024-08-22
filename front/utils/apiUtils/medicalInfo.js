export const getMedicalInfo = async (question, host, port) => {
    try {
        // 요청 보낼 url 구성
        const url = `http://${host}:${port}/api/llm/requestLogSave`;

        // 요청 본문 구성
        const requestBody = {
            chatSentence: question,
        };

        // 요청 보내기
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // 응답을 JSON으로 변환
        const data = await response.json();

        // 응답 반환
        // 메시지를 생성하여 반환합니다.
        function createResponse(message) {
            return {
                _id: Math.random().toString(36).substring(7),
                text: message,
                createdAt: new Date(),
                user: { _id: 2, name: 'ChatGPT' },
            };
        }

        // 받은 응답 메시지를 반환합니다.
        return createResponse(data.message);
    } catch (error) {
        console.error("Error fetching medical info:", error);
        return createResponse("오류가 발생했습니다. 다시 시도해주세요.");
    }
}