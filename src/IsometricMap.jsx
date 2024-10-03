import { useEffect, useRef } from 'react';
import { Box, Image } from '@chakra-ui/react';

export function IsometricMap({ mapRef, map, mapPosition, setMapPosition }) {
    const isDragging = useRef(false);
    const lastPosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseDown = (e) => {
            isDragging.current = true;
            lastPosition.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseMove = (e) => {
            if (isDragging.current) {
                const deltaX = e.clientX - lastPosition.current.x;
                const deltaY = e.clientY - lastPosition.current.y;
                setMapPosition((prev) => ({
                    x: prev.x - deltaX / 350,
                    y: prev.y - deltaY / 176
                }));
                lastPosition.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        const handleTouchStart = (e) => {
            if (e.touches.length === 1) {
                isDragging.current = true;
                lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        };

        const handleTouchMove = (e) => {
            if (isDragging.current && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - lastPosition.current.x;
                const deltaY = e.touches[0].clientY - lastPosition.current.y;
                setMapPosition((prev) => ({
                    x: prev.x - deltaX / 350,
                    y: prev.y - deltaY / 176
                }));
                lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        };

        const handleTouchEnd = () => {
            isDragging.current = false;
        };

        const mapElement = mapRef.current;
        mapElement.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        mapElement.addEventListener('touchstart', handleTouchStart);
        mapElement.addEventListener('touchmove', handleTouchMove);
        mapElement.addEventListener('touchend', handleTouchEnd);

        return () => {
            mapElement.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            mapElement.removeEventListener('touchstart', handleTouchStart);
            mapElement.removeEventListener('touchmove', handleTouchMove);
            mapElement.removeEventListener('touchend', handleTouchEnd);
        };
    }, [mapRef, setMapPosition]);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    return (
        <Box className="isometric-map" ref={mapRef} position="relative" width="100%" height="100%">
            {map?.map((tile) => {
                const x = (tile.x - mapPosition.x - 1) * 350 + centerX;
                const y = (tile.y - mapPosition.y - 3) * (176 / 2) + centerY;
                const isOddRow = tile.y % 2 !== 0;

                return (
                    <Box
                        key={`${tile.x}-${tile.y}`}
                        className="tile"
                        position="absolute"
                        left={`${x + (isOddRow ? 175 : 0)}px`}
                        top={`${y + (isOddRow ? 175 : 0)}px`}
                        width="250px"
                        height="250px"
                        transform="rotateX(60deg) rotateZ(-45deg)"
                        style={{ transformStyle: 'preserve-3d', overflow: 'hidden' }}
                    >
                        <Box
                            position="absolute"
                            top="0"
                            left="0"
                            width="100%"
                            height="100%"
                            transform="rotateX(-45deg) rotateZ(32deg) scale(1.65)"
                        >
                            <Image
                                src={`data:image/jpeg;base64,${tile.content}`}
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
                left={`${-350 + centerX}px`}
                top={`${-3 * (176 / 2) + centerY}px`}
                width="250px"
                height="250px"
                border="8px solid yellow"
                transform="rotateX(60deg) rotateZ(-45deg)"
                pointerEvents="none"
            />
        </Box>
    );
}
