import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = {
  //body: 'EB Garamond', heading: 'EB Garamond', mono: `'Menlo', monospace`
  // body: 'PT Serif',
  // body: 'Source Serif Pro',
  // body: 'Libre Baskerville',
  body: 'Source Sans Pro',
  heading: 'Source Sans Pro',
  orgBody: 'Source Serif Pro',
  orgHeading: 'Source Serif Pro',
}

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
})

const theme = extendTheme({
  colors: {
    black: '#16161D',
    primary: '#EF476F',
  },
  fonts,
  breakpoints,
  components: {
    Heading: {
      baseStyle: {
        scrollMarginTop: '100px',
        my: 1,
      },
      variants: {
        org: {
          fontFamily: 'orgHeading',
          mt: 4,
        },
      },
    },
    Text: {
      variants: {
        org: {
          fontFamily: 'orgBody',
          fontSize: 'md',
          my: 2,
        },
      },
    },
  },
})

export default theme
