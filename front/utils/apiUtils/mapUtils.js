import * as Location from 'expo-location';
import { Linking } from 'react-native';

export const openMap = async (start, end, destinationName) => {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${start.latitude},${start.longitude}&destination=${encodeURIComponent(destinationName)}&travelmode=driving`;
  
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    console.log("Don't know how to open this URL: " + url);
  }
};