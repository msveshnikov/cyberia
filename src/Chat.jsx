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
    Divider
} from '@chakra-ui/react';
import io from 'socket.io-client';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://cyberia.fun';

const Chat = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        const newSocket = io(API_URL);
        setSocket(newSocket);

        newSocket.on('chatMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
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
            const newMessage = {
                sender: user.email,
                content: inputMessage,
                timestamp: new Date().toISOString()
            };

            socket.emit('chatMessage', newMessage);
            setInputMessage('');
        }
    };

    return (
        <Box width="100%" maxWidth="400px" borderWidth={1} borderRadius="md" p={4}>
            <Heading size="md" mb={4}>
                Chat
            </Heading>
            <VStack height="300px" overflowY="auto" spacing={2} align="stretch" mb={4}>
                {messages.map((message, index) => (
                    <Box key={index} bg="gray.100" p={2} borderRadius="md">
                        <Text fontWeight="bold">{message.sender}</Text>
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
