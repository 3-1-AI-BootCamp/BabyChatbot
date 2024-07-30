import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { images } from '../constants';

const TopBar = ({ onBackPress, onListPress }) => {
  return (
    <View style={styles.topBox}>
      <TouchableOpacity onPress={onBackPress} style={styles.topBarButton}>
        <Image source={images.back} style={styles.icon} />
      </TouchableOpacity>
      <View style={styles.babyLogo}>
        <Image source={images.icon} style={styles.icon1} />
      </View>
      <TouchableOpacity onPress={onListPress} style={styles.topBarButton}>
        <Image source={images.list} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    topBox: {
        width: '100%',
        height: 60,
        paddingHorizontal: 20,
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
        width: 32,
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
});

export default TopBar;
