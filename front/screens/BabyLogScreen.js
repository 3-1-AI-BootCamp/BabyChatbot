import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../themes/ThemeProvider';
import { FONTS, SIZES } from '../constants';
import BabyLogEntry from '../components/BabyLogEntry';

const BabyLogScreen = () => {
  const { colors } = useTheme();
  const [logs, setLogs] = useState([]);

  const handleSaveLog = (newLog) => {
    setLogs([newLog, ...logs]);
  };

  const renderLogItem = ({ item }) => (
    <View style={[styles.logItem, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.logItemText, { color: colors.text }]}>
        {item.type} - {item.date.toLocaleString()}
      </Text>
      <Text style={[styles.logItemText, { color: colors.text }]}>
        지속 시간: {item.duration}분
      </Text>
      <Text style={[styles.logItemText, { color: colors.text }]}>
        메모: {item.notes}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>아기 로그</Text>
      <BabyLogEntry onSave={handleSaveLog} />
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    marginBottom: SIZES.padding,
  },
  list: {
    flex: 1,
  },
  logItem: {
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  logItemText: {
    ...FONTS.body3,
    marginBottom: 5,
  },
});

export default BabyLogScreen;
