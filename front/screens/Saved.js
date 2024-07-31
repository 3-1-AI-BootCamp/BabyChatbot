import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../themes/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Saved = ({ navigation }) => {
  const { colors } = useTheme();
  const [savedChats, setSavedChats] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSavedChats();
    });

    return unsubscribe;
  }, [navigation]);

  const loadSavedChats = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('All keys:', keys);
      const chatKeys = keys.filter(key => key.startsWith('chat_'));
      console.log('Chat keys:', chatKeys);
      const chats = await AsyncStorage.multiGet(chatKeys);
      console.log('Fetched chats:', chats);
      const parsedChats = chats.map(([key, value]) => ({
        id: key,
        messages: JSON.parse(value),
        date: new Date(key.split('_')[1]).toLocaleString(),
      }));
      console.log('Parsed chats:', parsedChats);
      setSavedChats(parsedChats);
    } catch (error) {
      console.error('Error loading saved chats:', error);
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { savedChatData: item })}
    >
      <Text style={[styles.chatDate, { color: colors.text }]}>{item.date}</Text>
      <Text style={[styles.chatPreview, { color: colors.text }]}>
        {item.messages[0]?.text.substring(0, 50)}...
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {savedChats.length > 0 ? (
        <FlatList
          data={savedChats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={[styles.noChatsText, { color: colors.text }]}>
          저장된 대화가 없습니다.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  chatPreview: {
    fontSize: 16,
  },
  noChatsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default Saved;