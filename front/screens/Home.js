import * as React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useTheme } from '../themes/ThemeProvider';
import { COLORS } from '../constants';

const Home = ({ navigation }) => {
  const { dark, colors, setScheme } = useTheme();

  const ToggleTheme = () => {
    dark ? setScheme('light') : setScheme('dark');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBox}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarButton}>
          <Image source={require("../assets/images/back.png")} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.babyLogo}>
          <Image source={require("../assets/images/icon.jpg")} style={styles.icon1} />
        </View>
        <TouchableOpacity onPress={ToggleTheme} style={styles.topBarButton}>
          <Ionicons name={dark ? 'sunny-outline' : 'partly-sunny-sharp'} size={32} color={dark ? COLORS.white : COLORS.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.center}>
        <Text style={styles.babyChat}>
          <Text style={styles.babyText}>BABY</Text>
          <Text style={styles.chatText}> CHAT</Text>
        </Text>

        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('HospitalMapScreen')}>
          <Text style={styles.boxText}>근처 병원 찾기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Fun')}>
          <Text style={styles.boxText}>오늘의 무당님</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyContainer} onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.btnText}>Start Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  topBox: {
    top: 0,
    left: 0,
    width: '100%',
    height: 100,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#d3ebff',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  babyLogo: {
    flex: 1,
    alignItems: 'center',
  },
  icon1: {
    width: 40,
    height: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  babyChat: {
    fontSize: 55,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
  },
  babyText: {
    color: '#0487E2',
  },
  chatText: {
    color: '#000',
  },
  box: {
    width: 300,
    height: 65,
    borderRadius: 35,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ADD8E6",
    marginVertical: 10,
  },
  boxText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  historyContainer: {
    backgroundColor: "#d3ebff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  historyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0487E2',
    width: 300,
    height: 65,
    borderRadius: 35,
    marginTop: 20,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});

export default Home;
