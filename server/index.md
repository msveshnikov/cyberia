# Server Documentation (server/index.js)

## Overview

This file serves as the main entry point for the server-side application of a tile-based game world.
It sets up an Express server with various middleware, connects to a MongoDB database, implements
authentication, and handles API endpoints for user management, tile operations, and real-time
updates using Socket.IO.

## Dependencies

-   express: Web application framework
-   mongoose: MongoDB object modeling tool
-   cors: Cross-Origin Resource Sharing middleware
-   dotenv: Environment variable loader
-   morgan: HTTP request logger middleware
-   socket.io: Real-time bidirectional event-based communication
-   jsonwebtoken: JSON Web Token implementation
-   express-rate-limit: Rate limiting middleware
-   ioredis: Redis client for Node.js

## Configuration

-   The server uses environment variables loaded from a `.env` file.
-   It connects to a MongoDB database specified by the `MONGODB_URI` environment variable.
-   Redis is used for caching, with the connection URL specified by the `REDIS_URL` environment
    variable.
-   The server listens on the port specified by the `PORT` environment variable (default: 3000).

## Middleware

-   Rate limiting: Restricts clients to 500 requests per 15-minute window.
-   CORS: Enables Cross-Origin Resource Sharing.
-   JSON parsing: Parses incoming JSON payloads.
-   Static file serving: Serves static files from the `../dist` directory.
-   Morgan: Logs HTTP requests in development mode.

## Authentication

The server implements JWT-based authentication:

```javascript
const authenticateToken = (req, res, next) => {
    // ... (implementation details)
};
```

This middleware function verifies the JWT token in the Authorization header and attaches the user
information to the request object.

## API Endpoints

### User Management

1. **POST /api/register**

    - Registers a new user
    - Body: `{ email, password }`

2. **POST /api/login**

    - Authenticates a user and returns a JWT token
    - Body: `{ email, password }`

3. **GET /api/user**

    - Retrieves the authenticated user's information
    - Requires authentication

4. **POST /api/logout**
    - Logs out the user (client-side token removal)

### Tile Operations

1. **GET /api/tiles**

    - Retrieves a chunk of tiles
    - Query parameters: `startX`, `startY`, `size`

2. **GET /api/tiles/:x/:y**

    - Retrieves a specific tile by coordinates
    - Uses Redis caching

3. **POST /api/tiles/generate**

    - Generates a new tile with AI-generated content
    - Requires authentication
    - Body: `{ x, y, owner, propertyType, color, style, size, material, additionalDetails }`

4. **GET /api/user/tiles**
    - Retrieves tiles owned by the authenticated user
    - Requires authentication

## Socket.IO Events

The server sets up real-time communication using Socket.IO:

-   **joinGame**: Joins a game room
-   **updateTile**: Broadcasts tile updates to other clients in the game
-   **panMap**: Sends updated tile data when the map is panned

## Landscape Generation

The server includes functionality to generate landscape elements:

```javascript
const generateLandscapeElements = async () => {
    // ... (implementation details)
};

const initializeLandscapeElements = async () => {
    // ... (implementation details)
};
```

These functions create predefined landscape elements if they don't already exist in the database.

## Usage

To start the server:

1. Ensure all environment variables are set in a `.env` file.
2. Run `npm install` to install dependencies.
3. Execute `node server/index.js` to start the server.

The server will initialize, connect to the database, and begin listening for requests on the
specified port.

## Project Structure

This file (`server/index.js`) is the core of the server-side application. It interacts with the
`Tile` and `User` models defined in the `server/model` directory. The client-side application (in
the `src` directory) communicates with this server through the defined API endpoints and Socket.IO
events.
