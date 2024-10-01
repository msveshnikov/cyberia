/* eslint-disable react-hooks/rules-of-hooks */
/* global use, db */
// Select the database to use.
use('isocraft');
db.users.dropIndex('username_1');

// Create collections
db.createCollection('users');
db.createCollection('tiles');

// Insert sample users
db.users.insertMany([
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Insert sample tiles
db.tiles.insertMany([
    {
        x: 0,
        y: 0,
        owner: 'john_doe',
        imageUrl: 'https://example.com/tile1.png',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        x: 1,
        y: 0,
        owner: 'jane_smith',
        imageUrl: 'https://example.com/tile2.png',
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Create indexes
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.tiles.createIndex({ x: 1, y: 1 }, { unique: true });
db.tiles.createIndex({ owner: 1 });

// Sample queries

// Find all tiles owned by a specific user
db.tiles.find({ owner: 'john_doe' }).toArray();

// Find a tile at a specific coordinate
db.tiles.findOne({ x: 0, y: 0 });

// Update a tile's image
db.tiles.updateOne(
    { x: 0, y: 0 },
    { $set: { imageUrl: 'https://example.com/updated_tile1.png', updatedAt: new Date() } }
);

// Find all empty tiles within a range
db.tiles
    .find({
        x: { $gte: -10, $lte: 10 },
        y: { $gte: -10, $lte: 10 },
        owner: { $exists: false }
    })
    .toArray();

// Add a new tile
db.tiles.insertOne({
    x: 2,
    y: 0,
    owner: 'john_doe',
    imageUrl: 'https://example.com/new_tile.png',
    createdAt: new Date(),
    updatedAt: new Date()
});

// Remove a tile
db.tiles.deleteOne({ x: 2, y: 0 });

// Get user profile
db.users.findOne({ username: 'john_doe' }, { password: 0 });

// Update user profile
db.users.updateOne(
    { username: 'john_doe' },
    { $set: { email: 'john.new@example.com', updatedAt: new Date() } }
);

// Get tiles in viewport
db.tiles
    .find({
        x: { $gte: -5, $lte: 5 },
        y: { $gte: -5, $lte: 5 }
    })
    .toArray();

// Count total tiles
db.tiles.countDocuments();

// Get users with the most tiles
db.tiles
    .aggregate([
        { $group: { _id: '$owner', tileCount: { $sum: 1 } } },
        { $sort: { tileCount: -1 } },
        { $limit: 10 }
    ])
    .toArray();

// Find adjacent tiles
const adjacentTiles = (x, y) =>
    db.tiles
        .find({
            $or: [
                { x: x - 1, y: y },
                { x: x + 1, y: y },
                { x: x, y: y - 1 },
                { x: x, y: y + 1 }
            ]
        })
        .toArray();

adjacentTiles(0, 0);

// Check if a tile placement is valid (adjacent to existing tile or at origin)
const isValidTilePlacement = (x, y) => {
    if (x === 0 && y === 0) return true;
    return (
        db.tiles.countDocuments({
            $or: [
                { x: x - 1, y: y },
                { x: x + 1, y: y },
                { x: x, y: y - 1 },
                { x: x, y: y + 1 }
            ]
        }) > 0
    );
};

isValidTilePlacement(1, 0);

// Get tiles created in the last 24 hours
db.tiles
    .find({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    .toArray();
