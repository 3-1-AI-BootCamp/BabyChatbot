import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '../themes/ThemeProvider'

const Saved = () => {
    const { colors } = useTheme()
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text style={{
                color: colors.text,
            }}>대화한 내용이 저장될 공간(미구현)</Text>
        </View>
    )
}

export default Saved
