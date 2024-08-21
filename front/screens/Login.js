import React, { useCallback, useReducer, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import { useTheme } from '../themes/ThemeProvider';
import { images } from '../constants';
import { host, port } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

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

// 로그인 화면
const Login = ({ navigation }) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  // 로그인 시도
  const loginHandler = async () => {
    setIsLoading(true);
    setError(null);

    // 입력 정보를 백엔드로 보내서 로그인 요청
    try {
      const response = await fetch(`http://${host}:${port}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formState.inputValues.email,
          password: formState.inputValues.password,
        }),
      });

      const data = await response.json();

      // 입력 정보가 일치하지 않을 경우 로그인 실패
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // 로그인 성공
      console.log('Logged in user:', data);

      // 사용자 데이터를 AsyncStorage에 저장
      await AsyncStorage.setItem('user', JSON.stringify(data));

      // 홈 화면으로 이동(로그인 성공 시 토큰 부여 등은 구현되어 있지 않음)
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('오류가 발생했습니다!', error);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.login}>
      <View style={styles.backdesignContainer}>
        <Image
          style={styles.backdesignIcon}
          source={images.backDesign}
        />
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={images.icon}
          />
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.babyChat}>
            <Text style={styles.babyText}>BABY</Text>
            <Text style={styles.chatText}>CHAT</Text>
          </Text>
          <Text style={styles.slogan}>육아의 모든 순간,{'\n'}함께 하는 든든한 친구!</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Image
              style={styles.inputIcon}
              source={images.Vector}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888888"
              onChangeText={inputChangedHandler.bind(this, 'email')}
              value={formState.inputValues.email}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Image
              style={styles.inputIcon}
              source={images.lock_}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888888"
              secureTextEntry
              onChangeText={inputChangedHandler.bind(this, 'password')}
              value={formState.inputValues.password}
            />
          </View>
          <View style={{ marginBottom: hp(3) }} />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={loginHandler}
            disabled={!formState.formIsValid || isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Loading...' : 'Login'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupLink}>Sign up</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  login: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  backdesignContainer: {
    height: hp(30), // 배경 이미지의 높이를 줄임
    overflow: 'hidden',
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: wp(20),
    height: wp(20),
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp(3),
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
  slogan: {
    fontSize: fp(5),
    textAlign: 'center',
    color: '#000000',
    marginTop: hp(1),
  },
  inputContainer: {
    width: wp(100),
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    padding: wp(5),
    paddingTop: hp(3),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: wp(2),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
  },
  inputIcon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    fontSize: fp(2),
  },
  loginButton: {
    backgroundColor: '#0487E2',
    borderRadius: wp(5),
    paddingVertical: hp(1.5),
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: fp(2.5),
    fontWeight: 'bold',
  },
  signupContainer: {
    marginTop: hp(3),
    alignItems: 'center',
  },
  signupText: {
    fontSize: fp(2),
    color: '#888888',
  },
  signupLink: {
    color: '#0487E2',
    fontWeight: 'bold',
  },
});

export default Login;
