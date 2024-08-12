const fortuneConfig = {
    '사주': { selectedTab: 'sajuFortune', message: "사주에 대한 정보는 아래 링크를 클릭하여 확인해주세요." },
    '운세': { selectedTab: 'zodiacFortune', message: "운세에 대한 정보는 아래 링크를 클릭하여 확인해주세요." },
    //'십이지 운세': { selectedTab: 'chineseFortune', message: "십이지에 대한 정보는 아래 링크를 클릭하여 확인해주세요." },
};

export const getFortune = async (tag) => {
    const config = fortuneConfig[tag];
    if (!config) {
        throw new Error("Invalid tag for fortune");
    }

    const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: config.message,
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
        link: 'Fun',
        linkParams: { selectedTab: config.selectedTab },
    };

    return botMessage;
};
