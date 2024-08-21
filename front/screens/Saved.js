import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, Dimensions, StatusBar, Alert } from 'react-native';
import { useTheme } from '../themes/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '../constants';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

// 채팅 히스토리 화면
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
        date: new Date(key.split('_')[1]),
      }));
      // 최신 날짜순으로 정렬
      parsedChats.sort((a, b) => b.date - a.date);
      setSavedChats(parsedChats);
    } catch (error) {
      console.error('Error loading saved chats:', error);
    }
  };

  const clearAllChats = async () => {
    Alert.alert(
      "모든 대화 삭제",
      "정말로 모든 저장된 대화를 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "삭제",
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const chatKeys = keys.filter(key => key.startsWith('chat_'));
              await AsyncStorage.multiRemove(chatKeys);
              setSavedChats([]);
            } catch (error) {
              console.error('Error clearing chats:', error);
            }
          }
        }
      ]
    );
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { savedChatData: item })}
    >
      <Text style={[styles.chatDate, { color: colors.text }]}>{item.date.toLocaleString()}</Text>
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
            source={images.back}
          />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={images.icon}
          />
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={clearAllChats}>
          <Image
            style={styles.headerIcon}
            source={images.trash}
          />
        </TouchableOpacity>
      </View>
      {savedChats.length > 0 ? (
        <FlatList
          data={savedChats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
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
  contentContainer: {
    paddingBottom: hp(10), // 하단바를 위한 여백 추가
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