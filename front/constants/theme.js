import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')
import { FontFamily } from './Globalstyles'

export const COLORS = {
    //primary: '#10A37F',
    primary: '#A7C7E7',
    white: '#FFFFFF',
    secondaryWhite: '#F7F7F8',
    black: '#0B0B0B',
    secondaryBlack: '#444654',
    tertiaryBlack: '#202123',
    gray: 'F8F8F8',
    secondaryGray: '#808080',
}

export const SIZES = {
    // Global SIZES
    base: 8,
    font: 14,
    radius: 30,
    padding: 8,
    padding2: 12,
    padding3: 16,

    // FONTS Sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 20,
    h4: 18,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,

    // App Dimensions
    width,
    height,
}

export const FONTS = {
    largeTitle: {
        FontFamily: 'black',
        fontSize: SIZES.largeTitle,
        lineHeight: 55,
    },
    h1: { FontFamily: 'bold', fontSize: SIZES.h1, lineHeight: 36 },
    h2: { FontFamily: 'bold', fontSize: SIZES.h2, lineHeight: 30 },
    h3: { FontFamily: 'bold', fontSize: SIZES.h3, lineHeight: 22 },
    h4: { FontFamily: 'bold', fontSize: SIZES.h4, lineHeight: 20 },
    body1: { FontFamily: 'regular', fontSize: SIZES.body1, lineHeight: 36 },
    body2: { FontFamily: 'regular', fontSize: SIZES.body2, lineHeight: 30 },
    body3: { FontFamily: 'regular', fontSize: SIZES.body3, lineHeight: 22 },
    body4: { FontFamily: 'regular', fontSize: SIZES.body4, lineHeight: 20 },
}

const appTheme = { COLORS, SIZES, FONTS }

export default appTheme
