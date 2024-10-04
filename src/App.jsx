import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
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
    useToast,
    Flex,
    Heading,
    FormControl,
    FormLabel,
    Container
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import PropertySelector from './PropertySelector';
import { IsometricMap } from './IsometricMap';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://cyberia.fun';

const App = () => {
    const [map, setMap] = useState([]);
    const [user, setUser] = useState(null);
    const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
    const [isGenerating, setIsGenerating] = useState(false);
    const [socket, setSocket] = useState(null);
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
    const {
        isOpen: isPropertySelectorOpen,
        onOpen: openPropertySelector,
        onClose: closePropertySelector
    } = useDisclosure();

    useEffect(() => {
        const newSocket = io(API_URL);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
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
            const response = await axios.get(`${API_URL}/api/tiles`, {
                params: { startX: startX - 5, startY: startY - 5, size: 10 },
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
        openPropertySelector();
    };

    const handleGenerateProperty = async (propertyDetails) => {
        setIsGenerating(true);
        closePropertySelector();
        try {
            const response = await axios.post(
                `${API_URL}/api/tiles/generate`,
                {
                    x: mapPosition.x,
                    y: mapPosition.y,
                    owner: user._id,
                    ...propertyDetails
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setMap((prevMap) =>
                prevMap?.map((tile) =>
                    tile.x === response.data.x && tile.y === response.data.y ? response.data : tile
                )
            );
            socket.emit('updateTile', response.data);
            fetchMapChunk(mapPosition.x, mapPosition.y);
        } catch (error) {
            console.error('Error generating property:', error);
            toast({
                title: 'Error generating property',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/login`, {
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
            await axios.post(`${API_URL}/api/register`, { email, password });
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

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    handleMapScroll('up');
                    break;
                case 'ArrowDown':
                    handleMapScroll('down');
                    break;
                case 'ArrowLeft':
                    handleMapScroll('left');
                    break;
                case 'ArrowRight':
                    handleMapScroll('right');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMapScroll]);

    return (
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
                    Cyberia
                    {/* {mapPosition.x} {mapPosition.y} */}
                </Heading>
                {user ? (
                    <HStack>
                        <Text>{user.email}</Text>
                        <Link to="/profile">
                            <Button>Profile</Button>
                        </Link>
                        <Button onClick={handleLogout}>Logout</Button>
                    </HStack>
                ) : (
                    <HStack>
                        <Button onClick={openLogin}>Login</Button>
                        <Button onClick={openRegister}>Register</Button>
                    </HStack>
                )}
            </Flex>

            <Container maxW="container.xl" py={4}>
                <VStack spacing={2} align="stretch">
                    (
                    <Box>
                        <Box
                            className="map-container"
                            position="relative"
                            width="100%"
                            height="69vh"
                            overflow="hidden"
                            perspective="1000px"
                        >
                            <IsometricMap
                                mapRef={mapRef}
                                map={map}
                                mapPosition={mapPosition}
                                setMapPosition={setMapPosition}
                            />
                        </Box>
                        <HStack justify="center" mt={4}>
                            <Button onClick={() => handleMapScroll('up')}>Up</Button>
                            <Button onClick={() => handleMapScroll('down')}>Down</Button>
                            <Button onClick={() => handleMapScroll('left')}>Left</Button>
                            <Button onClick={() => handleMapScroll('right')}>Right</Button>
                        </HStack>
                    </Box>
                    )
                    <Button
                        onClick={generateProperty}
                        isLoading={isGenerating}
                        loadingText="Generating..."
                        isDisabled={!user}
                    >
                        Generate Property
                    </Button>
                </VStack>
            </Container>

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

            <PropertySelector
                isOpen={isPropertySelectorOpen}
                onClose={closePropertySelector}
                onGenerate={handleGenerateProperty}
            />
        </Box>
    );
};

export default App;
