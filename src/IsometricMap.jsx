import { useEffect, useState, useMemo } from 'react';
import { Box, Image } from '@chakra-ui/react';

const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://cyberia.fun';
const TILE_SIZE = 250;
const TILE_OFFSET_X = TILE_SIZE * 1.4;
const TILE_OFFSET_Y = TILE_OFFSET_X / 2;

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
    const shift = windowSize.width < 850 ? TILE_SIZE * 0.8 : -TILE_SIZE * 0.8;

    const handleTileClick = (x, y) => {
        setMapPosition({ x, y });
    };

    const visibleTiles = useMemo(() => {
        return map;
    }, [map]);

    return (
        <Box className="isometric-map" position="relative" width="100%" height="100%">
            {visibleTiles.map((tile) => {
                const x = (tile.x - mapPosition.x - 1) * TILE_OFFSET_X + centerX + shift;
                const y = ((tile.y - mapPosition.y - 3) * TILE_OFFSET_Y) / 2 + centerY;
                const isOddRow = tile.y % 2 !== 0;
                const isOddPosition = mapPosition.y % 2 !== 0;

                return (
                    <Box
                        key={`${tile.x}-${tile.y}`}
                        className="tile"
                        position="absolute"
                        left={`${x + (isOddRow ? TILE_OFFSET_Y : 0) - (isOddPosition ? TILE_OFFSET_Y : 0)}px`}
                        top={`${y}px`}
                        width={`${TILE_SIZE}px`}
                        height={`${TILE_SIZE}px`}
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
                            transform="rotateX(-45deg) rotateZ(35deg) scale(1.65)"
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
                left={`${-TILE_OFFSET_Y * 2 + centerX + shift}px`}
                top={`${-3 * (TILE_OFFSET_Y / 2) + centerY}px`}
                width={`${TILE_SIZE}px`}
                height={`${TILE_SIZE}px`}
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
