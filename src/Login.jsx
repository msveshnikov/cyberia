import { useState } from 'react';
import axios from 'axios';
import {
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Heading,
    Text,
    useToast,
    Container
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://cyberia.fun';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/login`, { email, password });
            localStorage.setItem('token', response.data.accessToken);
            toast({
                title: 'Login successful',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            navigate('/app');
        } catch (error) {
            console.error('Error logging in:', error);
            toast({
                title: 'Login failed',
                description: 'Please check your credentials and try again.',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.sm" centerContent>
            <Box width="100%" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
                <VStack spacing={4} as="form" onSubmit={handleLogin}>
                    <Heading>Login to Cyberia</Heading>
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        width="100%"
                        isLoading={isLoading}
                        loadingText="Logging in..."
                    >
                        Login
                    </Button>
                </VStack>
                <Text mt={4} textAlign="center">
                    Dont have an account?{' '}
                    <Link to="/register" style={{ color: 'blue' }}>
                        Register here
                    </Link>
                </Text>
            </Box>
        </Container>
    );
};

export default Login;
