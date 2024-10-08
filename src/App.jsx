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
    useDisclosure,
    useToast,
    Flex,
    Heading,
    FormControl,
    FormLabel,
    Container,
    Grid,
    GridItem,
    Icon,
    Tooltip,
    useMediaQuery,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaVolumeMute, FaVolumeUp, FaUserPlus } from 'react-icons/fa';
import PropertySelector from './PropertySelector';
import { IsometricMap } from './IsometricMap';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://cyberia.fun';

const App = () => {
    const [map, setMap] = useState([]);
    const [user, setUser] = useState(null);
    const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
    const [isGenerating, setIsGenerating] = useState(false);
    const [socket, setSocket] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isMuted, setIsMuted] = useState(() => {
        const savedMute = localStorage.getItem('isMuted');
        return savedMute ? JSON.parse(savedMute) : false;
    });
    const [goToX, setGoToX] = useState('0');
    const [goToY, setGoToY] = useState('0');
    const [currentTileOwner, setCurrentTileOwner] = useState(null);
    const toast = useToast();
    const [isMobile] = useMediaQuery('(max-width: 768px)');
    const audioRef = useRef(null);

    const {
        isOpen: isPropertySelectorOpen,
        onOpen: openPropertySelector,
        onClose: closePropertySelector
    } = useDisclosure();
    const { isOpen: isGoToOpen, onOpen: openGoTo, onClose: closeGoTo } = useDisclosure();

    useEffect(() => {
        checkUserAuth();
        const newSocket = io(API_URL);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        fetchMapChunk(mapPosition.x, mapPosition.y);
    }, [mapPosition.x, mapPosition.y]);

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

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            if (isMuted) {
                audio.pause();
            } else {
                audio.play().catch((error) => console.error('Audio playback failed:', error));
            }
        }
    }, [isMuted]);

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem('isMuted', JSON.stringify(isMuted));
    }, [isMuted]);

    const checkUserAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await axios.get(`${API_URL}/api/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
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
        const response = await axios.get(`${API_URL}/api/tiles`, {
            params: { startX: startX - 2, startY: startY - 4, sizeX: 6, sizeY: 9 },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMap(response?.data);
        const currentTile = response?.data.find((tile) => tile.x === startX && tile.y === startY);
        setCurrentTileOwner(currentTile?.owner?.email);
    };

    const generateProperty = async () => {
        if (!user) {
            toast({
                title: 'Please log in to generate a property',
                status: 'warning',
                duration: 3000,
                isClosable: true
            });
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
            toast({
                title: 'Property generated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        } catch {
            toast({
                title: 'You can build only on free tiles (landscape)',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast({
            title: 'Logged out successfully',
            status: 'info',
            duration: 3000,
            isClosable: true
        });
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleGoTo = () => {
        setMapPosition({ x: parseInt(goToX), y: parseInt(goToY) });
        closeGoTo();
    };

    const handleAddFriend = async () => {
        if (!user || !currentTileOwner || currentTileOwner === user._id) return;
        try {
            await axios.post(
                `${API_URL}/api/user/friends`,
                { friendId: currentTileOwner._id },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            toast({
                title: 'Friend request sent',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        } catch {
            toast({
                title: 'Failed to send friend request',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    };

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

    const music_no = Math.floor(Math.random() * 4) + 1;

    return (
        <Box
            minHeight="100vh"
            bg={isDarkMode ? 'gray.800' : 'gray.100'}
            color={isDarkMode ? 'white' : 'black'}
        >
            <audio ref={audioRef} loop>
                <source src={`/music${music_no}.mp3`} type="audio/mpeg" />
            </audio>
            <Flex
                as="header"
                align="center"
                justify="space-between"
                wrap="wrap"
                padding={isMobile ? '1rem' : '1.5rem'}
                bg={isDarkMode ? 'gray.700' : 'gray.200'}
            >
                <Heading as="h1" size={isMobile ? 'md' : 'lg'}>
                    Cyberia
                </Heading>
                <HStack spacing={isMobile ? 2 : 4}>
                    <Tooltip label={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
                        <Button
                            onClick={toggleDarkMode}
                            variant="ghost"
                            size={isMobile ? 'sm' : 'md'}
                        >
                            <Icon as={isDarkMode ? FaSun : FaMoon} />
                        </Button>
                    </Tooltip>
                    <Tooltip label={isMuted ? 'Unmute' : 'Mute'}>
                        <Button onClick={toggleMute} variant="ghost" size={isMobile ? 'sm' : 'md'}>
                            <Icon as={isMuted ? FaVolumeMute : FaVolumeUp} />
                        </Button>
                    </Tooltip>
                    {user ? (
                        <>
                            {!isMobile && <Text>{user.email}</Text>}
                            <Link to="/profile">
                                <Button size={isMobile ? 'sm' : 'md'}>Profile</Button>
                            </Link>
                            <Button onClick={handleLogout} size={isMobile ? 'sm' : 'md'}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button size={isMobile ? 'sm' : 'md'}>Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button size={isMobile ? 'sm' : 'md'}>Register</Button>
                            </Link>
                        </>
                    )}
                    <Link to="/chat">
                        <Button size={isMobile ? 'sm' : 'md'}>Chat</Button>
                    </Link>
                </HStack>
            </Flex>

            <Container maxW="container.xl" py={4}>
                <Grid templateColumns={isMobile ? '1fr' : 'repeat(3, 1fr)'} gap={4}>
                    <GridItem colSpan={isMobile ? 1 : 2}>
                        <Box
                            className="map-container"
                            position="relative"
                            width="100%"
                            height={isMobile ? '50vh' : '69vh'}
                            overflow="hidden"
                            perspective="1000px"
                            borderRadius="md"
                            boxShadow="xl"
                        >
                            <IsometricMap
                                map={map}
                                mapPosition={mapPosition}
                                setMapPosition={setMapPosition}
                                isDarkMode={isDarkMode}
                            />
                        </Box>
                        <HStack justify="center" mt={4}>
                            <Button
                                onClick={() => handleMapScroll('up')}
                                size={isMobile ? 'sm' : 'md'}
                            >
                                Up
                            </Button>
                            <Button
                                onClick={() => handleMapScroll('down')}
                                size={isMobile ? 'sm' : 'md'}
                            >
                                Down
                            </Button>
                            <Button
                                onClick={() => handleMapScroll('left')}
                                size={isMobile ? 'sm' : 'md'}
                            >
                                Left
                            </Button>
                            <Button
                                onClick={() => handleMapScroll('right')}
                                size={isMobile ? 'sm' : 'md'}
                            >
                                Right
                            </Button>
                            <Button onClick={openGoTo} size={isMobile ? 'sm' : 'md'}>
                                Go To
                            </Button>
                        </HStack>
                    </GridItem>
                    <GridItem>
                        <VStack spacing={4} align="stretch">
                            <Button
                                onClick={generateProperty}
                                isLoading={isGenerating}
                                loadingText="Generating..."
                                colorScheme="teal"
                                size={isMobile ? 'md' : 'lg'}
                            >
                                Generate Property
                            </Button>
                            <Box borderWidth={1} borderRadius="md" p={4}>
                                <Heading size="md" mb={2}>
                                    Current Position
                                </Heading>
                                <Text>
                                    X: {mapPosition.x}, Y: {mapPosition.y}
                                </Text>
                                {currentTileOwner && (
                                    <HStack mt={2}>
                                        <Text>Owner: {currentTileOwner}</Text>
                                        {user && currentTileOwner !== user._id && (
                                            <Tooltip label="Add to Friends">
                                                <Button onClick={handleAddFriend} size="sm">
                                                    <Icon as={FaUserPlus} />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </HStack>
                                )}
                            </Box>
                            <Box borderWidth={1} borderRadius="md" p={4}>
                                <Heading size="md" mb={2}>
                                    Game Stats
                                </Heading>
                                <Text>
                                    Properties Owned: {user ? user.ownedTiles?.length : 0} Total
                                    Players: 27
                                </Text>
                            </Box>
                        </VStack>
                    </GridItem>
                </Grid>
            </Container>

            <PropertySelector
                isOpen={isPropertySelectorOpen}
                onClose={closePropertySelector}
                onGenerate={handleGenerateProperty}
            />

            <Modal isOpen={isGoToOpen} onClose={closeGoTo}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Go To Coordinates</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>X Coordinate</FormLabel>
                                <NumberInput value={goToX} onChange={(value) => setGoToX(value)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Y Coordinate</FormLabel>
                                <NumberInput value={goToY} onChange={(value) => setGoToY(value)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            <Button onClick={handleGoTo} width="100%" colorScheme="blue">
                                Go To
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default App;
