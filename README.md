# Cyberia (built by [AutoCode](https://autocode.work))

Cyberia is an innovative MMO game where users can create their own 1024x1024 tiles property on a 3D
isometric infinite map using AI-generated content. The game is browser-based, initially free to
play, with monetization options planned for the future.

![alt text](/public/hero2.jpg)

## DEMO

https://cyberia.fun

## Key Features

-   AI-powered property generation using Stable Diffusion SDXL
-   Infinite map scrolling and exploration
-   User-owned 1024x1024 property tiles
-   Multiplayer interaction in a shared world
-   Browser-based gameplay (no downloads required)

## Technology Stack

-   Frontend: React + Vite + Chakra UI + Router v6
-   Backend: ExpressJS + MongoDB, ES6 modules
-   AI Generation: Stable Diffusion SDXL
-   Containerization: Docker

## Design Considerations

1. Responsive UI for various screen sizes
2. Optimized asset loading for smooth infinite scrolling
3. Efficient property data storage and retrieval
4. Real-time multiplayer synchronization
5. Scalable backend architecture for growing user base
6. Isometric rendering optimization for performance
7. Progressive loading of map areas
8. WebGL integration for improved graphics rendering
9. Microservices architecture for better scalability
10. Caching strategies for frequently accessed data
11. Serverless functions for specific AI-related tasks
12. Websocket implementation for real-time updates
13. Automated testing and continuous integration
14. Localization support for multiple languages
15. Accessibility features for inclusive gameplay

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
-   Virtual reality (VR) support
-   Augmented reality (AR) mobile companion app
-   Cross-platform account linking
-   In-game NFT integration
-   AI-powered NPCs and quests

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
11. Integration of VR and AR technologies
12. Blockchain and NFT implementation
13. Expansion of AI-driven content and gameplay elements
14. Launch of user-generated content marketplace
15. Development of external API and developer tools

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in server/.env (including STABILITY_KEY, MONGODB_URI, JWT_SECRET)
4. Run the development server: `npm run dev` in server folder
5. Open `http://localhost:3000` in your browser

## Docker Setup

1. Ensure Docker and Docker Compose are installed on your system
2. Build and run the containers: `docker-compose up --build`
3. Access the application at `http://localhost:3000`

## Project Structure

-   `index.html` & `public/landing.html`: Entry points for the application and landing page
-   `src/`: React components and main application logic
-   `server/`: Backend Express.js server and MongoDB integration
-   `docs/`: Documentation and marketing materials
-   `Dockerfile` & `docker-compose.yml`: Docker configuration files
-   `.prettierrc`: Code formatting configuration

## Contributing

We welcome contributions to Cyberia! Please read our contributing guidelines before submitting pull
requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please contact us at support@cyberia.fun

Join our community on Discord: [Cyberia Discord Server](https://discord.gg/Cyberiagame)

Follow us on Twitter: [@CyberiaGame](https://twitter.com/CyberiaGame)

