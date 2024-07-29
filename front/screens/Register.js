import React, { useCallback, useReducer, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Alert, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS, SIZES, images } from '../constants';
import { COLORS } from '../constants';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import { getFirebaseApp } from '../utils/firebaseHelper';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, child, set, getDatabase } from 'firebase/database';
import { useTheme } from '../themes/ThemeProvider';

const initialState = {
    inputValues: {
        email: '',
        password: '',
        kidName: '',
        birthYear: '',
        birthMonth: '',
        birthDay: '',
        gender: '',
    },
    inputValidities: {
        email: false,
        password: false,
        kidName: false,
        birthYear: false,
        birthMonth: false,
        birthDay: false,
        gender: false,
    },
    formIsValid: false,
};

const Register = ({ navigation }) => {
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

    const createUser = async (email, userId) => {
        const userData = {
            email,
            userId,
            kidName: formState.inputValues.kidName,
            birthYear: formState.inputValues.birthYear,
            birthMonth: formState.inputValues.birthMonth,
            birthDay: formState.inputValues.birthDay,
            gender: formState.inputValues.gender,
            signUpDate: new Date().toISOString(),
        };

        const dbRef = ref(getDatabase());
        const childRef = child(dbRef, `users/${userId}`);
        await set(childRef, userData);

        return userData;
    };

    const authHandler = async () => {
        const app = getFirebaseApp();
        const auth = getAuth(app);
        setIsLoading(true);

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                formState.inputValues.email,
                formState.inputValues.password
            );

            const { uid } = result.user;

            const userData = await createUser(
                formState.inputValues.email,
                uid
            );

            if (userData) {
                setIsLoading(false);
                navigation.navigate('Login');
            }
        } catch (error) {
            const errorCode = error.code;
            let message = 'Something went wrong!';
            if (errorCode === 'auth/email-already-in-use') {
                message = 'This email is already in use';
            }

            setError(message);
            setIsLoading(false);
        }
    };

    // Display error if something went wrong
    useEffect(() => {
        if (error) {
            Alert.alert('오류가 발생했습니다!', error);
        }
    }, [error]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>회원가입</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.inputWrapper}>
                    <Image
                        style={styles.inputIcon}
                        source={require("../assets/images/Vector.png")}
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
                        source={require("../assets/images/lock_.png")}
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
                <View style={styles.inputWrapper}>
                    <Image
                        style={styles.inputIcon}
                        source={require("../assets/images/icon.png")}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Kid's name"
                        placeholderTextColor="#888888"
                        onChangeText={inputChangedHandler.bind(this, 'kidName')}
                        value={formState.inputValues.kidName}
                    />
                </View>
                <View style={styles.birthContainer}>
                    <TextInput
                        style={styles.birthInput}
                        placeholder="Year"
                        placeholderTextColor="#888888"
                        onChangeText={inputChangedHandler.bind(this, 'birthYear')}
                        value={formState.inputValues.birthYear}
                    />
                    <TextInput
                        style={styles.birthInput}
                        placeholder="Month"
                        placeholderTextColor="#888888"
                        onChangeText={inputChangedHandler.bind(this, 'birthMonth')}
                        value={formState.inputValues.birthMonth}
                    />
                    <TextInput
                        style={styles.birthInput}
                        placeholder="Day"
                        placeholderTextColor="#888888"
                        onChangeText={inputChangedHandler.bind(this, 'birthDay')}
                        value={formState.inputValues.birthDay}
                    />
                </View>
                <View style={styles.genderContainer}>
                    <TouchableOpacity
                        style={[
                            styles.genderButton,
                            formState.inputValues.gender === 'Boy' && styles.genderSelected
                        ]}
                        onPress={() => inputChangedHandler('gender', 'Boy')}
                    >
                        <Text style={styles.genderText}>Boy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.genderButton,
                            formState.inputValues.gender === 'Girl' && styles.genderSelected
                        ]}
                        onPress={() => inputChangedHandler('gender', 'Girl')}
                    >
                        <Text style={styles.genderText}>Girl</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={styles.signInButton} 
                    onPress={authHandler}
                    disabled={!formState.formIsValid || isLoading}
                >
                    <Text style={styles.signInButtonText}>
                        {isLoading ? 'Loading...' : 'Sign in'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.loginContainer}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>log in</Text></Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backText: {
        fontSize: 24,
        color: '#0487E2',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 22,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        width: '100%',
    },
    inputIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    birthContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        width: '100%',
    },
    birthInput: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        fontSize: 16,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        width: '100%',
    },
    genderButton: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    genderSelected: {
        backgroundColor: '#0487E2',
    },
    genderText: {
        fontSize: 16,
        color: '#888888',
    },
    signInButton: {
        backgroundColor: '#0487E2',
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 80,
        alignItems: 'center',
        marginBottom: 15,
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#888888',
    },
    loginLink: {
        color: '#0487E2',
        fontWeight: 'bold',
    },
});

export default Register;
