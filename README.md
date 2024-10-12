# Cyberia (built by [AutoCode](https://autocode.work))

Cyberia is an innovative MMO game where users can create their own 1024x1024 tiles property on a 3D
isometric infinite map using AI-generated content. The game is browser-based, initially free to
play, with monetization options planned for the future.

![alt text](/public/hero2.jpg)

## DEMO

https://cyberia.fun

## Key Features

-   AI-powered property generation using Stable Diffusion SDXL & Flux
-   Infinite map scrolling and exploration
-   User-owned 1024x1024 property tiles
-   Multiplayer interaction in a shared world
-   Browser-based gameplay (no downloads required)
-   Real-time chat system
-   User authentication and profiles

## Technology Stack

-   Frontend: React + Vite + Chakra UI + Router v6
-   Backend: ExpressJS + MongoDB, ES6 modules
-   AI Generation: Stable Diffusion SDXL ^ Flux
-   Containerization: Docker
-   Real-time Communication: WebSockets

## Design Considerations

1. Responsive UI for various screen sizes
2. Optimized asset loading for smooth infinite scrolling
3. Efficient property data storage and retrieval
4. Real-time multiplayer synchronization
5. Scalable backend architecture for growing user base
6. Isometric rendering optimization for performance
7. Progressive loading of map areas
8. Caching strategies for frequently accessed data
9. Serverless functions for specific AI-related tasks
10. Websocket implementation for real-time updates
11. SEO optimization for landing page and public content
12. Accessibility considerations for diverse user base
13. Cross-browser compatibility
14. Mobile-first design approach
15. Security measures for user data protection

## Planned Features

-   Property customization tools
-   Social features (friends list, trading)
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
-   Advanced property search and filtering
-   User-created mini-games within properties

## Development Roadmap

1. Core game engine and map rendering
2. Mobile responsiveness and cross-platform support
3. User authentication and profile management
4. AI integration for property generation
5. Property creation and placement system
6. Performance optimization and scalability improvements
7. Multiplayer functionality and real-time updates
8. Monetization features and premium content
9. Community tools and social features
10. Advanced AI features for dynamic world generation
11. Integration of VR and AR technologies
12. Blockchain and NFT implementation
13. Expansion of AI-driven content and gameplay elements
14. Launch of user-generated content marketplace
15. Development of external API and developer tools
16. Implementation of advanced security measures
17. Localization and internationalization
18. Integration with popular social media platforms
19. Development of mobile companion app
20. Implementation of advanced analytics and user behavior tracking

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in server/.env (including STABILITY_KEY, MONGODB_URI, JWT_SECRET)
4. Run the development server: `npm run dev` in server folder
5. Run the development server: `npm run dev` in root folder
6. Open `http://localhost:5173` in your browser

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
-   `public/`: Static assets and manifest files
-   `vite.config.js`: Vite configuration

## Contributing

We welcome contributions to Cyberia! Please read our contributing guidelines before submitting pull
requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please contact us at support@cyberia.fun

Join our community on Discord: [Cyberia Discord Server](https://discord.gg/Cyberiagame)

Follow us on Twitter: [@CyberiaGame](https://twitter.com/CyberiaGame)

## Privacy Policy

For information about how we handle user data, please refer to our
[Privacy Policy](/docs/privacy_policy.html).

# TODO

-   Local chat is actually Tile chat, use route /chat/:tileid and send it if Local selected
