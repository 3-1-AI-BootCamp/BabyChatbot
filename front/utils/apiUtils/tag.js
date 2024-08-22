export const getTag = async (question, host, port) => {
    // 요청을 보낼 URL 구성
    const url = `http://${host}:${port}/label`;

    try {
        // 서버로 요청을 보냄
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: question }),
        });

        // 응답을 JSON 형식으로 변환
        const data = await response.json();
        console.log("Data:", data);

        // 응답에서 label 값을 가져옴
        const label = data.label;

        // 결과 반환
        return { text: question, tags: [label] };
    } catch (error) {
        console.error('Error fetching label:', error);
        // 에러가 발생한 경우 기본 값을 반환
        return { text: question, tags: ['육아 의학 정보'] };
    }
};