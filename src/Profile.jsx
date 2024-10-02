import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, VStack, Heading, Text, SimpleGrid, Image, Spinner, useToast } from '@chakra-ui/react';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://isocraft.online';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [ownedTiles, setOwnedTiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const userResponse = await axios.get(`${API_URL}/api/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userResponse.data);

                const tilesResponse = await axios.get(`${API_URL}/api/tiles`, {
                    params: { owner: userResponse.data._id },
                    headers: { Authorization: `Bearer ${token}` }
                });
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

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box textAlign="center" p={5}>
                <Heading>User not found</Heading>
                <Text>Please log in to view your profile.</Text>
            </Box>
        );
    }

    return (
        <Box maxWidth="1200px" margin="auto" p={5}>
            <VStack spacing={8} align="stretch">
                <Heading as="h1" size="2xl">
                    User Profile
                </Heading>
                <Box>
                    <Text fontSize="xl">Email: {user.email}</Text>
                    <Text fontSize="xl">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                    <Text fontSize="xl">
                        Last Login:{' '}
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                    </Text>
                </Box>
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
                                >
                                    <Image
                                        src={`data:image/png;base64,${tile.content}`}
                                        alt={`Tile ${tile.x},${tile.y}`}
                                    />
                                    <Box p={3}>
                                        <Text fontWeight="bold">
                                            Coordinates: ({tile.x}, {tile.y})
                                        </Text>
                                        <Text>Type: {tile.propertyType}</Text>
                                        <Text>Style: {tile.style}</Text>
                                    </Box>
                                </Box>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </VStack>
        </Box>
    );
};

export default Profile;
