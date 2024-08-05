import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../themes/ThemeProvider';
import { images } from '../constants';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

const FAQ = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const faqItems = [
    "수면 교육은 어떻게 해야 하나요?",
    "아기용품은 어떤것이 필요한가요?",
    "뒤집기를 어려워 해요",
    "이유식을 안먹어요",
    "기저귀 가방은 어떻게 준비 해야 하나요",
    "태열인가요 땀띠 인가요",
    "수유 텀과 수유 량을 어떻게 조절해야 하나요?",
    "유모차를 무서워 해요",
    "쪽쪽이를 언제 물려야 하나요"
  ];

  const handleFAQPress = (question) => {
    navigation.navigate('Chat', { initialQuestion: question });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Image
            style={styles.headerIcon}
            source={images.back}
          />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={images.icon}
          />
        </View>
        <View style={styles.headerButton} />
      </View>
      <ScrollView style={styles.scrollView}>
        {faqItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.faqItem} onPress={() => handleFAQPress(item)}>
            <Text style={[styles.faqText, { color: colors.text }]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        height: hp(8) + StatusBar.currentHeight,
        paddingTop: StatusBar.currentHeight,
    },
    headerButton: {
        padding: wp(2),
        width: wp(3), // 뒤로 가기 버튼의 너비를 고정
    },
    headerIcon: {
        width: wp(6),
        height: wp(6),
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: wp(10),
        height: wp(10),
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: hp(2),
        backgroundColor: '#add8e6',
    },
    tabButton: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(5),
        borderRadius: wp(5),
        backgroundColor: '#0487E2',
    },
    tabButtonText: {
        color: '#fff',
        fontSize: fp(2),
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentText: {
        fontSize: fp(2.5),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        paddingHorizontal: wp(10),
    },
  scrollView: {
    flex: 1,
    padding: wp(5),
  },
  faqItem: {
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  faqText: {
    fontSize: fp(2.8),
  },
});

export default FAQ;