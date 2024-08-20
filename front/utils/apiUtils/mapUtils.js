import { Linking } from 'react-native';

export const openMap = async (url) => {
  // URL 생성
  console.log('Generated Map URL:', url);

  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    console.log("Don't know how to open this URL: " + url);
  }
};
