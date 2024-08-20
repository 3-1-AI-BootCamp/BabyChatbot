import React, { useCallback, useReducer, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { images } from '../constants';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import { useTheme } from '../themes/ThemeProvider';
import { host, port } from '@env';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

const initialState = {
    inputValues: {
        email: '',
        password: '',
        childName: '',
        birthYear: '',
        birthMonth: '',
        birthDay: '',
        childGender: '',
    },
    inputValidities: {
        email: false,
        password: false,
        childName: false,
        birthYear: false,
        birthMonth: false,
        birthDay: false,
        childGender: false,
    },
    formIsValid: false,
};

const years = Array.from({ length: 100 }, (_, i) => ({ label: `${new Date().getFullYear() - i}`, value: `${new Date().getFullYear() - i}` }));
const months = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
const days = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));

const Register = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const { colors } = useTheme();

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue);
            dispatchFormState({ inputId, validationResult: result, inputValue });
        },
        [dispatchFormState]
    );

    const authHandler = async () => {
        setIsLoading(true);

        try {
            const birthdate = `${formState.inputValues.birthYear}-${formState.inputValues.birthMonth.padStart(2, '0')}-${formState.inputValues.birthDay.padStart(2, '0')}`;

            const response = await fetch(`http://${host}:${port}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formState.inputValues.email,
                    password: formState.inputValues.password,
                    childName: formState.inputValues.childName,
                    childGender: formState.inputValues.childGender,
                    childBirthdate: birthdate,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                navigation.navigate('Login');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            Alert.alert('오류가 발생했습니다!', error);
        }
    }, [error]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.account}>
                <Image
                    style={styles.backdesignIcon}
                    source={images.backDesign}
                />
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
                    <Image
                        style={styles.backIcon}
                        source={images.back}
                    />
                </TouchableOpacity>
                <Text style={styles.text}>Register</Text>
                <View style={styles.fullRegisterBox}>
                    <View style={styles.inputRegister}>
                        <View style={[styles.email, styles.emailBorder]}>
                            <Image
                                style={styles.vectorIcon}
                                source={images.Vector}
                            />
                            <TextInput
                                style={[styles.email1, styles.email1Typo]}
                                placeholder="Email"
                                placeholderTextColor="#888888"
                                onChangeText={inputChangedHandler.bind(this, 'email')}
                                value={formState.inputValues.email}
                            />
                        </View>
                        <View style={[styles.password, styles.birthSpaceBlock]}>
                            <Image
                                style={styles.iconLockLocked}
                                source={images.lock_}
                            />
                            <TextInput
                                style={[styles.email1, styles.email1Typo]}
                                placeholder="Password"
                                placeholderTextColor="#888888"
                                secureTextEntry
                                onChangeText={inputChangedHandler.bind(this, 'password')}
                                value={formState.inputValues.password}
                            />
                        </View>
                        <View style={[styles.kidsName, styles.emailBorder, styles.kidsNameMargin]}>
                            <View style={styles.peopleParentFlexBox}>
                                <Image
                                    style={styles.peopleIcon}
                                    source={images.people}
                                />
                                <TextInput
                                    style={[styles.kidsName1, styles.email1Typo]}
                                    placeholder="Kid’s name"
                                    placeholderTextColor="#888888"
                                    onChangeText={inputChangedHandler.bind(this, 'childName')}
                                    value={formState.inputValues.childName}
                                />
                            </View>
                        </View>
                        <View style={styles.birthSpaceBlock}>
                            <View
                                style={[styles.babysBirthWrapper, styles.peopleParentFlexBox]}
                            >
                                <Text style={styles.babysBirth}>Baby’s Birth</Text>
                            </View>
                            <View style={[styles.frameParent, styles.frameFlexBox]}>
                                <TextInput
                                    style={[styles.yearWrapper, styles.wrapperBorder]}
                                    placeholder="Year"
                                    placeholderTextColor="#888888"
                                    keyboardType="numeric"
                                    onChangeText={inputChangedHandler.bind(this, 'birthYear')}
                                    value={formState.inputValues.birthYear}
                                />
                                <TextInput
                                    style={[styles.monthWrapper, styles.wrapperBorder]}
                                    placeholder="Month"
                                    placeholderTextColor="#888888"
                                    keyboardType="numeric"
                                    onChangeText={inputChangedHandler.bind(this, 'birthMonth')}
                                    value={formState.inputValues.birthMonth}
                                />
                                <TextInput
                                    style={[styles.monthWrapper, styles.wrapperBorder]}
                                    placeholder="Day"
                                    placeholderTextColor="#888888"
                                    keyboardType="numeric"
                                    onChangeText={inputChangedHandler.bind(this, 'birthDay')}
                                    value={formState.inputValues.birthDay}
                                />
                            </View>
                        </View>
                        <View style={styles.birthSpaceBlock}>
                            <View style={[styles.babysBirthWrapper, styles.peopleParentFlexBox]}>
                                <Text style={styles.babysBirth}>Baby’s gender</Text>
                            </View>
                            <View style={[styles.frameGroup, styles.frameFlexBox]}>
                                <TouchableOpacity
                                    style={[
                                        styles.wrapperLayout,
                                        selectedGender === 'Boy' && styles.genderSelectedBoy
                                    ]}
                                    onPress={() => {
                                        setSelectedGender('Boy');
                                        inputChangedHandler('childGender', 'Boy');
                                    }}
                                >
                                    <Text style={[styles.boy, styles.boyTypo]}>Boy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.girlWrapper,
                                        styles.wrapperLayout,
                                        selectedGender === 'Girl' && styles.genderSelectedGirl
                                    ]}
                                    onPress={() => {
                                        setSelectedGender('Girl');
                                        inputChangedHandler('childGender', 'Girl');
                                    }}
                                >
                                    <Text style={[styles.girl, styles.boyTypo]}>Girl</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.signInBotton, styles.goingLoginFlexBox]}
                            onPress={authHandler}
                            disabled={!formState.formIsValid || isLoading}
                        >
                            <Text style={styles.signIn}>{isLoading ? 'Loading...' : 'Sign in'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.signupContainer} // 스타일 변경
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.signupText}>Already have an account? <Text style={styles.signupLink}>log in</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    emailBorder: {
        paddingVertical: 0,
        paddingHorizontal: wp(4),
        height: hp(7),
        borderWidth: 1.5,
        borderColor: '#D3D3D3',
        borderStyle: "solid",
        borderRadius: wp(3),
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    email1Typo: {
        textAlign: "left",
        color: "#696969",
        fontFamily: 'Roboto',
        fontSize: fp(3),
        flex: 1,
        marginLeft: wp(4), // Add margin between icon and text
    },
    birthSpaceBlock: {
        marginTop: hp(2),
        alignSelf: "stretch",
    },
    peopleParentFlexBox: {
        flexDirection: "row",
        alignItems: "center",
    },
    frameFlexBox: {
        marginTop: hp(2),
        height: hp(7),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    wrapperBorder: {
        borderWidth: 1.5,
        borderRadius: wp(4),
        flexDirection: "row",
        height: hp(6),
        borderColor: '#D3D3D3',
        borderStyle: "solid",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: wp(6),
        flex: 1,
        marginHorizontal: wp(2),
        backgroundColor: "#F5F5F5", // 변경: 입력창 배경색을 Login.js와 일치시킴
    },
    boyTypo: {
        fontFamily: 'Roboto',
        textAlign: "center",
        fontSize: fp(2.5),
    },
    wrapperLayout: {
        width: wp(30),
        borderRadius: wp(4),
        borderWidth: 1.5,
        flexDirection: "row",
        height: hp(6),
        borderColor: '#D3D3D3',
        borderStyle: "solid",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5", // 변경: 입력창 배경색을 Login.js와 일치시킴
    },
    genderSelectedBoy: {
        backgroundColor: '#E0F7FA', // 연한 파란색
    },
    genderSelectedGirl: {
        backgroundColor: '#fff5f5', // 연한 핑크색
    },
    goingLoginFlexBox: {
        padding: wp(2),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    backdesignIcon: {
        position: 'absolute',
        top: 0, // 상단까지 배경 이미지를 확장
        left: 0,
        width: '100%',
        height: hp(30), // 기존 비율을 유지
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: hp(8),
        left: wp(5),
    },
    text: {
        top: hp(14),
        left: wp(8),
        fontSize: fp(5),
        fontWeight: "700",
        fontFamily: 'Roboto-Bold',
        color: "#000",
        textAlign: "center",
        position: "absolute",
    },
    vectorIcon: {
        height: hp(3),
        width: wp(5),
    },
    email: {
        alignSelf: "stretch",
        marginTop: hp(2),
    },
    iconLockLocked: {
        height: hp(3),
        width: wp(5),
    },
    password: {
        paddingVertical: 0,
        paddingHorizontal: wp(4),
        height: hp(7),
        borderWidth: 1.5,
        borderColor: '#D3D3D3',
        borderStyle: "solid",
        borderRadius: wp(3),
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5", // 변경: 입력창 배경색을 Login.js와 일치시킴
        marginBottom: hp(2), // Reduce space between Password and Kid's name
    },
    peopleIcon: {
        width: wp(5),
        height: wp(5),
    },
    kidsName: {
        borderRadius: wp(2),
        paddingVertical: hp(1),
        height: hp(7),
        borderWidth: 1.5,
        marginTop: hp(2),
        paddingHorizontal: wp(2),
        flexDirection: "row",
        borderColor: '#D3D3D3',
        borderStyle: "solid",
        alignSelf: "stretch",
        alignItems: "center",
        backgroundColor: "#F5F5F5", // 변경: 입력창 배경색을 Login.js와 일치시킴
    },
    kidsNameMargin: {
        marginTop: hp(0.5), // Adjust margin between Password and Kid's name
    },
    babysBirth: {
        color: "#696969",
        fontFamily: 'Roboto',
        fontSize: fp(2.5),
        textAlign: "center", // Ensure text alignment
        flex: 1, // Ensure text does not get cut off by giving it flexible space
    },
    babysBirthWrapper: {
        justifyContent: "center",
        alignSelf: "stretch",
        marginTop: hp(1), // 공간 확보를 위해 margin 추가
    },

    yearWrapper: {
        width: wp(22),
        borderRadius: wp(2),
    },
    monthWrapper: {
        width: wp(22),
        borderRadius: wp(2),
    },
    frameParent: {
        alignSelf: "stretch",
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    boy: {
        color: "#4db7e4",
        fontSize: fp(2.5),
    },
    girl: {
        color: "#ec93de",
        fontSize: fp(2.5),
    },
    girlWrapper: {
        marginLeft: wp(3),
    },
    frameGroup: {
        width: '100%',
    },
    signIn: {
        fontWeight: "800",
        fontFamily: 'Roboto-Black',
        color: "#FFF",
        fontSize: fp(2.5),
        textAlign: "center",
    },
    signInBotton: {
        height: hp(5.5),
        borderRadius: wp(5), // 변경: 버튼의 borderRadius를 Login.js와 일치시킴
        marginTop: hp(4.5),
        alignSelf: "stretch",
        backgroundColor: "#0487E2", // 변경: 버튼의 배경색을 Login.js와 일치시킴
    },
    inputRegister: {
        justifyContent: "center",
        alignSelf: "stretch",
        alignItems: "center",
    },
    signupContainer: {
        marginTop: hp(3), // 스타일 추가: 로그인 링크 부분의 marginTop 설정
        alignItems: 'center', // 스타일 추가: 로그인 링크 부분의 정렬 설정
    },
    signupText: {
        fontSize: fp(2), // 스타일 추가: 로그인 링크 부분의 텍스트 크기 설정
        color: '#888888', // 스타일 추가: 로그인 링크 부분의 텍스트 색상 설정
    },
    signupLink: {
        color: '#0487E2', // 스타일 추가: 로그인 링크 부분의 링크 색상 설정
        fontWeight: 'bold', // 스타일 추가: 로그인 링크 부분의 글씨 두께 설정
    },
    alreadyHave: {
        color: '#D3D3D3',
    },
    text1: {
        color: "#231f20",
    },
    log: {
        color: "#a7dbf4",
    },
    in: {
        color: "#89cff0",
    },
    alreadyHaveAnContainer: {
        fontSize: fp(2),
    },
    goingLogin: {
        marginTop: hp(6),
    },
    fullRegisterBox: {
        top: hp(30),
        left: wp(5),
        alignItems: "center",
        width: wp(90),
        position: "absolute",
    },
    backIcon: {
        width: wp(6),
        height: hp(3),
    },
    account: {
        width: "100%",
        height: '100%',
        overflow: "hidden",
        flex: 1,
        backgroundColor: "#FFF",
    },
});

export default Register;
