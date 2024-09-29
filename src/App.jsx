import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const App = () => {
    const [map, setMap] = useState([]);
    const [currentTile, setCurrentTile] = useState(null);
    const [user, setUser] = useState(null);
    const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
    const [isGenerating, setIsGenerating] = useState(false);
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);

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
            setError('Error fetching initial map');
            console.error('Error fetching initial map:', error);
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
            alert('Please log in to generate a property');
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
            <div className="isometric-map" ref={mapRef}>
                {map?.map((tile) => (
                    <div
                        key={`${tile.x}-${tile.y}`}
                        className="tile"
                        onClick={() => placeTile(tile.x, tile.y)}
                        style={{
                            left: `${(tile.x - mapPosition.x) * 50}px`,
                            top: `${(tile.y - mapPosition.y) * 50}px`,
                            backgroundImage: `url(data:image/png;base64,${tile.content})`
                        }}
                    />
                ))}
            </div>
        );
    };

    const handleLogin = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                username,
                password
            });
            localStorage.setItem('token', response.data.accessToken);
            setUser(response.data.user);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const handleRegister = async (username, password) => {
        try {
            await axios.post('http://localhost:3000/api/register', { username, password });
            handleLogin(username, password);
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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="app">
            <header>
                <h1>IsoCraft.online</h1>
                {user ? (
                    <div className="user-info">
                        <span>Welcome, {user.username}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <button onClick={() => handleLogin('TestUser', 'password')}>Login</button>
                        <button onClick={() => handleRegister('NewUser', 'password')}>
                            Register
                        </button>
                    </div>
                )}
            </header>
            <main>
                <div className="map-container">
                    {renderMap()}
                    <div className="map-controls">
                        <button onClick={() => handleMapScroll('up')}>Up</button>
                        <button onClick={() => handleMapScroll('down')}>Down</button>
                        <button onClick={() => handleMapScroll('left')}>Left</button>
                        <button onClick={() => handleMapScroll('right')}>Right</button>
                    </div>
                </div>
                <div className="controls">
                    <button onClick={generateProperty} disabled={isGenerating || !user}>
                        {isGenerating ? 'Generating...' : 'Generate Property'}
                    </button>
                </div>
            </main>
            <footer>
                <p>&copy; 2024 IsoCraft.online</p>
            </footer>
        </div>
    );
};

export default App;
