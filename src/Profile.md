# Profile Component Documentation

## Overview

The `Profile` component is a React component that displays a user's profile information and owned
tiles in the Cyberia application. It fetches user data and owned tiles from the server, and
presents them in a visually appealing layout using Chakra UI components.

This component is part of the client-side application, located in the `src` directory. It interacts
with the server API to retrieve user-specific data.

## Key Features

-   Displays user profile information (email, join date, last login)
-   Shows a grid of owned tiles with their images and basic details
-   Allows users to view detailed information about a specific tile in a modal
-   Handles loading states and error scenarios

## Dependencies

-   React (useState, useEffect)
-   axios for API requests
-   Chakra UI components for styling and layout

## API Endpoint

The component uses an API endpoint determined by the environment:

-   Development: `http://localhost:3000`
-   Production: `https://cyberia.fun`

## Main Component: Profile

### State Variables

-   `user`: Stores the user's profile information
-   `ownedTiles`: Array of tiles owned by the user
-   `isLoading`: Boolean to track the loading state
-   `selectedTile`: Stores the currently selected tile for detailed view
-   `isOpen`, `onOpen`, `onClose`: Manage the state of the tile detail modal

### useEffect Hook

The component uses a `useEffect` hook to fetch user data and owned tiles when the component mounts.

#### Functionality

1. Retrieves the authentication token from local storage
2. Makes parallel API requests to fetch user data and owned tiles
3. Updates the component state with the fetched data
4. Handles errors and displays toast notifications

### Render Logic

1. Shows a loading spinner while data is being fetched
2. Displays a "User not found" message if no user data is available
3. Renders the user profile information and owned tiles grid when data is loaded

### Event Handlers

-   `handleTileClick`: Opens the modal with detailed information about the selected tile

## Subcomponents

### User Profile Section

Displays user information using Chakra UI's `StatGroup` and `Stat` components.

### Owned Tiles Grid

Renders a grid of owned tiles using Chakra UI's `SimpleGrid`. Each tile is displayed as a card with
an image, coordinates, property type, and style.

### Tile Detail Modal

A modal that appears when a tile is clicked, showing more detailed information about the selected
tile.

## Usage Example

```jsx
import Profile from './Profile';

function App() {
    return (
        <div>
            <Profile />
        </div>
    );
}
```

## Notes

-   The component assumes that an authentication token is stored in local storage.
-   Error handling is implemented using Chakra UI's toast notifications.
-   The component is responsive and adjusts its layout based on screen size.

## Future Improvements

-   Implement the "Edit Tile" functionality in the tile detail modal.
-   Add pagination or infinite scrolling for users with many owned tiles.
-   Implement a refresh mechanism to update tile data without full page reload.

This component plays a crucial role in the Cyberia application by providing users with a
comprehensive view of their profile and owned properties, enhancing the user experience and
engagement with the platform.
