import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      'html, body': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        scrollBehavior: 'smooth',
        bg: 'white',
        color: 'gray.800',
      },
      '#root': {
        minHeight: '100vh',
        width: '100%',
      },
    },
  },
  colors: {
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#dc2626',
      600: '#c81e1e',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
    body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'red',
      },
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'red' ? 'red.500' : undefined,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'red' ? 'red.600' : undefined,
          },
          _active: {
            bg: props.colorScheme === 'red' ? 'red.700' : undefined,
          },
        }),
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'red.500',
      },
      variants: {
        outline: {
          field: {
            borderColor: 'gray.300',
            _hover: {
              borderColor: 'gray.400',
            },
            _focus: {
              borderColor: 'red.500',
              boxShadow: '0 0 0 1px #dc2626',
            },
          },
        },
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'red.500',
      },
      variants: {
        outline: {
          borderColor: 'gray.300',
          _hover: {
            borderColor: 'gray.400',
          },
          _focus: {
            borderColor: 'red.500',
            boxShadow: '0 0 0 1px #dc2626',
          },
        },
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'red.500',
      },
    },
    Switch: {
      defaultProps: {
        colorScheme: 'red',
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'md',
        px: 2,
        py: 1,
        fontSize: 'xs',
        fontWeight: 'semibold',
        textTransform: 'none',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: 'xl',
          overflow: 'hidden',
        },
      },
    },
  },
  shadows: {
    outline: '0 0 0 3px rgba(220, 38, 38, 0.6)',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);