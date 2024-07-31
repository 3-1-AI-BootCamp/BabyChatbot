export const getSaju = async () => {
    const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: "사주에 대한 정보는 아래 링크를 클릭하여 확인해주세요.",
        createdAt: new Date(),
        user: { _id: 2, name: 'ChatGPT' },
        link: 'Fun',
        linkParams: { selectedTab: 'sajuFortune' },
    }; 
    return botMessage;
}; 