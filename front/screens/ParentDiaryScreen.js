import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../themes/ThemeProvider';
import { FONTS, SIZES } from '../constants';
import Button from '../components/Button';

// 임시로 DiaryEntry 컴포넌트를 여기에 정의합니다.
const DiaryEntry = ({ entry }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.entryContainer, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.entryDate, { color: colors.text }]}>{entry.date}</Text>
      <Text style={[styles.entryContent, { color: colors.text }]}>{entry.content}</Text>
    </View>
  );
};

const ParentDiaryScreen = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const { colors } = useTheme();

  useEffect(() => {
    // TODO: 실제 데이터를 불러오는 로직으로 대체해야 합니다.
    setDiaryEntries([
      { id: '1', date: '2024-01-01', content: '아이가 처음으로 걸음마를 했어요!' },
      { id: '2', date: '2024-01-05', content: '오늘은 아이와 함께 공원에 다녀왔습니다.' },
    ]);
  }, []);

  const addNewEntry = () => {
    // TODO: 새 일기 작성 화면으로 이동하는 로직을 구현해야 합니다.
    console.log('새 일기 작성');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>부모 일기장</Text>
      <FlatList
        data={diaryEntries}
        renderItem={({ item }) => <DiaryEntry entry={item} />}
        keyExtractor={(item) => item.id}
      />
      <Button title="새 일기 작성" onPress={addNewEntry} />
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
  entryContainer: {
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  entryDate: {
    ...FONTS.body4,
    marginBottom: 5,
  },
  entryContent: {
    ...FONTS.body3,
  },
});

export default ParentDiaryScreen;