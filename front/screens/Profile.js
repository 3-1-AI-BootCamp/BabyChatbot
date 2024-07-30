import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, TextInput, ScrollView, Dimensions, SafeAreaView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../themes/ThemeProvider';
import { images } from '../constants';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

const Profile = ({ navigation, route }) => {
    const { colors } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        email: '',
        kidName: '',
        gender: '',
        birthDate: '',
        profileImage: null
    });

    useEffect(() => {
        if (route.params && route.params.userData) {
            const { email, kidName, gender, birthYear, birthMonth, birthDay, profileImage } = route.params.userData;
            setUserInfo({
                email,
                kidName,
                gender,
                birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
                profileImage: profileImage || null
            });
        }
    }, [route.params]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        // 여기에 저장 로직 추가
        setIsEditing(false);
    };

    const handleLogout = () => {
        // 로그아웃 로직 추가
        navigation.navigate('Login');
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("권한 필요", "이 기능을 사용하려면 카메라 롤 권한이 필요합니다.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setUserInfo({ ...userInfo, profileImage: result.uri });
        }
    };

    return (
        <SafeAreaView style={[styles.main, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.backdesignContainer}>
                    <Image
                        style={styles.backdesignIcon}
                        source={images.backDesign}
                    />
                </View>

                <View style={styles.profileImageContainer}>
                    <Pressable onPress={pickImage}>
                        <Image
                            style={styles.profileImage}
                            source={userInfo.profileImage ? { uri: userInfo.profileImage } : images.icon}
                        />
                    </Pressable>
                    <Pressable style={styles.editButton} onPress={handleEdit}>
                        <Text style={styles.editButtonText}>{isEditing ? '저장' : '편집'}</Text>
                    </Pressable>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>이메일:</Text>
                        <TextInput
                            style={styles.infoInput}
                            value={userInfo.email}
                            editable={false}
                        />
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>아기 이름:</Text>
                        <TextInput
                            style={styles.infoInput}
                            value={userInfo.kidName}
                            onChangeText={(text) => setUserInfo({...userInfo, kidName: text})}
                            editable={isEditing}
                        />
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>성별:</Text>
                        <TextInput
                            style={styles.infoInput}
                            value={userInfo.gender}
                            onChangeText={(text) => setUserInfo({...userInfo, gender: text})}
                            editable={isEditing}
                        />
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>생일:</Text>
                        <TextInput
                            style={styles.infoInput}
                            value={userInfo.birthDate}
                            onChangeText={(text) => setUserInfo({...userInfo, birthDate: text})}
                            editable={isEditing}
                        />
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={() => navigation.navigate('ChangePassword')}>
                        <Text style={styles.buttonText}>비밀번호 변경</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                        <Text style={styles.buttonText}>로그아웃</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    backdesignContainer: {
        height: hp(25),
        overflow: 'hidden',
    },
    backdesignIcon: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: -hp(8),
    },
    profileImage: {
        width: wp(25),
        height: wp(25),
        borderRadius: wp(12.5),
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    editButton: {
        marginTop: hp(1.5),
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.8),
        backgroundColor: '#0487E2',
        borderRadius: wp(2),
    },
    editButtonText: {
        color: '#FFFFFF',
        fontSize: fp(1.8),
    },
    infoContainer: {
        marginTop: hp(3),
        paddingHorizontal: wp(8),
    },
    infoItem: {
        marginBottom: hp(1.5),
    },
    infoLabel: {
        fontSize: fp(1.8),
        color: '#888888',
        marginBottom: hp(0.3),
    },
    infoInput: {
        fontSize: fp(2.2),
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingVertical: hp(0.4),
    },
    buttonContainer: {
        marginTop: hp(1.5),
        paddingHorizontal: wp(8),
    },
    button: {
        backgroundColor: '#0487E2',
        paddingVertical: hp(1.2),
        borderRadius: wp(2),
        alignItems: 'center',
        marginBottom: hp(1.5),
    },
    logoutButton: {
        backgroundColor: '#FF6347',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: fp(2.2),
        fontWeight: 'bold',
    },
});

export default Profile;
