import { useEffect, useState, useMemo } from 'react';
import { Box, Image } from '@chakra-ui/react';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://cyberia.fun';

export function IsometricMap({ map, mapPosition, setMapPosition }) {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const centerX = windowSize.width / 2;
    const centerY = windowSize.height / 2;
    const shift = windowSize.width < 600 ? 200 : -200;

    const handleTileClick = (x, y) => {
        setMapPosition({ x, y });
    };

    const visibleTiles = useMemo(() => {
        const tileWidth = 350;
        const tileHeight = 175;
        const viewportWidth = windowSize.width;
        const viewportHeight = windowSize.height;

        return map.filter((tile) => {
            const x = (tile.x - mapPosition.x - 1) * tileWidth + centerX + shift;
            const y = ((tile.y - mapPosition.y - 3) * tileHeight) / 2 + centerY;

            return (
                x > -tileWidth &&
                x < viewportWidth + tileWidth &&
                y > -tileHeight &&
                y < viewportHeight + tileHeight
            );
        });
    }, [map, mapPosition, windowSize, centerX, centerY, shift]);

    return (
        <Box className="isometric-map" position="relative" width="100%" height="100%">
            {visibleTiles.map((tile) => {
                const x = (tile.x - mapPosition.x - 1) * 350 + centerX + shift;
                const y = ((tile.y - mapPosition.y - 3) * 175) / 2 + centerY;
                const isOddRow = tile.y % 2 !== 0;
                const isOddPosition = mapPosition.y % 2 !== 0;

                return (
                    <Box
                        key={`${tile.x}-${tile.y}`}
                        className="tile"
                        position="absolute"
                        left={`${x + (isOddRow ? 175 : 0) - (isOddPosition ? 175 : 0)}px`}
                        top={`${y}px`}
                        width="250px"
                        height="250px"
                        transform="rotateX(60deg) rotateZ(-45deg)"
                        style={{ transformStyle: 'preserve-3d', overflow: 'hidden' }}
                        onClick={() => handleTileClick(tile.x, tile.y)}
                        cursor="pointer"
                    >
                        <Box
                            position="absolute"
                            top="0"
                            left="0"
                            width="100%"
                            height="100%"
                            transform="rotateX(-45deg) rotateZ(34deg) scale(1.65)"
                        >
                            <Image
                                src={API_URL + tile.content}
                                alt={`Tile ${tile.x},${tile.y}`}
                                width="100%"
                                height="100%"
                                objectFit="cover"
                            />
                        </Box>
                    </Box>
                );
            })}
            <Box
                className="tile"
                position="absolute"
                left={`${-175 * 2 + centerX + shift}px`}
                top={`${-3 * (175 / 2) + centerY}px`}
                width="250px"
                height="250px"
                border="8px solid yellow"
                transform="rotateX(60deg) rotateZ(-45deg)"
                pointerEvents="none"
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: '-1px',
                    left: '-1px',
                    right: '-1px',
                    bottom: '-1px',
                    background: 'rgba(255, 255, 0, 0.1)'
                }}
            />
        </Box>
    );
}
