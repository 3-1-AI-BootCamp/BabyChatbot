import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar, Dimensions, Modal, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../themes/ThemeProvider';
import { images } from '../constants';
import { vaccinationData, supportData } from '../constants';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const fp = (percentage) => (Math.sqrt(width * height) * percentage) / 100;

const FAQ = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState(route.params?.activeTab || 'vaccination');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});

  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params?.activeTab]);

  const handleItemPress = (item) => {
    setModalContent(item);
    setModalVisible(true);
  };

  const handleLinkPress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`해당 url을 열 수 없습니다!: ${url}`);
    }
  };

  const renderVaccinationTab = () => (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
    >
      {vaccinationData.map((item, index) => (
        <TouchableOpacity key={index} style={styles.item} onPress={() => handleItemPress(item)}>
          <Text style={[styles.itemText, { color: colors.text }]}>{item.name}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );

  const renderSupportTab = () => (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
    >
      {supportData.map((item, index) => (
        <TouchableOpacity key={index} style={styles.item} onPress={() => handleItemPress(item)}>
          <Text style={[styles.itemText, { color: colors.text }]}>{item.title}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Image style={styles.headerIcon} source={images.back} />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={images.icon} />
        </View>
        <View style={styles.headerButton} />
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'vaccination' && styles.activeTab]}
          onPress={() => setActiveTab('vaccination')}
        >
          <Text style={styles.tabButtonText}>예방접종</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'support' && styles.activeTab]}
          onPress={() => setActiveTab('support')}
        >
          <Text style={styles.tabButtonText}>육아지원</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'vaccination' ? renderVaccinationTab() : renderSupportTab()}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>

            {activeTab === 'vaccination' ? (
              <>
                <Text style={styles.modalTitle}>{modalContent.name}</Text>
                <Text style={styles.modalText}>접종횟수: {modalContent.count}</Text>
                <Text style={styles.modalText}>접종시기: {modalContent.timing}</Text>
                {modalContent.note && <Text style={styles.modalText}>비고: {modalContent.note}</Text>}
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>{modalContent.title}</Text>
                <Text style={styles.modalText}>대상: {modalContent.target}</Text>
                <Text style={styles.modalText}>내용: {modalContent.content}</Text>
                <Text style={styles.modalText}>신청방법: {modalContent.method}</Text>
                <TouchableOpacity onPress={() => handleLinkPress(modalContent.link)}>
                  <Text style={[styles.modalText, styles.link]}>관련 링크: {modalContent.link}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        height: hp(8) + StatusBar.currentHeight,
        paddingTop: StatusBar.currentHeight,
    },
    headerButton: {
        padding: wp(2),
        width: wp(3), // 뒤로 가기 버튼의 너비를 고정
    },
    headerIcon: {
        width: wp(6),
        height: wp(6),
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: wp(10),
        height: wp(10),
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: hp(2),
        backgroundColor: '#A7C7E7',
    },
    tabButton: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(5),
        borderRadius: wp(5),
    },
    activeTab: {
        backgroundColor: '#0487E2',
    },
    tabButtonText: {
        color: '#fff',
        fontSize: fp(2),
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentText: {
        fontSize: fp(2.5),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        paddingHorizontal: wp(10),
    },
    scrollView: {
      flex: 1,
      padding: wp(5),
      backgroundColor: '#f0f8ff',
    },
    faqItem: {
      paddingVertical: hp(2),
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    faqText: {
      fontSize: fp(2.8),
    },
    item: {
      paddingVertical: hp(2),
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    itemText: {
      fontSize: fp(2.8),
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    closeButton: {
      position: 'absolute',
      right: 10,
      top: 10,
    },
    closeButtonText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    modalTitle: {
      fontSize: fp(3),
      fontWeight: 'bold',
      marginBottom: hp(2),
    },
    modalText: {
      fontSize: fp(2.5),
      marginBottom: hp(1),
    },
    scrollViewContent: {
      paddingBottom: hp(0), // 스크롤 뷰 내용 하단에 여백 추가
    },
    bottomPadding: {
      height: hp(2.8), // 스크롤 뷰 맨 아래에 추가 여백
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
      justifyContent: 'center',
      alignItems: 'center',
    },
    link: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
});

export default FAQ;
