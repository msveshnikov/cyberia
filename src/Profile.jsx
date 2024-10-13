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
    useDisclosure,
    Avatar,
    HStack,
    Progress,
    useBreakpointValue
} from '@chakra-ui/react';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://cyberia.fun';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [ownedTiles, setOwnedTiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTile, setSelectedTile] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');

                const [userResponse, tilesResponse] = await Promise.all([
                    axios.get(`${API_URL}/api/user`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_URL}/api/user/tiles`, {
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

    const handleEditTile = () => {
        toast({
            title: 'Edit Tile',
            description: 'Tile editing functionality not implemented yet.',
            status: 'info',
            duration: 3000,
            isClosable: true
        });
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
        <Container maxW="container.xl" py={5}>
            <VStack spacing={6} align="stretch">
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <HStack mb={{ base: 4, md: 0 }}>
                        <Avatar size="xl" name={user.email} src={user.profilePicture} />
                        <VStack align="start" spacing={0}>
                            <Heading as="h3" size="lg">
                                {user.email}
                            </Heading>
                            <Badge colorScheme={user.premium ? 'purple' : 'gray'}>
                                {user.premium ? 'Premium' : 'Free'}
                            </Badge>
                        </VStack>
                    </HStack>
                </Flex>
                <StatGroup flexWrap="wrap" justifyContent="space-between">
                    <Stat flexBasis={{ base: '50%', md: '25%' }} textAlign="center" mb={4}>
                        <StatLabel>Joined</StatLabel>
                        <StatNumber fontSize="sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </StatNumber>
                    </Stat>
                    <Stat flexBasis={{ base: '50%', md: '25%' }} textAlign="center" mb={4}>
                        <StatLabel>Last Login</StatLabel>
                        <StatNumber fontSize="sm">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                        </StatNumber>
                    </Stat>
                    <Stat flexBasis={{ base: '50%', md: '25%' }} textAlign="center" mb={4}>
                        <StatLabel>Balance</StatLabel>
                        <StatNumber fontSize="sm">{user.balance} coins</StatNumber>
                    </Stat>
                    <Stat flexBasis={{ base: '50%', md: '25%' }} textAlign="center" mb={4}>
                        <StatLabel>Owned Properties</StatLabel>
                        <StatNumber fontSize="sm">{ownedTiles.length}</StatNumber>
                    </Stat>
                </StatGroup>
                <Box>
                    <Heading as="h2" size="md" mb={2}>
                        Achievements
                    </Heading>
                    <Progress value={(user.achievements.length / 3) * 100} mb={2} />
                    <SimpleGrid columns={3} spacing={2}>
                        {['first_property', 'ten_properties', 'master'].map((achievement) => (
                            <Badge
                                key={achievement}
                                colorScheme={
                                    user.achievements.includes(achievement) ? 'green' : 'gray'
                                }
                                p={1}
                                borderRadius="md"
                                fontSize="xs"
                                textAlign="center"
                            >
                                {achievement.replace(/_/g, ' ')}
                            </Badge>
                        ))}
                    </SimpleGrid>
                </Box>
                <Box>
                    <Heading as="h2" size="md" mb={4}>
                        Owned Properties
                    </Heading>
                    {ownedTiles.length === 0 ? (
                        <Text>You dont own any tiles yet.</Text>
                    ) : (
                        <SimpleGrid columns={columns} spacing={4}>
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
                                    <Image src={tile.content} alt={`Tile ${tile.x},${tile.y}`} />
                                    <Box p={2}>
                                        <Flex justifyContent="space-between" alignItems="center">
                                            <Text fontWeight="bold" fontSize="sm">
                                                ({tile.x}, {tile.y})
                                            </Text>
                                            <Badge colorScheme="green" fontSize="xs">
                                                {tile.propertyType}
                                            </Badge>
                                        </Flex>
                                        <Text mt={1} fontSize="xs">
                                            Style: {tile.style}
                                        </Text>
                                    </Box>
                                </Box>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Tile Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedTile && (
                            <VStack spacing={4} align="stretch">
                                <Image
                                    src={selectedTile.content}
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
                                <Button colorScheme="blue" onClick={handleEditTile}>
                                    Edit Tile
                                </Button>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Profile;
