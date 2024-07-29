import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarComponent from '../components/CalendarComponent';
import { useTheme } from '../themes/ThemeProvider';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { colors } = useTheme();

  const onDateChange = (date) => {
    setSelectedDate(date);
    // TODO: Fetch events for the selected date
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>캘린더</Text>
      <CalendarComponent onDateChange={onDateChange} />
      <View style={styles.eventList}>
        {/* TODO: Display events for the selected date */}
        <Text style={{ color: colors.text }}>선택된 날짜: {selectedDate.toDateString()}</Text>
      </View>
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
  eventList: {
    marginTop: 16,
  },
});

export default CalendarScreen;
