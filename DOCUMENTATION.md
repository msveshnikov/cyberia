# IsoCraft Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Installation and Setup](#installation-and-setup)
6. [Module Interactions](#module-interactions)
7. [Usage Instructions](#usage-instructions)
8. [Development Roadmap](#development-roadmap)
9. [Design Considerations](#design-considerations)
10. [Planned Features](#planned-features)

## Project Overview

IsoCraft is an innovative MMO (Massively Multiplayer Online) game where users can create and explore
their own 1024x1024 tile properties on a 3D isometric infinite map. The game leverages AI-generated
content using Stable Diffusion SDXL to create unique and diverse properties. IsoCraft is designed as
a browser-based game, making it easily accessible without the need for downloads or installations.

The game combines elements of creativity, exploration, and social interaction in a shared virtual
world. Players can own, customize, and interact with properties while exploring an ever-expanding
landscape. The project aims to create an engaging and immersive experience that encourages user
creativity and community building.

## Architecture

IsoCraft follows a client-server architecture with a React-based frontend and an Express.js backend.
The application is designed to be scalable and performant, utilizing modern web technologies and
best practices.

### Frontend

-   Built with React and Vite for fast development and optimized production builds
-   Uses Chakra UI for responsive and customizable UI components
-   Implements React Router v6 for client-side routing
-   Integrates Socket.io client for real-time updates and multiplayer functionality

### Backend

-   Express.js server handling API requests and game logic
-   MongoDB for persistent data storage of user information and tile data
-   Implements JWT (JSON Web Tokens) for user authentication

### AI Integration

-   Utilizes Stable Diffusion SDXL for AI-powered property generation

### Deployment

-   Docker and Docker Compose for containerization and easy deployment
-   Nginx as a reverse proxy and for serving static assets in production

## Key Features

1. AI-powered property generation using Stable Diffusion SDXL
2. Infinite map scrolling and exploration
3. User-owned 1024x1024 property tiles
4. Multiplayer interaction in a shared world
5. Browser-based gameplay (no downloads required)
6. Responsive design for various screen sizes
7. Real-time updates and synchronization
8. User authentication and profile management

## Technology Stack

-   Frontend: React, Vite, Chakra UI, React Router v6
-   Backend: Express.js, MongoDB
-   AI Generation: Stable Diffusion SDXL
-   Real-time Communication: Socket.io
-   Authentication: JSON Web Tokens (JWT)
-   Containerization: Docker, Docker Compose
-   Version Control: Git

## Installation and Setup

1. Clone the repository:

    ```
    git clone https://github.com/msveshnikov/isocraft-autocode.git
    cd isocraft
    ```

2. Install dependencies for both frontend and backend:

    ```
    npm install
    cd server
    npm install
    cd ..
    ```

3. Set up environment variables: Create a `.env` file in the `server` directory with the following
   variables:

    ```
    STABILITY_KEY=your_stability_ai_key
    MONGODB_URI=mongodb://localhost:27017/isocraft
    JWT_SECRET=your_jwt_secret
    ```

4. Start the development servers: In the root directory:

    ```
    npm run dev
    ```

    In the `server` directory:

    ```
    npm run dev
    ```

5. Open `http://localhost:3000` in your browser to access the application.

## Module Interactions

1. **Frontend Components**:

    - `App.jsx`: Main application component, handles routing and global state
    - `Landing.jsx`: Landing page component for new users
    - `Profile.jsx`: User profile management component
    - `PropertySelector.jsx`: Component for selecting and customizing properties

2. **Backend Services**:

    - `index.js`: Main server file, sets up Express.js and Socket.io
    - `model/User.js`: Mongoose schema for user data
    - `model/Tile.js`: Mongoose schema for tile data

3. **Data Flow**:
    - Frontend components make API calls to the backend services
    - Backend services interact with MongoDB for data persistence
    - Real-time updates are pushed to clients via Socket.io
    - AI-generated content is fetched from Stable Diffusion SDXL API

## Usage Instructions

1. **User Registration and Login**:

    - Navigate to the landing page and click "Sign Up" to create a new account
    - Log in with your credentials to access the game

2. **Exploring the Map**:

    - Use mouse or touch controls to pan and zoom the isometric map
    - Discover AI-generated properties created by other players

3. **Creating a Property**:

    - Click on an empty tile to start the property creation process
    - Use the AI generation tool to create a unique property design
    - Customize and place your property on the selected tile

4. **Interacting with Other Players**:

    - Visit other players' properties
    - Use the in-game chat to communicate with nearby players

5. **Managing Your Profile**:
    - Access your profile page to view owned properties and statistics
    - Update your profile information and settings

## Development Roadmap

1. Core game engine and map rendering
2. AI integration for property generation
3. User authentication and basic profile management
4. Property creation and placement system
5. Multiplayer functionality and real-time updates
6. Monetization features and premium content
7. Community tools and social features
8. Mobile responsiveness and cross-platform support
9. Performance optimization and scalability improvements
10. Advanced AI features for dynamic world generation

## Design Considerations

1. Responsive UI for various screen sizes
2. Optimized asset loading for smooth infinite scrolling
3. Efficient property data storage and retrieval
4. Real-time multiplayer synchronization
5. Scalable backend architecture for growing user base
6. Isometric rendering optimization for performance
7. Progressive loading of map areas
8. WebGL integration for improved graphics rendering

## Planned Features

-   Property customization tools
-   Social features (chat, friends list, trading)
-   Economy system for in-game transactions
-   Achievements and progression system
-   Seasonal events and special limited-time properties
-   Collaborative building modes
-   User-generated content marketplace
-   Dynamic weather and day/night cycle
-   API for third-party integrations

This documentation provides a comprehensive overview of the IsoCraft project, including its
architecture, features, and setup instructions. As the project evolves, remember to keep this
documentation updated to reflect any changes or new features.
