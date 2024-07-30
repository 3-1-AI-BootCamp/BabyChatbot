import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GiftedChat } from 'react-native-gifted-chat';

import TopBar from '../components/TopBar';
import InputBar from '../components/InputBar';
import MessageBubble from '../components/MessageBubble';
import useChat from '../hooks/useChat';
import { COLORS } from '../constants';

const Chat = ({ navigation }) => {
  const {
    inputMessage,
    setInputMessage,
    isTyping,
    messages,
    generateText,
    endChat,
  } = useChat(navigation);

  const handleBackPress = () => {
    endChat();
    navigation.navigate('Home')
  };

  const handleListPress = () => {
    console.log('Save chat');
  };

  const handleQuickReply = (question) => {
    setInputMessage('');
    generateText(question);
  };

  const handleInputChange = (text) => {
    setInputMessage(text);
  };

  const handleSubmit = () => {
    if (inputMessage.trim()) {
      generateText();
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        <TopBar 
          onBackPress={handleBackPress} 
          onListPress={handleListPress} 
        />

        <View style={styles.chatContent}>
          <GiftedChat
            messages={messages}
            renderInputToolbar={() => null}
            user={{ _id: 1 }}
            minInputToolbarHeight={0}
            renderMessage={(props) => (
              <MessageBubble 
                {...props} 
                onQuickReply={handleQuickReply}
              />
            )}
            isTyping={isTyping}
          />
        </View>

        <InputBar
          value={inputMessage} // value prop 설정
          onChangeText={handleInputChange} // onChangeText prop 설정
          onSend={handleSubmit} // onSend prop 설정
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  chatContent: {
    flex: 1,
    paddingTop: 10,
  },
});

export default Chat;