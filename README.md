# IsoCraft.online

IsoCraft.online is an innovative MMO game where users can create their own 1024x1024 tiles property
on a 3D isometric infinite map using AI-generated content. The game is browser-based, initially free
to play, with monetization options planned for the future.

## Key Features

-   AI-powered property generation using Stable Diffusion SDXL
-   Infinite map scrolling and exploration
-   User-owned 1024x1024 property tiles
-   Multiplayer interaction in a shared world
-   Browser-based gameplay (no downloads required)

## Technology Stack

-   Frontend: React + Vite + Mantine UI
-   Backend: ExpressJS + MongoDB, ES6 modules
-   AI Generation: Stable Diffusion SDXL

## Design Considerations

1. Responsive UI for various screen sizes
2. Optimized asset loading for smooth infinite scrolling
3. Efficient property data storage and retrieval
4. Real-time multiplayer synchronization
5. Scalable backend architecture for growing user base
6. Isometric rendering optimization for performance
7. Caching strategies for frequently accessed tiles
8. Progressive loading of map areas
9. WebGL integration for improved graphics rendering
10. Accessibility features for diverse user base

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

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (including STABILITY_KEY)
4. Run the development server: `npm run dev`
5. Open `http://localhost:3000` in your browser

## Project Structure

-   `index.html` & `landing.html`: Entry points for the application and landing page
-   `src/`: React components and main application logic
-   `server/`: Backend Express.js server and MongoDB integration
-   `docs/`: Documentation and marketing materials

## TODO

-   Implement proper login/register UI
