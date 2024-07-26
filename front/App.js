import React, { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { FontFamily } from './constants/Globalstyles';
import AppNavigation from './navigations/AppNavigation';
import { ThemeProvider } from './themes/ThemeProvider';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Thin': require('./assets/fonts/Roboto-Thin.ttf'),
    'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // 폰트가 로드되면 SplashScreen을 숨깁니다.
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

    return (
        <ThemeProvider>
            <SafeAreaProvider onLayout={onLayoutRootView}>
                <AppNavigation />
            </SafeAreaProvider>
        </ThemeProvider>
    );
}
