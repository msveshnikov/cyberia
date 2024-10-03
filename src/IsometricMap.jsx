import { Box, Image } from '@chakra-ui/react';

export function IsometricMap({ mapRef, map, mapPosition }) {
    return (
        <Box className="isometric-map" ref={mapRef}>
            {map?.map((tile) => (
                <Box
                    key={`${tile.x}-${tile.y}`}
                    className="tile"
                    position="absolute"
                    left={`${(tile.x - mapPosition.x + 1.5) * 350}px`}
                    top={`${(tile.y - mapPosition.y + 0.5) * 176}px`}
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
                        transform="rotateX(-50deg) rotateZ(32deg) scale(1.85)"
                    >
                        <Image
                            src={`data:image/png;base64,${tile.content}`}
                            alt={`Tile ${tile.x},${tile.y}`}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                        />
                    </Box>
                </Box>
            ))}
            <Box
                position="absolute"
                left="52.1%"
                top="48.6%"
                width="250px"
                height="250px"
                border="8px solid yellow"
                transform="translate(-50%, -50%) rotateX(60deg) rotateZ(-45deg)"
                pointerEvents="none"
            />
        </Box>
    );
}
