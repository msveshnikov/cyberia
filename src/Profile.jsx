import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    VStack,
    Heading,
    Text,
    SimpleGrid,
    Image,
    Spinner,
    useToast,
    Container,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    Badge,
    Flex,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://isocraft.online';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [ownedTiles, setOwnedTiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTile, setSelectedTile] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');

                const [userResponse, tilesResponse] = await Promise.all([
                    axios.get(`${API_URL}/api/user`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_URL}/api/tiles`, {
                        params: { owner: userResponse.data._id },
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setUser(userResponse.data);
                setOwnedTiles(tilesResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast({
                    title: 'Error fetching user data',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [toast]);

    const handleTileClick = (tile) => {
        setSelectedTile(tile);
        onOpen();
    };

    if (isLoading) {
        return (
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!user) {
        return (
            <Container textAlign="center" p={5}>
                <Heading>User not found</Heading>
                <Text>Please log in to view your profile.</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={10}>
            <VStack spacing={8} align="stretch">
                <Heading as="h1" size="2xl">
                    User Profile
                </Heading>
                <StatGroup>
                    <Stat>
                        <StatLabel>Email</StatLabel>
                        <StatNumber>{user.email}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Joined</StatLabel>
                        <StatNumber>{new Date(user.createdAt).toLocaleDateString()}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Last Login</StatLabel>
                        <StatNumber>
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                        </StatNumber>
                    </Stat>
                </StatGroup>
                <Box>
                    <Heading as="h2" size="xl" mb={4}>
                        Owned Tiles
                    </Heading>
                    {ownedTiles.length === 0 ? (
                        <Text>You dont own any tiles yet.</Text>
                    ) : (
                        <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
                            {ownedTiles.map((tile) => (
                                <Box
                                    key={`${tile.x}-${tile.y}`}
                                    borderWidth={1}
                                    borderRadius="lg"
                                    overflow="hidden"
                                    boxShadow="md"
                                    transition="all 0.3s"
                                    _hover={{ transform: 'scale(1.05)', cursor: 'pointer' }}
                                    onClick={() => handleTileClick(tile)}
                                >
                                    <Image
                                        src={`data:image/jpeg;base64,${tile.content}`}
                                        alt={`Tile ${tile.x},${tile.y}`}
                                    />
                                    <Box p={3}>
                                        <Flex justifyContent="space-between" alignItems="center">
                                            <Text fontWeight="bold">
                                                ({tile.x}, {tile.y})
                                            </Text>
                                            <Badge colorScheme="green">{tile.propertyType}</Badge>
                                        </Flex>
                                        <Text mt={2}>Style: {tile.style}</Text>
                                    </Box>
                                </Box>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Tile Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedTile && (
                            <VStack spacing={4} align="stretch">
                                <Image
                                    src={`data:image/jpeg;base64,${selectedTile.content}`}
                                    alt={`Tile ${selectedTile.x},${selectedTile.y}`}
                                    borderRadius="md"
                                />
                                <Stat>
                                    <StatLabel>Coordinates</StatLabel>
                                    <StatNumber>
                                        ({selectedTile.x}, {selectedTile.y})
                                    </StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Property Type</StatLabel>
                                    <StatNumber>{selectedTile.propertyType}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Style</StatLabel>
                                    <StatNumber>{selectedTile.style}</StatNumber>
                                </Stat>
                                <Button colorScheme="blue">Edit Tile</Button>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Profile;
