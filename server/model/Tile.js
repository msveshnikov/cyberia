import mongoose from 'mongoose';
import sharp from 'sharp';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import Together from 'together-ai';
import OpenAI from 'openai';
import User from './User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const landscapeTypes = [
    'ice',
    'snow',
    'tundra',
    'taiga',
    'alpine meadow',
    'boreal forest',
    'temperate rainforest',
    'temperate deciduous forest',
    'temperate grassland',
    'temperate shrubland',
    'mediterranean scrub',
    'moss',
    'stones',
    'ground',
    'grass',
    'mud',
    'subtropical desert',
    'subtropical grassland',
    'tropical savanna',
    'tropical dry forest',
    'tropical rainforest',
    'mangrove swamp',
    'sand',
    'lava',
    'coral reef',
    'kelp forest',
    'seagrass meadow',
    'water',
    'deep ocean',
    'hydrothermal vent'
];

const tileSchema = new mongoose.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    isCustomized: { type: Boolean, default: false },
    aiPrompt: { type: String },
    style: { type: String },
    propertyType: { type: String },
    color: { type: String },
    size: { type: String },
    material: { type: String }
});

tileSchema.index({ x: 1, y: 1 }, { unique: true });

tileSchema.statics.findOrCreate = async function (x, y, owner) {
    let tile = await this.findOne({ x, y });
    if (!tile) {
        tile = new this({ x, y, content: 'default', owner });
        await tile.save();
    }
    return tile;
};

tileSchema.statics.getChunk = async function (startX, startY, sizeX, sizeY) {
    const tiles = await this.find({
        x: { $gte: startX, $lt: startX + sizeX },
        y: { $gte: startY, $lt: startY + sizeY }
    })
        .populate('owner', 'email')
        .lean();

    const chunk = [];
    for (let y = startY; y < startY + sizeY; y++) {
        for (let x = startX; x < startX + sizeX; x++) {
            const tile = tiles.find((t) => t.x === x && t.y === y);
            if (tile) {
                chunk.push(tile);
            } else {
                const newTile = await this.takeFractalLandscapeTile(x, y);
                if (newTile) {
                    newTile.x = x;
                    newTile.y = y;
                    chunk.push(newTile);
                }
            }
        }
    }

    return chunk;
};

const together = new Together({ apiKey: process.env.TOGETHER_KEY });

tileSchema.statics.generateWithFlux = async function (prompt) {
    const response = await together.images.create({
        model: 'black-forest-labs/FLUX.1-schnell-Free',
        prompt: prompt,
        width: 1024,
        height: 1024,
        steps: 4,
        n: 1,
        response_format: 'b64_json'
    });
    return response.data[0].b64_json;
};

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

const getTextGpt = async (prompt) => {
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
    });
    return completion.choices?.[0]?.message?.content;
};

tileSchema.statics.generateAIContent = async function (
    x,
    y,
    owner,
    propertyType,
    style,
    color,
    size,
    material,
    customPrompt = '',
    landscape = false,
    useFlux = false
) {
    const basePrompt = `Create an isometric tile for a game map. The tile should be cohesive style that fits into an infinite, scrollable game world. ${landscape ? 'Landscape' : 'Property'} type: ${propertyType}, Style:${style}, Color: ${color}, Size: ${size}, Material: ${material}.  ${customPrompt}`;

    const scenePrompt = `Pretend you are a graphic designer generating creative images for midjourney. 
    Midjourney is an app that can generate AI art from simple prompts. 
    I will give you a scene description and you will give me a prompt that I can feed into midjourney. 
    
    ${basePrompt}`;

    const RETRY_LIMIT = 3;
    let processedPrompt = basePrompt;

    for (let i = 0; i < RETRY_LIMIT; i++) {
        const translated = await getTextGpt(scenePrompt);
        if (translated) {
            processedPrompt = translated;
            break;
        }
    }

    let imageBuffer;

    if (useFlux) {
        const base64Image = await this.generateWithFlux(processedPrompt);
        imageBuffer = Buffer.from(base64Image, 'base64');
    } else {
        const response = await fetch(
            'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.STABILITY_KEY}`
                },
                body: JSON.stringify({
                    text_prompts: [{ text: processedPrompt }],
                    style_preset: 'isometric',
                    cfg_scale: 7,
                    height: 1024,
                    width: 1024,
                    samples: 1,
                    steps: 30
                })
            }
        );

        if (!response.ok) {
            throw new Error(`AI generation failed: ${response.statusText}`);
        }

        const result = await response.json();
        imageBuffer = Buffer.from(result.artifacts[0].base64, 'base64');
    }

    const jpgBuffer = await sharp(imageBuffer).jpeg({ quality: 80 }).toBuffer();

    const fileName = `${x}_${y}.jpg`;

    const dirPath = join(__dirname, '../../content');
    const filePath = join(dirPath, fileName);

    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, jpgBuffer);

    const tile = await this.findOneAndUpdate(
        { x, y },
        {
            content: `/content/${fileName}`,
            isCustomized: false,
            aiPrompt: processedPrompt,
            propertyType,
            color,
            style,
            size,
            material,
            owner
        },
        { new: true, upsert: true }
    );

    return tile;
};

tileSchema.statics.updateTileOwnership = async function (x, y, userId) {
    const tile = await this.findOneAndUpdate(
        { x, y },
        { owner: userId },
        { new: true, upsert: true }
    );
    await User.findByIdAndUpdate(userId, { $addToSet: { ownedTiles: tile._id } });
    return tile;
};

tileSchema.statics.getOwnedTiles = async function (userId) {
    return this.find({ owner: userId }).lean();
};

tileSchema.statics.isSpaceEmpty = async function (x, y) {
    const tile = await this.findOne({ x, y });
    return !tile || tile.content === 'default';
};

tileSchema.statics.takeFractalLandscapeTile = async function (x, y) {
    const scale = 0.005;
    const persistence = 0.5;
    const octaves = 6;

    const noise = (x, y) => {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = fade(x);
        const v = fade(y);
        const A = p[X] + Y,
            B = p[X + 1] + Y;
        return lerp(
            v,
            lerp(u, grad(p[A], x, y), grad(p[B], x - 1, y)),
            lerp(u, grad(p[A + 1], x, y - 1), grad(p[B + 1], x - 1, y - 1))
        );
    };

    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t, a, b) => a + t * (b - a);
    const grad = (hash, x, y) => {
        const h = hash & 15;
        const grad = 1 + (h & 7);
        return (h & 8 ? -grad : grad) * x + (h & 4 ? -grad : grad) * y;
    };

    const p = new Array(512);
    // should be deterministic, no random!
    for (let i = 0; i < 256; i++) p[i] = p[i + 256] = Math.floor(0.1 * 256);

    let value = 0;
    let amplitude = 1;
    let frequency = scale;
    for (let i = 0; i < octaves; i++) {
        value += amplitude * noise(x * frequency, y * frequency);
        amplitude *= persistence;
        frequency *= 2;
    }

    const normalizedValue = (value + 1) / 2;
    let landscapeTypeIndex = Math.floor(normalizedValue * landscapeTypes.length);
    landscapeTypeIndex = Math.max(0, Math.min(landscapeTypeIndex, landscapeTypes.length - 1));
    const landscapeType = landscapeTypes[landscapeTypeIndex];

    return this.findOne({ propertyType: landscapeType });
};

const Tile = mongoose.model('Tile', tileSchema);

export default Tile;
