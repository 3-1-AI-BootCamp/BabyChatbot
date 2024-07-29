import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AstrologyCard from '../components/AstrologyCard';
import { useTheme } from '../themes/ThemeProvider';
import { getAstrologyInfo } from '../services/astrologyApiService';

const AstrologyScreen = () => {
  const [astrologyInfo, setAstrologyInfo] = useState(null);
  const { colors } = useTheme();

  useEffect(() => {
    fetchAstrologyInfo();
  }, []);

  const fetchAstrologyInfo = async () => {
    try {
      const info = await getAstrologyInfo();
      setAstrologyInfo(info);
    } catch (error) {
      console.error('Error fetching astrology info:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>별자리 & 사주 정보</Text>
      {astrologyInfo ? (
        <AstrologyCard info={astrologyInfo} />
      ) : (
        <Text style={{ color: colors.text }}>정보를 불러오는 중...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default AstrologyScreen;
