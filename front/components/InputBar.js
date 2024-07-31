import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../constants';

const InputBar = ({ value, onChangeText, onSend, isTyping }) => {
  return (
    <View style={styles.inputBar}>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="질문을 입력하세요"
          placeholderTextColor={COLORS.secondaryGray}
          style={styles.input}
        />
        <TouchableOpacity onPress={onSend} style={styles.sendButton}>
          <FontAwesome name="send-o" color={COLORS.white} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default InputBar;
