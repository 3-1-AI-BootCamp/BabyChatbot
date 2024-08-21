const infoConfig = {
    'support': { selectedTab: 'supportInfo', message: "육아 보조금에 대한 정보는 아래 링크를 클릭하여 확인해주세요." },
    'vaccination': { selectedTab: 'vaccinationInfo', message: "예방 접종에 대한 정보는 아래 링크를 클릭하여 확인해주세요." },
};

// 정보 관련 태그가 나왔을 경우의 처리... 인데 이거 흔적기관임
export const getInfo = async (tag) => {
    const config = infoConfig[tag];
    if (!config) {
        throw new Error("에러!");
    }

    const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: config.message,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
        link: 'FAQ',
        linkParams: { activeTab: tag },
    };

    return botMessage;
};
