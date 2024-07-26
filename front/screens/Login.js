import * as React from "react";
import { Alert, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useReducer, useState, useEffect } from 'react';
import { Padding, Color, Border, FontSize, FontFamily } from "../constants/Globalstyles";
import Input from '../components/Input';
import Button from '../components/Button';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import { useTheme } from '../themes/ThemeProvider';

const initialState = {
  inputValues: {
    email: '',
    password: '',
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const Login = ({ navigation }) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { colors } = useTheme();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  const loginHandler = () => {
    // 로그인 검증 과정을 건너뛰고 바로 다음 화면으로 이동
    navigation.navigate('BottomTabNavigation');
  };

  // handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('오류가 발생했습니다!', error);
    }
  }, [error]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.login}>
        <Image
          style={styles.backdesignIcon}
          source={require("../assets/images/backDesign.png")}
        />
        <View style={styles.mainLogin}>
          <View style={styles.frameParent}>
            <View style={styles.frameParent}>
              <View style={[styles.emailParent, styles.emailParentLayout]}>
                <View style={styles.emailBorder}>
                  <Image
                    style={styles.vectorIcon}
                    source={require("../assets/images/Vector.png")}
                  />
                  <Text style={styles.email1}>Email</Text>
                </View>
                <View style={[styles.password, styles.emailBorder]}>
                  <Image
                    style={styles.iconLockLocked}
                    source={require("../assets/images/lock_.png")}
                  />
                  <Text style={styles.email1}>Password</Text>
                </View>
              </View>
              <View style={[styles.remeberMe, styles.wrapperFlexBox]}>
                <View style={styles.remeberMeChild} />
                <Text style={[styles.rememberMe, styles.rememberMeTypo]}>
                  Remember me
                </Text>
              </View>
            </View>
            <View style={[styles.loginBotton, styles.wrapperFlexBox]}>
              <Button
                title="Login"
                filled
                isLoading={isLoading}
                onPress={loginHandler}
                style={{ flex: 1 }}
              />
            </View>
          </View>
          <View style={[styles.goingSignUp, styles.wrapperFlexBox]}>
            <Text style={[styles.signupPage, styles.rememberMeTypo]}>
              <Text style={styles.dontHaveAn}>Don’t have an account ?</Text>
              <Text style={styles.text}>{` `}</Text>
              <Text style={styles.signUp}>Sign up</Text>
            </Text>
          </View>
        </View>
        <View style={styles.frame}>
          <View style={styles.frameInner}>
            <View style={styles.frameParent}>
              <Image
                style={styles.icon}
                source={require("../assets/images/icon.jpg")}
              />
              <View style={[styles.babyChatWrapper, styles.wrapperFlexBox]}>
                <Text style={[styles.babyChat, styles.text2Typo]}>
                  <Text style={styles.baby}>BABY</Text>
                  <Text style={styles.text1}>{` `}</Text>
                  <Text style={styles.chat}>CHAT</Text>
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.frameChild}>
            <View style={[styles.wrapper, styles.wrapperFlexBox]}>
              <Text style={[styles.text2, styles.text2Typo]}>{`육아의 모든 순간,
 함께 하는 든든한 친구!`}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emailParentLayout: {
    width: 350,
    justifyContent: "center",
  },
  emailBorder: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_mini,
    height: 65,
    borderWidth: 1.5,
    borderColor: Color.colorLightgray,
    borderRadius: Border.br_mini,
    flexDirection: "row",
    borderStyle: "solid",
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: Color.colorWhite,
  },
  wrapperFlexBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMeTypo: {
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.RobotoThin,
    fontWeight: "200",
  },
  text2Typo: {
    fontFamily: FontFamily.RobotoBold,
    fontWeight: "700",
    textAlign: "center",
  },
  backdesignIcon: {
    top: 0,
    height: 239,
    width: 430,
    left: 0,
    position: "absolute",
  },
  vectorIcon: {
    height: 14,
    width: 18,
  },
  email1: {
    color: Color.colorDarkgray,
    marginLeft: 10,
    textAlign: "left",
    fontFamily: FontFamily.RobotoThin,
    fontWeight: "200",
    fontSize: FontSize.size_xl,
    flex: 1,
  },
  iconLockLocked: {
    height: 21,
    width: 18,
  },
  password: {
    marginTop: 25,
  },
  emailParent: {
    justifyContent: "center",
  },
  remeberMeChild: {
    borderColor: Color.colorCornflowerblue,
    borderWidth: 3,
    width: 31,
    height: 31,
    borderStyle: "solid",
  },
  rememberMe: {
    width: 112,
    height: 22,
    marginLeft: 20,
    color: Color.colorBlack,
    textAlign: "left",
  },
  remeberMe: {
    width: 163,
    marginTop: 24,
  },
  frameParent: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  loginBotton: {
    borderRadius: 30,
    backgroundColor: Color.colorRoyalblue,
    height: 50,
    marginTop: 30,
    padding: Padding.p_3xs,
    justifyContent: "center",
    width: 350,
  },
  dontHaveAn: {
    color: Color.colorLightgray,
  },
  text: {
    color: "#231f20",
  },
  signUp: {
    color: "#89cff0",
  },
  signupPage: {
    textAlign: "center",
  },
  goingSignUp: {
    marginTop: 60,
    padding: Padding.p_3xs,
    justifyContent: "center",
  },
  mainLogin: {
    top: 489,
    borderTopLeftRadius: Border.br_21xl,
    borderTopRightRadius: Border.br_21xl,
    height: 443,
    paddingTop: 40,
    alignItems: "center",
    backgroundColor: Color.colorWhite,
    width: 430,
    left: 0,
    position: "absolute",
  },
  icon: {
    width: 72,
    height: 71,
  },
  baby: {
    color: Color.colorCornflowerblue,
  },
  text1: {
    color: Color.colorRoyalblue,
  },
  chat: {
    color: Color.colorBlack,
  },
  babyChat: {
    fontSize: 55,
  },
  babyChatWrapper: {
    marginTop: 65,
    padding: Padding.p_3xs,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  frameInner: {
    padding: Padding.p_3xs,
    alignSelf: "stretch",
  },
  text2: {
    fontSize: 28,
    color: Color.colorBlack,
  },
  wrapper: {
    padding: Padding.p_3xs,
    justifyContent: "center",
  },
  frameChild: {
    marginTop: 19,
    padding: Padding.p_3xs,
    alignSelf: "stretch",
  },
  frame: {
    top: 120,
    left: 64,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  login: {
    backgroundColor: "#f0f8ff",
    width: "100%",
    height: 932,
    overflow: "hidden",
    flex: 1,
  },
});

export default Login;
