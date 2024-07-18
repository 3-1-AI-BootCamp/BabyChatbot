import { View, Text, Image, Alert } from 'react-native'
import React, { useCallback, useReducer, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { FONTS, SIZES, images } from '../constants'
import Input from '../components/Input'
import Button from '../components/Button'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { useTheme } from '../themes/ThemeProvider'

const initialState = {
    inputValues: {
        email: '',
        password: '',
        childName: '',
        childGender: '',
        childBirthdate: '',
    },
    inputValidities: {
        email: false,
        password: false,
        childName: false,
        childGender: false,
        childBirthdate: false,
    },
    formIsValid: false,
}

const Register = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const { colors } = useTheme()

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    const authHandler = async () => {
        setIsLoading(true);
    
        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formState.inputValues.email,
                    password: formState.inputValues.password,
                    childName: formState.inputValues.childName,
                    childGender: formState.inputValues.childGender,
                    childBirthdate: formState.inputValues.childBirthdate,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setIsLoading(false);
                navigation.navigate('Login');
            } else {
                throw new Error(data);
            }
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            Alert.alert('오류가 발생했습니다!', error)
        }
    }, [error])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <PageContainer>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 22 }}>
                    <Image source={images.logo} style={{ height: 120, width: 120, marginBottom: 22 }} />

                    <Text style={{ ...FONTS.h4, color: colors.text, marginVertical: 8 }}>
                        어서오세요!
                    </Text>

                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['email']}
                        id="email"
                        placeholder="이메일 입력"
                        placeholderTextColor={colors.text}
                    />

                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['password']}
                        id="password"
                        placeholder="비밀번호 입력"
                        placeholderTextColor={colors.text}
                        secureTextEntry
                    />

                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['childName']}
                        id="childName"
                        placeholder="아이의 이름 입력"
                        placeholderTextColor={colors.text}
                    />

                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['childGender']}
                        id="childGender"
                        placeholder="아이의 성별 입력"
                        placeholderTextColor={colors.text}
                    />

                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['childBirthdate']}
                        id="childBirthdate"
                        placeholder="아이의 생년월일 입력 (YYYY-MM-DD)"
                        placeholderTextColor={colors.text}
                    />

                    <Button
                        title="회원가입"
                        onPress={authHandler}
                        isLoading={isLoading}
                        filled
                        style={{
                            width: SIZES.width - 44,
                            marginBottom: SIZES.padding,
                            marginVertical: 8,
                        }}
                    />
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Register