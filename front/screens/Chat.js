// Chat.js

import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Image, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { useTheme } from '../themes/ThemeProvider';
import { API_KEY } from '@env';
import { COLORS, SIZES, images } from '../constants';

const Chat = ({ navigation }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('Results should be shown here.');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const { colors } = useTheme();

  const renderMessage = (props) => {
    const { currentMessage } = props;

    if (currentMessage.user._id === 1) {
      return (
        <View style={styles.userMessageContainer}>
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: COLORS.primary,
                marginRight: 12,
                marginVertical: 12,
                borderRadius: 20,
              },
            }}
            textStyle={{
              right: {
                color: COLORS.white,
              },
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.botMessageContainer}>
          <Image
            source={images.robot}
            style={styles.botAvatar}
          />
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: COLORS.secondaryWhite,
                marginLeft: 12,
                borderRadius: 20,
              },
            }}
            textStyle={{
              left: {
                color: COLORS.black,
              },
            }}
          />
        </View>
      );
    }
  };

  const generateText = () => {
    setIsTyping(true);
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1 },
    };

    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, [message])
    );

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: inputMessage,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error("Invalid API response");
        }

        console.log(data.choices[0].message.content);
        setInputMessage('');
        setOutputMessage(data.choices[0].message.content.trim());

        const message = {
          _id: Math.random().toString(36).substring(7),
          text: data.choices[0].message.content.trim(),
          createdAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };

        setIsTyping(false);
        setMessages((previousMessage) =>
          GiftedChat.append(previousMessage, [message])
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsTyping(false);
      });
  };

  const generateImages = () => {
    setIsTyping(true);
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1 },
    };

    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, [message])
    );

    fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt: inputMessage,
        n: 1,
        size: '1024x1024',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data);

        if (!data.data || !data.data[0] || !data.data[0].url) {
          throw new Error("Invalid API response");
        }

        console.log(data.data[0].url);
        setInputMessage('');
        setOutputMessage(data.data[0].url);
        setIsTyping(false);

        data.data.forEach((item) => {
          const message = {
            _id: Math.random().toString(36).substring(7),
            text: 'Image',
            createdAt: new Date(),
            user: { _id: 2, name: 'ChatGPT' },
            image: item.url,
          };

          setMessages((previousMessage) =>
            GiftedChat.append(previousMessage, [message])
          );
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsTyping(false);
      });
  };

  const submitHandler = () => {
    if (inputMessage.toLowerCase().startsWith('generate image')) {
      generateImages();
    } else {
      generateText();
    }
  };

  const handleInputText = (text) => {
    setInputMessage(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.realIcon}>
          {/* 첫 번째 파일의 아이콘 디자인 */}
        </View>
        <TouchableOpacity onPress={() => console.log('Save chat')}>
          <Ionicons name="bookmark-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.topBox}>
        <Text style={styles.timeText}>9:41</Text>
        <View style={styles.wave} />
        <View style={styles.wifi} />
        <Image style={styles.battery} source={require('../assets/images/battery.png')} />
      </View>

      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          renderInputToolbar={() => {}}
          user={{ _id: 1 }}
          minInputToolbarHeight={0}
          renderMessage={renderMessage}
          isTyping={isTyping}
        />
      </View>

      <View style={styles.quickReplyContainer}>
        <TouchableOpacity style={styles.quickReplyButton}>
          <Text style={styles.quickReplyText}>수면교육</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickReplyButton}>
          <Text style={styles.quickReplyText}>근처 병원 찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickReplyButton}>
          <Text style={styles.quickReplyText}>모유수유</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickReplyButton}>
          <Text style={styles.quickReplyText}>발달단계</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.textInputWrapper}>
          <TouchableOpacity style={styles.plusButton}>
            <Image source={require('../assets/images/plus-icon.svg')} style={styles.plusIcon} />
          </TouchableOpacity>
          <TextInput
            value={inputMessage}
            onChangeText={handleInputText}
            placeholder="질문을 입력하세요"
            placeholderTextColor={colors.secondaryGray}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={submitHandler} style={styles.sendButton}>
            <Image source={require('../assets/images/sending-icon.svg')} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    padding: 10,
  },
  realIcon: {
    // 실제 아이콘 스타일
  },
  topBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  timeText: {
    fontSize: 12,
  },
  wave: {
    // 파형 스타일
  },
  wifi: {
    // 와이파이 아이콘 스타일
  },
  battery: {
    width: 20,
    height: 10,
  },
  chatContainer: {
    flex: 1,
  },
  userMessageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  botAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  quickReplyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  quickReplyButton: {
    padding: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
  },
  quickReplyText: {
    color: COLORS.darkGray,
  },
  inputContainer: {
    padding: 10,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 5,
  },
  plusButton: {
    padding: 10,
  },
  plusIcon: {
    width: 20,
    height: 20,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
  },
  sendButton: {
    padding: 10,
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
});

export default Chat;