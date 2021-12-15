import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = {
  //body: 'EB Garamond', heading: 'EB Garamond', mono: `'Menlo', monospace`
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
  },
  fonts,
  breakpoints,
  components: {
    Heading: {
      baseStyle: {
        scrollMarginTop: '100px',
        my: 1,
      },
    },
  },
})

export default theme
