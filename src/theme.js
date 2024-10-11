import { extendTheme } from '@chakra-ui/react';

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false
};

const colors = {
    brand: {
        50: '#E6FFFA',
        100: '#B2F5EA',
        200: '#81E6D9',
        300: '#4FD1C5',
        400: '#38B2AC',
        500: '#319795',
        600: '#2C7A7B',
        700: '#285E61',
        800: '#234E52',
        900: '#1D4044'
    },
    cyberpunk: {
        neon: '#00FFFF',
        purple: '#FF00FF',
        yellow: '#FFFF00'
    }
};

const fonts = {
    heading: '"Orbitron", sans-serif',
    body: '"Roboto", sans-serif'
};

const styles = {
    global: (props) => ({
        body: {
            bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
            color: props.colorMode === 'dark' ? 'white' : 'gray.900'
        }
    })
};

const components = {
    Button: {
        baseStyle: {
            fontWeight: 'bold',
            borderRadius: 'md'
        },
        variants: {
            solid: (props) => ({
                bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.400',
                color: 'white',
                _hover: {
                    bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.500'
                }
            }),
            outline: (props) => ({
                borderColor: props.colorMode === 'dark' ? 'brand.500' : 'brand.400'
            })
        }
    },
    Heading: {
        baseStyle: {
            fontFamily: 'heading'
        }
    }
};

const theme = extendTheme({
    config,
    colors,
    fonts,
    styles,
    components
});

export default theme;
