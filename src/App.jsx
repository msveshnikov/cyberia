/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
    ChakraProvider,
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input,
    useDisclosure,
    Spinner,
    useToast,
    Flex,
    Heading,
    FormControl,
    FormLabel,
    Image
} from '@chakra-ui/react';

const App = () => {
    const [map, setMap] = useState([]);
    const [currentTile, setCurrentTile] = useState(null);
    const [user, setUser] = useState(null);
    const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
    const [isGenerating, setIsGenerating] = useState(false);
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const mapRef = useRef(null);
    const toast = useToast();

    const { isOpen: isLoginOpen, onOpen: openLogin, onClose: closeLogin } = useDisclosure();
    const {
        isOpen: isRegisterOpen,
        onOpen: openRegister,
        onClose: closeRegister
    } = useDisclosure();

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        fetchInitialMap();
        checkUserAuth();
    }, []);

    useEffect(() => {
        fetchMapChunk(mapPosition.x, mapPosition.y);
    }, [mapPosition]);

    useEffect(() => {
        if (socket) {
            socket.on('tileUpdated', (updatedTile) => {
                setMap((prevMap) =>
                    prevMap.map((tile) =>
                        tile.x === updatedTile.x && tile.y === updatedTile.y ? updatedTile : tile
                    )
                );
            });
        }
    }, [socket]);

    const fetchInitialMap = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:3000/api/tiles', {
                params: { startX: 0, startY: 0, size: 10 }
            });
            setMap(response.data);
        } catch (error) {
            toast({
                title: 'Error fetching initial map',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const checkUserAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get('http://localhost:3000/api/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error checking user auth:', error);
        }
    };

    const handleMapScroll = useCallback((direction) => {
        setMapPosition((prev) => {
            switch (direction) {
                case 'up':
                    return { ...prev, y: prev.y - 1 };
                case 'down':
                    return { ...prev, y: prev.y + 1 };
                case 'left':
                    return { ...prev, x: prev.x - 1 };
                case 'right':
                    return { ...prev, x: prev.x + 1 };
                default:
                    return prev;
            }
        });
    }, []);

    const fetchMapChunk = async (startX, startY) => {
        try {
            const response = await axios.get('http://localhost:3000/api/tiles', {
                params: { startX, startY, size: 10 },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMap((prevMap) => {
                const newMap = [...prevMap];
                response?.data?.forEach((tile) => {
                    const index = newMap.findIndex((t) => t.x === tile.x && t.y === tile.y);
                    if (index !== -1) {
                        newMap[index] = tile;
                    } else {
                        newMap.push(tile);
                    }
                });
                return newMap;
            });
        } catch (error) {
            console.error('Error fetching map chunk:', error);
        }
    };

    const generateProperty = async () => {
        if (!user) {
            openLogin();
            return;
        }

        setIsGenerating(true);
        try {
            const response = await axios.post(
                'http://localhost:3000/api/tiles/generate',
                {
                    x: mapPosition.x,
                    y: mapPosition.y
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setCurrentTile(response.data);
            setMap((prevMap) =>
                prevMap?.map((tile) =>
                    tile.x === response.data.x && tile.y === response.data.y ? response.data : tile
                )
            );
            socket.emit('updateTile', response.data);
        } catch (error) {
            console.error('Error generating property:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const placeTile = async (x, y) => {
        if (!currentTile) return;

        try {
            const response = await axios.put(
                `http://localhost:3000/api/tiles/${x}/${y}`,
                {
                    content: currentTile.content
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setMap((prevMap) =>
                prevMap?.map((tile) => (tile.x === x && tile.y === y ? response.data : tile))
            );
            setCurrentTile(null);
            socket.emit('updateTile', response.data);
        } catch (error) {
            console.error('Error placing tile:', error);
        }
    };

    const renderMap = () => {
        return (
            <Box className="isometric-map" ref={mapRef}>
                {map?.map((tile) => (
                    <Box
                        key={`${tile.x}-${tile.y}`}
                        className="tile"
                        onClick={() => placeTile(tile.x, tile.y)}
                        position="absolute"
                        left={`${(tile.x - mapPosition.x) * 50}px`}
                        top={`${(tile.y - mapPosition.y) * 50}px`}
                        width="50px"
                        height="50px"
                        transform="rotateX(60deg) rotateZ(45deg)"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <Image
                            src={`data:image/png;base64,${tile.content}`}
                            alt={`Tile ${tile.x},${tile.y}`}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                        />
                    </Box>
                ))}
            </Box>
        );
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                email,
                password
            });
            localStorage.setItem('token', response.data.accessToken);
            setUser(response.data.user);
            closeLogin();
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:3000/api/register', { email, password });
            handleLogin();
            closeRegister();
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    const handleMapDrag = useCallback((e) => {
        if (e.buttons !== 1) return;
        const dx = e.movementX;
        const dy = e.movementY;
        setMapPosition((prev) => ({
            x: prev.x - Math.round(dx / 50),
            y: prev.y - Math.round(dy / 50)
        }));
    }, []);

    useEffect(() => {
        const mapElement = mapRef.current;
        if (mapElement) {
            mapElement.addEventListener('mousemove', handleMapDrag);
            return () => mapElement.removeEventListener('mousemove', handleMapDrag);
        }
    }, [handleMapDrag]);

    return (
        <ChakraProvider>
            <Box minHeight="100vh">
                <Flex
                    as="header"
                    align="center"
                    justify="space-between"
                    wrap="wrap"
                    padding="1.5rem"
                    bg="gray.100"
                >
                    <Heading as="h1" size="lg">
                        IsoCraft.online
                    </Heading>
                    {user ? (
                        <HStack>
                            <Text>Welcome, {user.email}</Text>
                            <Button onClick={handleLogout}>Logout</Button>
                        </HStack>
                    ) : (
                        <HStack>
                            <Button onClick={openLogin}>Login</Button>
                            <Button onClick={openRegister}>Register</Button>
                        </HStack>
                    )}
                </Flex>

                <VStack spacing={4} align="stretch" p={4}>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <Box>
                            <Box
                                className="map-container"
                                position="relative"
                                width="100%"
                                height="60vh"
                                overflow="hidden"
                                perspective="1000px"
                            >
                                {renderMap()}
                            </Box>
                            <HStack justify="center" mt={4}>
                                <Button onClick={() => handleMapScroll('up')}>Up</Button>
                                <Button onClick={() => handleMapScroll('down')}>Down</Button>
                                <Button onClick={() => handleMapScroll('left')}>Left</Button>
                                <Button onClick={() => handleMapScroll('right')}>Right</Button>
                            </HStack>
                        </Box>
                    )}
                    <Button
                        onClick={generateProperty}
                        isLoading={isGenerating}
                        loadingText="Generating..."
                        isDisabled={!user}
                    >
                        Generate Property
                    </Button>
                </VStack>

                <Modal isOpen={isLoginOpen} onClose={closeLogin}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Login</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FormControl>
                                <Button onClick={handleLogin} width="100%">
                                    Login
                                </Button>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <Modal isOpen={isRegisterOpen} onClose={closeRegister}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Register</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FormControl>
                                <Button onClick={handleRegister} width="100%">
                                    Register
                                </Button>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </ChakraProvider>
    );
};

export default App;
