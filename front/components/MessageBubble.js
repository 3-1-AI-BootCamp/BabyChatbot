import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Bubble } from 'react-native-gifted-chat';
import { COLORS, images } from '../constants';
import { useNavigation } from '@react-navigation/native';

// 메시지 버블 컴포넌트
const MessageBubble = (props) => {
    const { currentMessage, onQuickReply } = props;
    const navigation = useNavigation();

    if (!currentMessage || typeof currentMessage !== 'object') {
        // currentMessage가 유효한 객체가 아닌 경우 예외 처리
        console.error('Invalid currentMessage:', currentMessage);
        return null;
    }

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

    if (currentMessage.link) {
        return (
            <View style={styles.linkMessage}>
                <Text style={styles.linkMessageText}>{currentMessage.text}</Text>
                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => navigation.navigate(currentMessage.link, currentMessage.linkParams)}
                >
                    <Text style={styles.linkButtonText}>여기를 클릭하세요</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return currentMessage.user._id === 1 ? (
        <View style={styles.rightMessage}>
            <Bubble
                {...props}
                wrapperStyle={{
                    right: styles.rightBubble,
                }}
                textStyle={{
                    right: styles.rightBubbleText,
                }}
            />
        </View>
    ) : (
        <View style={styles.leftMessage}>
            <Image source={images.robot} style={styles.robotIcon} />
            <Bubble
                {...props}
                wrapperStyle={{
                    left: styles.leftBubble,
                }}
                textStyle={{
                    left: styles.leftBubbleText,
                }}
            />
        </View>
    );
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
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
        marginRight: 10,
    },
    leftMessage: {
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
    linkMessage: {
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#F0F8FF',
        borderRadius: 10,
    },
    linkMessageText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#000',
    },
    linkButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    linkButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    rightBubble: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 8,
    },
    rightBubbleText: {
        color: COLORS.white,
        fontSize: 16,
    },
    leftBubble: {
        backgroundColor: '#ADD8E6',
        borderRadius: 20,
        padding: 8,
    },
    leftBubbleText: {
        color: '#000',
        fontSize: 16,
    },
});

export default MessageBubble;
