import mongoose from 'mongoose';

const tileSchema = new mongoose.Schema({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    isCustomized: {
        type: Boolean,
        default: false
    },
    aiPrompt: {
        type: String
    },
    style: {
        type: String
    },
    propertyType: {
        type: String
    },
    color: {
        type: String
    },
    size: {
        type: String
    },
    material: {
        type: String
    }
});

tileSchema.index({ x: 1, y: 1 }, { unique: true });

tileSchema.methods.updateContent = async function (
    newContent,
    aiPrompt,
    style,
    propertyType,
    color,
    size,
    material
) {
    this.content = newContent;
    this.lastModified = Date.now();
    this.isCustomized = true;
    this.aiPrompt = aiPrompt;
    this.style = style;
    this.propertyType = propertyType;
    this.color = color;
    this.size = size;
    this.material = material;
    return this.save();
};

tileSchema.statics.findOrCreate = async function (x, y, owner) {
    let tile = await this.findOne({ x, y });
    if (!tile) {
        tile = new this({ x, y, content: 'default', owner });
        await tile.save();
    }
    return tile;
};

tileSchema.statics.getChunk = async function (startX, startY, size) {
    return this.find({
        x: { $gte: startX, $lt: startX + size },
        y: { $gte: startY, $lt: startY + size }
    }).lean();
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
    customPrompt = ''
) {
    const basePrompt = `Create an isometric tile for a game map. The tile should be a 1024x1024 pixel image with a cohesive style that fits into an infinite, scrollable game world. Property type: ${propertyType}, Style:${style}, Color: ${color}, Size: ${size}, Material: ${material}.`;
    const prompt = customPrompt ? `${basePrompt} ${customPrompt}` : basePrompt;

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
                text_prompts: [{ text: prompt }],
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
    const imageBase64 = result.artifacts[0].base64;

    return this.findOneAndUpdate(
        { x, y },
        {
            content: imageBase64,
            isCustomized: false,
            aiPrompt: prompt,
            propertyType,
            color,
            style,
            size,
            material,
            owner
        },
        { new: true, upsert: true }
    );
};

tileSchema.statics.updateTileOwnership = async function (x, y, userId) {
    return this.findOneAndUpdate({ x, y }, { owner: userId }, { new: true, upsert: true });
};

tileSchema.statics.getOwnedTiles = async function (userId) {
    return this.find({ owner: userId }).lean();
};

tileSchema.statics.isSpaceEmpty = async function (x, y) {
    const tile = await this.findOne({ x, y });
    return !tile || tile.content === 'default';
};

const Tile = mongoose.model('Tile', tileSchema);

export default Tile;
