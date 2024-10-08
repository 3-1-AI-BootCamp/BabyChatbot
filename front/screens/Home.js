import React from 'react';
import { StyleSheet, Text, View, Image, Pressable, Dimensions, SafeAreaView } from 'react-native';
import { useTheme } from '../themes/ThemeProvider';
import { images } from '../constants';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

// 홈 화면
const Home = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.backdesignContainer}>
        <Image
          style={styles.backdesignIcon}
          source={images.backDesign}
        />
        <View style={styles.iconContainer}>
          <Pressable onPress={() => navigation.goBack()} style={styles.iconWrapper}>
            <Image
              style={styles.icon}
              source={images.back}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.centerIconContainer}>
        <Image
          style={styles.centerIcon}
          source={images.icon}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.babyChat}>
            <Text style={styles.babyText}>BABY</Text>
            <Text style={styles.chatText}>CHAT</Text>
          </Text>
        </View>

        <Pressable style={styles.wrapper} onPress={() => navigation.navigate('HospitalMapScreen')}>
          <Text style={styles.text}>근처 병원 찾기</Text>
        </Pressable>
        <Pressable style={styles.wrapper} onPress={() => navigation.navigate('Fun')}>
          <Text style={styles.text}>오늘의 무당님</Text>
        </Pressable>
        <Pressable style={styles.wrapper} onPress={() => navigation.navigate('FAQ')}>
          <Text style={styles.text}>지원 정보</Text>
        </Pressable>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.startChatContainer}>
          <Pressable style={styles.startChatButton} onPress={() => navigation.navigate('Chat')}>
            <Text style={styles.startChatText}>채팅 시작</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  backdesignContainer: {
    height: hp(30),
    overflow: 'hidden',
    position: 'relative',
  },
  backdesignIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  iconContainer: {
    position: 'absolute',
    top: hp(5),
    left: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginHorizontal: wp(2),
    marginTop: hp(1.3),
  },
  icon: {
    width: wp(6),
    height: wp(6),
  },
  centerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -hp(20), // 위치 조정
  },
  centerIcon: {
    width: wp(20),
    height: wp(20),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  babyChat: {
    fontSize: fp(7),
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  babyText: {
    color: '#0487E2',
  },
  chatText: {
    color: '#000000',
  },
  wrapper: {
    height: hp(7),
    width: wp(84),
    borderRadius: wp(5),
    padding: wp(2),
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#B0D6F5',
    alignItems: 'center',
    marginVertical: hp(1.5),
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    fontSize: fp(4.1),
    marginBottom: hp(1),
  },
  bottomSection: {
    width: wp(100),
    alignItems: 'center',
  },
  bottomButton: {
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    width: wp(25),
    height: hp(6),
    backgroundColor: '#B0C4DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startChatContainer: {
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    backgroundColor: '#ffffff',
    height: hp(23),
    width: wp(100),
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp(4),
    paddingBottom: hp(3),
  },
  startChatButton: {
    backgroundColor: '#0487E2',
    width: wp(84),
    borderRadius: wp(5),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(10),
  },
  startChatText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: fp(2.5),
  },
});

export default Home;