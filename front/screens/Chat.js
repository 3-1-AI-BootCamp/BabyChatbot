import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { useTheme } from '../themes/ThemeProvider';
import { COLORS, images } from '../constants';
import { API_KEY } from '@env';

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
        <View style={styles.rightMessage}>
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#AEDFF7', // 말풍선 배경 색상
                borderRadius: 20,
                padding: 8,
              },
            }}
            textStyle={{
              right: {
                color: '#000000', // 텍스트 색상
                fontSize: 16,
              },
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.leftMessage}>
          <Image source={images.robot} style={styles.robotIcon} />
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#ADD8E6', // 말풍선 배경 색상
                borderRadius: 20,
                padding: 8,
              },
            }}
            textStyle={{
              left: {
                color: '#000000', // 텍스트 색상
                fontSize: 16,
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
      createAt: new Date(),
      user: { _id: 1 },
    };

    setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]));

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
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Invalid API response');
        }

        setInputMessage('');
        setOutputMessage(data.choices[0].message.content.trim());

        const message = {
          _id: Math.random().toString(36).substring(7),
          text: data.choices[0].message.content.trim(),
          createAt: new Date(),
          user: { _id: 2, name: 'ChatGPT' },
        };

        setIsTyping(false);
        setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
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

    setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]));

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
        if (!data.data || !data.data[0] || !data.data[0].url) {
          throw new Error('Invalid API response');
        }

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

          setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]));
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
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
    <SafeAreaView style={styles.chatContainer}>
      <StatusBar style="auto" />

      <View style={styles.topBox}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarButton}>
          <Image source={require("../assets/images/back.png")} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.babyLogo}>
          <Image source={require("../assets/images/icon.jpg")} style={styles.icon1} />
        </View>
        <TouchableOpacity onPress={() => console.log('Save chat')} style={styles.topBarButton}>
          <Image source={require("../assets/images/list.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.chatContent}>
        <GiftedChat
          messages={messages}
          renderInputToolbar={() => {}}
          user={{ _id: 1 }}
          minInputToolbarHeight={0}
          renderMessage={renderMessage}
          isTyping={isTyping}
        />
      </View>

      <View style={styles.inputBar}>
        <View style={styles.inputContainer}>
          <TextInput
            value={inputMessage}
            onChangeText={handleInputText}
            placeholder="질문을 입력하세요"
            placeholderTextColor={colors.secondaryGray}
            style={styles.input}
          />
          <TouchableOpacity onPress={submitHandler} style={styles.sendButton}>
            <FontAwesome name="send-o" color={COLORS.white} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  topBox: {
    top: 0,
    left: 0,
    width: '100%',
    height: 100,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#d3ebff',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 24,
  },
  babyLogo: {
    flex: 1,
    alignItems: 'center',
  },
  icon1: {
    width: 40,
    height: 40,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -20, // Adjust this value to move the chat up
  },
  rightMessage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  leftMessage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  robotIcon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  inputBar: {
    flexDirection: 'row',
    backgroundColor: '#f0f8ff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondaryGray,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    marginHorizontal: 12,
    borderRadius: 25,
    borderColor: '#0487e2',
    borderWidth: 1,
    alignItems: 'center',
  },
  input: {
    color: COLORS.black,
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    padding: 6,
    borderRadius: 20,
    marginRight: 5,
    backgroundColor: '#0487e2',
  },
});

export default Chat;
