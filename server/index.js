import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import Tile from './model/Tile.js';
import User from './model/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500
});

app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));
app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI, {});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await user.comparePassword(req.body.password)) {
            const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
            await user.updateLastLogin();
            res.json({ accessToken: accessToken, user: { email: user.email } });
        } else {
            res.status(401).send('Not Allowed');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/logout', (req, res) => {
    res.sendStatus(200);
});

app.get('/api/tiles', async (req, res) => {
    try {
        const { startX, startY, size } = req.query;
        const tiles = await Tile.getChunk(Number(startX), Number(startY), Number(size));
        res.json(tiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/tiles/:x/:y', async (req, res) => {
    try {
        const tile = await Tile.findOne({ x: req.params.x, y: req.params.y });
        if (tile) {
            res.json(tile);
        } else {
            res.status(404).json({ message: 'Tile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/tiles/generate', authenticateToken, async (req, res) => {
    try {
        const { x, y, owner, propertyType, color, style, size, material, additionalDetails } =
            req.body;
        const existingTile = await Tile.findOne({ x, y });
        if (existingTile) {
            return res.status(400).json({ message: 'Tile already exists' });
        }
        const generatedTile = await Tile.generateAIContent(
            x,
            y,
            owner,
            propertyType,
            style,
            color,
            size,
            material,
            additionalDetails
        );
        res.status(201).json(generatedTile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

io.on('connection', (socket) => {
    socket.on('joinGame', (data) => {
        socket.join(data.gameId);
    });

    socket.on('updateTile', (data) => {
        socket.to(data.gameId).emit('tileUpdated', data);
    });
});

app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
