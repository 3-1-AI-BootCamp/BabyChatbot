import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../themes/ThemeProvider';
import { FONTS, SIZES } from '../constants';

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.faqItem}>
      <TouchableOpacity onPress={onToggle} style={styles.questionContainer}>
        <Text style={[styles.question, { color: colors.text }]}>{question}</Text>
        <Text style={[styles.toggleIcon, { color: colors.text }]}>{isOpen ? '-' : '+'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <Text style={[styles.answer, { color: colors.text }]}>{answer}</Text>
      )}
    </View>
  );
};

const FAQScreen = () => {
  const { colors } = useTheme();
  const [openItems, setOpenItems] = useState({});

  const faqData = [
    {
      question: "챗봇은 어떤 정보를 제공하나요?",
      answer: "우리 챗봇은 육아와 관련된 다양한 정보를 제공합니다. 아기의 발달 단계, 건강 관리 팁, 식단 제안 등을 포함합니다."
    },
    {
      question: "챗봇의 답변은 얼마나 신뢰할 수 있나요?",
      answer: "챗봇의 답변은 신뢰할 수 있는 소스에서 가져온 정보를 기반으로 합니다. 하지만 의료적인 조언이 필요한 경우에는 반드시 전문의와 상담하시기 바랍니다."
    },
    {
      question: "개인정보는 어떻게 보호되나요?",
      answer: "사용자의 개인정보 보호는 우리의 최우선 과제입니다. 모든 대화 내용은 암호화되어 저장되며, 제3자와 공유되지 않습니다."
    },
    {
      question: "챗봇을 사용하는 데 비용이 드나요?",
      answer: "기본적인 챗봇 서비스는 무료로 제공됩니다. 추가적인 프리미엄 기능에 대해서는 앱 내에서 자세히 안내해 드리고 있습니다."
    },
    {
      question: "챗봇이 이해하지 못하는 질문을 하면 어떻게 되나요?",
      answer: "챗봇이 질문을 이해하지 못하는 경우, 질문을 다시 명확하게 해달라고 요청하거나 관련된 일반적인 정보를 제공합니다. 지속적으로 개선 중이니 피드백 주시면 감사하겠습니다."
    }
  ];

  const toggleItem = (index) => {
    setOpenItems(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>자주 묻는 질문</Text>
      <ScrollView style={styles.scrollView}>
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openItems[index]}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    marginBottom: SIZES.padding,
  },
  scrollView: {
    flex: 1,
  },
  faqItem: {
    marginBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: SIZES.padding,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    ...FONTS.body3,
    fontWeight: 'bold',
    flex: 1,
  },
  toggleIcon: {
    fontSize: 24,
    marginLeft: 10,
  },
  answer: {
    ...FONTS.body4,
    marginTop: SIZES.padding / 2,
  },
});

export default FAQScreen;