import { extendTheme, ThemeComponentProps, theme as baseTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = {
  // body: 'EB Garamond', heading: 'EB Garamond', mono: `'Menlo', monospace`
  // body: 'PT Serif',
  // body: 'Source Serif Pro',
  // body: 'Libre Baskerville',
  body: 'Roboto',
  heading: 'Roboto',
  orgBody: 'Roboto',
  orgHeading: 'Roboto',
  // orgBody: 'Source Serif Pro',
  // orgHeading: 'Source Serif Pro',
}

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
})

const mainColor = 'red'
const theme = extendTheme({
  colors: {
    black: '#16161D',
    // primary: `red.500`,
    brand: baseTheme.colors[mainColor],
    primary: baseTheme.colors[mainColor][500],
  },
  semanticTokens: {
    colors: {
      foreground: {
        default: baseTheme.colors.white,
        _dark: baseTheme.colors.gray[900],
      },
      back: {
        default: baseTheme.colors.gray[50],
        _dark: baseTheme.colors.gray[800],
      },
      hover: {
        default: baseTheme.colors.gray[200],
        _dark: baseTheme.colors.gray[600],
      },
    },
  },
  fonts,
  breakpoints,
  components: {
    Button: {
      default: {
        _active: {
          outline: 'none',
        },
        outline: 'none',
      },
      baseStyle: {
        _focus: {
          boxShadow: 'none',
        },
        _focusVisible: {
          shadow: 'outline',
        },
      },
      variants: {
        ghoster: {
          background: 'none',
          border: '1px solid rgba(0,0,0,0)',
          _hover: {
            background: 'none',
            borderColor: 'primary',

            color: 'primary',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        scrollMarginTop: '100px',
        my: 1,
      },
      variants: {
        org: {
          fontFamily: 'orgHeading',
          my: 6,
        },
      },
    },
    Text: {
      variants: {
        org: {
          fontFamily: 'orgBody',
          fontSize: 'md',
          my: 6,
        },
      },
    },
    Tooltip: {
      baseStyle: (props: ThemeComponentProps) => ({
        borderRadius: 'md',
        bgColor: props.colorMode !== 'dark' ? 'gray.50' : 'gray.600',
        color: props.colorMode !== 'dark' ? 'dark.secondary' : 'gray.100',
      }),
      defaultProps: {
        hasArrow: true,
      },
    },
  },
})

export default theme
