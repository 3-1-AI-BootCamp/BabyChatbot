import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import { useTheme } from '../themes/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

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
      const chatKeys = keys.filter(key => key.startsWith('chat_'));
      const chats = await AsyncStorage.multiGet(chatKeys);
      const parsedChats = chats.map(([key, value]) => ({
        id: key,
        messages: JSON.parse(value),
        date: new Date(key.split('_')[1]).toLocaleString(),
      }));
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Image
            style={styles.headerIcon}
            source={require('../assets/images/back.png')}
          />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={require('../assets/images/icon.jpg')}
          />
        </View>
        <View style={styles.headerButton} />
      </View>
      {savedChats.length > 0 ? (
        <FlatList
          data={savedChats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          style={styles.content}
        />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.contentText, { color: colors.text }]}>
            저장된 대화가 없습니다.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: wp(10),
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
  content: {
    flex: 1,
  },
  contentText: {
    fontSize: fp(2.5),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: wp(10),
    marginTop: hp(20),
  },
  chatItem: {
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatDate: {
    fontSize: fp(1.8),
    marginBottom: hp(0.5),
  },
  chatPreview: {
    fontSize: fp(2),
  },
});

export default Saved;