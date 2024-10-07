import { useState } from 'react';
import axios from 'axios';
import {
    Box,
    VStack,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Container,
    Text,
    Link as ChakraLink
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://cyberia.fun';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({
                title: 'Passwords do not match',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            return;
        }

        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/api/register`, { email, password });
            toast({
                title: 'Registration successful',
                description: 'You can now log in with your new account.',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            navigate('/login');
        } catch (error) {
            toast({
                title: 'Registration failed',
                description: error.response?.data?.message || 'Please try again.',
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
            <Box width="100%" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
                <VStack spacing={4} align="stretch">
                    <Heading textAlign="center">Register for Cyberia</Heading>
                    <form onSubmit={handleRegister}>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl isRequired mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        <FormControl isRequired mt={4}>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </FormControl>
                        <Button
                            mt={6}
                            colorScheme="blue"
                            isLoading={isLoading}
                            type="submit"
                            width="full"
                        >
                            Register
                        </Button>
                    </form>
                    <Text mt={4} textAlign="center">
                        Already have an account?{' '}
                        <ChakraLink as={Link} to="/login" color="blue.500">
                            Log in
                        </ChakraLink>
                    </Text>
                </VStack>
            </Box>
        </Container>
    );
};

export default Register;
