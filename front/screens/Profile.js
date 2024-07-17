import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '../themes/ThemeProvider'

const Profile = () => {
    const { colors } = useTheme()
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text style={{
                color: colors.text
            }}>프로필 내용들이 들어갈 공간(미구현)</Text>
        </View>
    )
}

export default Profile
