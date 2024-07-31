export const getChinese = async () => {
    const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: "십이지에 대한 정보는 아래 링크를 클릭하여 확인해주세요.",
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
        link: 'Fun',
        linkParams: { selectedTab: 'chineseFortune' },
    };
    return botMessage;
};