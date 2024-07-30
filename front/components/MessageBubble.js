import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Bubble } from 'react-native-gifted-chat';
import { COLORS, images } from '../constants';

const MessageBubble = (props) => {
  const { currentMessage, onQuickReply } = props;

  if (currentMessage.quickReply) {
    return (
      <View style={styles.exampleQuestionContainer}>
        <TouchableOpacity 
          style={styles.exampleQuestionButton}
          onPress={() => onQuickReply(currentMessage.text)}
        >
          <Text style={styles.exampleQuestionText}>{currentMessage.text}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentMessage.user._id === 1) {
    return (
      <View style={styles.rightMessage}>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: COLORS.primary,
              borderRadius: 20,
              padding: 8,
            },
          }}
          textStyle={{
            right: {
              color: COLORS.white,
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
              backgroundColor: '#ADD8E6',
              borderRadius: 20,
              padding: 8,
            },
          }}
          textStyle={{
            left: {
              color: '#000000',
              fontSize: 16,
            },
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
    exampleQuestionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 5,
        marginRight: 10,
      },
    exampleQuestionButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 10,
        maxWidth: '80%',
      },
    exampleQuestionText: {
        color: COLORS.white,
        fontSize: 16,
      },
    rightMessage: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
        marginRight: 10,
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
});

export default MessageBubble;
