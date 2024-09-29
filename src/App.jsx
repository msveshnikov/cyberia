import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [map, setMap] = useState([]);
    const [currentTile, setCurrentTile] = useState(null);
    const [user, setUser] = useState(null);
    const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        fetchInitialMap();
        checkUserAuth();
    }, []);

    useEffect(() => {
        fetchMapChunk(mapPosition.x, mapPosition.y);
    }, [mapPosition]);

    const fetchInitialMap = async () => {
        try {
            const response = await axios.get('/api/tiles', {
                params: { startX: 0, startY: 0, size: 10 }
            });
            setMap(response.data);
        } catch (error) {
            console.error('Error fetching initial map:', error);
        }
    };

    const checkUserAuth = async () => {
        try {
            const response = await axios.get('/api/user');
            setUser(response.data);
        } catch (error) {
            console.error('Error checking user auth:', error);
        }
    };

    const handleMapScroll = (direction) => {
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
    };

    const fetchMapChunk = async (startX, startY) => {
        try {
            const response = await axios.get('/api/tiles', {
                params: { startX, startY, size: 10 }
            });
            setMap((prevMap) => [...prevMap, ...response.data]);
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
            const response = await axios.post('/api/tiles/generate', {
                x: mapPosition.x,
                y: mapPosition.y
            });
            setCurrentTile(response.data);
            setMap((prevMap) =>
                prevMap.map((tile) =>
                    tile.x === response.data.x && tile.y === response.data.y ? response.data : tile
                )
            );
        } catch (error) {
            console.error('Error generating property:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const placeTile = async (x, y) => {
        if (!currentTile) return;

        try {
            const response = await axios.put(`/api/tiles/${x}/${y}`, {
                content: currentTile.content
            });
            setMap((prevMap) =>
                prevMap.map((tile) => (tile.x === x && tile.y === y ? response.data : tile))
            );
            setCurrentTile(null);
        } catch (error) {
            console.error('Error placing tile:', error);
        }
    };

    const renderMap = () => {
        return (
            <div className="isometric-map">
                {map.map((tile) => (
                    <div
                        key={`${tile.x}-${tile.y}`}
                        className="tile"
                        onClick={() => placeTile(tile.x, tile.y)}
                        style={{
                            left: `${(tile.x - mapPosition.x) * 50}px`,
                            top: `${(tile.y - mapPosition.y) * 50}px`
                        }}
                    >
                        {tile.content}
                    </div>
                ))}
            </div>
        );
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/login', {
                username: 'TestUser',
                password: 'password'
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

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
                    <button onClick={handleLogin}>Login</button>
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
                    <button onClick={generateProperty} disabled={isGenerating}>
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
