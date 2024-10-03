# App.jsx Documentation

## Overview

`App.jsx` is the main component of the IsoCraft application, a React-based isometric map generator.
It handles user authentication, map rendering, property generation, and user interactions. The
component integrates with a backend API and uses WebSocket for real-time updates.

## Key Features

-   Isometric map rendering
-   User authentication (login/register)
-   Property generation
-   Real-time map updates using WebSockets
-   Map navigation (scrolling and dragging)

## Dependencies

-   React (useState, useEffect, useCallback, useRef)
-   axios for API requests
-   socket.io-client for WebSocket communication
-   Chakra UI for UI components
-   react-router-dom for routing

## Main Component: App

### State Variables

-   `map`: Array of tile objects representing the current map view
-   `user`: Object containing user information
-   `mapPosition`: Object with x and y coordinates of the current map view
-   `isGenerating`: Boolean indicating if a property is being generated
-   `socket`: WebSocket connection object
-   `isLoading`: Boolean for loading state
-   `email` and `password`: Strings for user authentication

### useEffect Hooks

1. WebSocket connection setup
2. Initial map fetching and user authentication check
3. Map chunk fetching based on map position changes
4. WebSocket event listener for tile updates
5. Keyboard event listener for map navigation

### Key Functions

#### `fetchInitialMap`

Fetches the initial map data from the API.

#### `checkUserAuth`

Checks if the user is authenticated using a stored token.

#### `handleMapScroll`

Updates the map position based on scroll direction.

#### `fetchMapChunk`

Fetches a new chunk of map data based on the current position.

#### `generateProperty`

Initiates the property generation process.

#### `handleGenerateProperty`

Sends a request to generate a new property on the server.

#### `renderMap`

Renders the isometric map using the current map data.

#### `handleLogin` and `handleRegister`

Handle user authentication and registration.

#### `handleMapDrag`

Enables dragging the map with the mouse.

## UI Components

-   Header with login/logout buttons
-   Isometric map display
-   Navigation buttons
-   Property generation button
-   Login and Register modals
-   PropertySelector modal

## Usage in Project

`App.jsx` serves as the main entry point for the IsoCraft application. It is rendered by `main.jsx`
and integrates with other components like `PropertySelector.jsx`. It communicates with the backend
server defined in `server/index.js` for data fetching and user authentication.

## Example Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
```

This component is designed to be the root component of the application, handling most of the core
functionality and user interactions for the IsoCraft project.
