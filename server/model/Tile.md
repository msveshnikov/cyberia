# Tile Model Documentation

## Overview

The `Tile.js` file defines the Mongoose schema and model for the Tile entity in the Infinite
Isometric World project. This model represents individual tiles in the game world, handling their
properties, generation, and retrieval. It also includes methods for AI-generated content and
landscape generation.

## Schema Definition

The `tileSchema` includes the following fields:

-   `x`: Number (required) - X-coordinate of the tile
-   `y`: Number (required) - Y-coordinate of the tile
-   `owner`: ObjectId (reference to User model) - Owner of the tile
-   `content`: String (required) - Content of the tile (e.g., base64 image data)
-   `generatedAt`: Date - Timestamp of tile generation
-   `lastModified`: Date - Timestamp of last modification
-   `isCustomized`: Boolean - Indicates if the tile has been customized
-   `aiPrompt`: String - Prompt used for AI generation
-   `style`: String - Style of the tile
-   `propertyType`: String - Type of property on the tile
-   `color`: String - Color of the tile
-   `size`: String - Size of the tile
-   `material`: String - Material of the tile

## Constants

### `landscapeTypes`

An array of predefined landscape types used for procedural generation:

```javascript
['grass', 'stones', 'ground', 'sand', 'snow', 'mud', 'water', 'lava', 'moss', 'ice'];
```

## Static Methods

### `findOrCreate(x, y, owner)`

Finds an existing tile or creates a new one if it doesn't exist.

-   Parameters:
    -   `x`: Number - X-coordinate
    -   `y`: Number - Y-coordinate
    -   `owner`: ObjectId - Owner of the tile
-   Returns: Promise<Tile> - The found or created tile

### `getChunk(startX, startY, size)`

Retrieves or generates a chunk of tiles.

-   Parameters:
    -   `startX`: Number - Starting X-coordinate of the chunk
    -   `startY`: Number - Starting Y-coordinate of the chunk
    -   `size`: Number - Size of the chunk
-   Returns: Promise<Array<Tile>> - Array of tiles in the chunk

### `generateAIContent(x, y, owner, propertyType, style, color, size, material, customPrompt)`

Generates AI content for a tile using the Stability AI API.

-   Parameters:
    -   `x`, `y`: Number - Coordinates of the tile
    -   `owner`: ObjectId - Owner of the tile
    -   `propertyType`, `style`, `color`, `size`, `material`: String - Tile properties
    -   `customPrompt`: String (optional) - Custom prompt for AI generation
-   Returns: Promise<Tile> - The updated tile with AI-generated content

### `updateTileOwnership(x, y, userId)`

Updates the ownership of a tile.

-   Parameters:
    -   `x`, `y`: Number - Coordinates of the tile
    -   `userId`: ObjectId - ID of the new owner
-   Returns: Promise<Tile> - The updated tile

### `getOwnedTiles(userId)`

Retrieves all tiles owned by a specific user.

-   Parameters:
    -   `userId`: ObjectId - ID of the user
-   Returns: Promise<Array<Tile>> - Array of tiles owned by the user

### `isSpaceEmpty(x, y)`

Checks if a tile space is empty or contains default content.

-   Parameters:
    -   `x`, `y`: Number - Coordinates of the tile
-   Returns: Promise<Boolean> - True if the space is empty, false otherwise

### `takeFractalLandscapeTile(x, y)`

Generates a procedural landscape tile using fractal noise.

-   Parameters:
    -   `x`, `y`: Number - Coordinates of the tile
-   Returns: Promise<Tile> - A tile with a procedurally generated landscape type

## Usage in the Project

This `Tile` model is a crucial part of the server-side logic for the Infinite Isometric World
project. It's used in API endpoints and game logic to manage the state of the game world, handle
tile generation, and process user interactions with the world map.

## Example Usage

```javascript
import Tile from './model/Tile.js';

// Find or create a tile
const tile = await Tile.findOrCreate(10, 20, userId);

// Generate AI content for a tile
const aiTile = await Tile.generateAIContent(
    15,
    25,
    userId,
    'house',
    'modern',
    'blue',
    'large',
    'wood'
);

// Get a chunk of tiles
const chunk = await Tile.getChunk(0, 0, 16);

// Update tile ownership
const updatedTile = await Tile.updateTileOwnership(5, 5, newOwnerId);

// Check if a space is empty
const isEmpty = await Tile.isSpaceEmpty(30, 30);
```

This model interacts with Stability AI API for content generation,
making it a central component in managing the game world's state and appearance.
