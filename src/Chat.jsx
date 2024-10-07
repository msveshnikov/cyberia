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
    Select
} from '@chakra-ui/react';
import axios from 'axios';

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

    return (
        <Box width="100%" maxWidth="400px" borderWidth={1} borderRadius="md" p={4}>
            <Heading size="md" mb={4}>
                Chat
            </Heading>
            <Select value={currentRoom} onChange={(e) => setCurrentRoom(e.target.value)} mb={4}>
                <option value="global">Global</option>
                <option value="local">Local</option>
            </Select>
            <VStack height="300px" overflowY="auto" spacing={2} align="stretch" mb={4}>
                {messages.map((message, index) => (
                    <Box key={index} bg="gray.100" p={2} borderRadius="md">
                        <Text fontWeight="bold">{message.sender.email}</Text>
                        <Text>{message.content}</Text>
                        <Text fontSize="xs" color="gray.500">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </Text>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </VStack>
            <Divider mb={4} />
            <HStack>
                <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} colorScheme="blue">
                    Send
                </Button>
            </HStack>
        </Box>
    );
};

export default Chat;
