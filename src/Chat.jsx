import { useState, useEffect, useRef } from 'react';
import {
    Box,
    VStack,
    HStack,
    Input,
    Button,
    Text,
    useToast,
    Heading,
    Divider,
    Select,
    Container,
    Avatar,
    Flex,
    Spacer
} from '@chakra-ui/react';
import axios from 'axios';
import md5 from 'md5';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://cyberia.fun';

const Chat = () => {
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [currentRoom, setCurrentRoom] = useState('global');
    const messagesEndRef = useRef(null);
    const toast = useToast();

    const checkUserAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get(`${API_URL}/api/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error checking user auth:', error);
        }
    };

    useEffect(() => {
        checkUserAuth();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/chat/${currentRoom}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const intervalId = setInterval(fetchMessages, 5000);
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRoom]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!user) {
            toast({
                title: 'Please log in to send messages',
                status: 'warning',
                duration: 3000,
                isClosable: true
            });
            return;
        }

        if (inputMessage.trim() !== '') {
            try {
                await axios.post(
                    `${API_URL}/api/chat`,
                    { message: inputMessage, room: currentRoom },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                setInputMessage('');
                fetchMessages();
            } catch (error) {
                console.error('Error sending message:', error);
                toast({
                    title: 'Error sending message',
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                });
            }
        }
    };

    const getGravatarUrl = (email) => {
        const hash = md5(email.toLowerCase().trim());
        return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`;
    };

    const getColorFromHash = (hash) => {
        const colors = ['red', 'blue', 'green', 'purple', 'orange', 'teal', 'pink'];
        const index = parseInt(hash.substr(0, 8), 16) % colors.length;
        return colors[index];
    };

    return (
        <Container maxW="container.xl" centerContent>
            <Box
                width="100%"
                maxWidth="800px"
                borderWidth={1}
                borderRadius="lg"
                p={6}
                boxShadow="lg"
                bg="white"
            >
                <Flex align="center" mb={6}>
                    <Heading size="lg">Cyberia Chat</Heading>
                    <Spacer />
                    <Link to="/app">
                        <Button colorScheme="blue" size="sm">
                            Back to Game
                        </Button>
                    </Link>
                </Flex>
                <Select value={currentRoom} onChange={(e) => setCurrentRoom(e.target.value)} mb={6}>
                    <option value="global">Global</option>
                    <option value="local">Local</option>
                </Select>
                <VStack
                    height="400px"
                    overflowY="auto"
                    spacing={3}
                    align="stretch"
                    mb={6}
                    borderWidth={1}
                    borderRadius="md"
                    p={4}
                >
                    {messages.map((message, index) => {
                        const userColor = getColorFromHash(md5(message.sender.email));
                        return (
                            <HStack key={index} bg="gray.50" p={3} borderRadius="md" boxShadow="sm">
                                <Avatar size="sm" src={getGravatarUrl(message.sender.email)} />
                                <Box flex={1}>
                                    <Text fontWeight="bold" color={`${userColor}.600`}>
                                        {message.sender.email}
                                    </Text>
                                    <Text color={`${userColor}.800`}>{message.content}</Text>
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        {new Date(message.timestamp).toLocaleString()}
                                    </Text>
                                </Box>
                            </HStack>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </VStack>
                <Divider mb={6} />
                <HStack>
                    <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        size="lg"
                    />
                    <Button onClick={handleSendMessage} colorScheme="blue" size="lg">
                        Send
                    </Button>
                </HStack>
            </Box>
        </Container>
    );
};

export default Chat;
