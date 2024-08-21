import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, StatusBar, Dimensions, SafeAreaView } from 'react-native';
import { useTheme } from '../themes/ThemeProvider';  // 테마 프로바이더 import 추가
import { images } from '../constants';

// 앱 위쪽 바 컴포넌트
const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

const TopBar = ({ onBackPress, onListPress }) => {
  const { colors } = useTheme();  // useTheme 훅 사용

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={onBackPress} style={styles.headerButton}>
          <Image source={images.back} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <Image source={images.icon} style={styles.centerIcon} />
        </View>
        <TouchableOpacity onPress={onListPress} style={styles.headerButton}>
          <Image source={images.list} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    height: hp(8),
  },
  headerButton: {
    padding: wp(2),
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: wp(6),
    height: wp(6),
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcon: {
    width: wp(10),
    height: wp(10),
  },
});

export default TopBar;