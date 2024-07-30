import * as React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from "../themes/ThemeProvider";
import { FontFamily } from "../constants/Globalstyles";
import { COLORS, FONTS, SIZES, images } from '../constants';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';

const Welcome = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <PageContainer>
        <View style={styles.int}>
          <View style={styles.iconParent}>
            <Image
              style={styles.icon}
              contentFit="cover"
              source={images.icon}
            />
            <Text style={styles.babyChat}>
              <Text style={styles.babyChatTxtContainer}>
                <Text style={styles.baby}>BABY</Text>
                <Text style={styles.text}>{` `}</Text>
                <Text style={styles.chat}>CHAT</Text>
              </Text>
            </Text>
          </View>
          <Button
            title="로그인"
            filled
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          />
          <Button
            title="회원가입"
            onPress={() => navigation.navigate('Register')}
            style={styles.button}
          />
          <Button
            title="점프 홈"
            onPress={() => navigation.navigate('Home')}
            style={styles.button}
          />
          <Button
            title="점프 탭네비"
            onPress={() => navigation.navigate('BottomTabNavigation')}
            style={styles.button}
          />
        </View>
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 148,
    height: 146,
  },
  baby: {
    color: "#0487e2",
  },
  text: {
    color: "#0463ca",
  },
  chat: {
    color: "#000",
  },
  babyChatTxtContainer: {
    width: "100%",
  },
  babyChat: {
    fontSize: 45,
    fontWeight: "700",
    fontFamily: FontFamily.obotoBold,
    textAlign: "center",
    display: "flex",
    alignItems: "flex-end",
    width: 243,
    marginTop: 30,
  },
  iconParent: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  int: {
    backgroundColor: "#fff",
    flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: SIZES.width - 44,
    marginBottom: SIZES.padding,
  },
});

export default Welcome;
