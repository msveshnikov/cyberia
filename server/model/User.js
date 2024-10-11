import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    ownedTiles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tile'
        }
    ],
    achievements: [
        {
            type: String,
            enum: ['first_property', 'ten_properties', 'master']
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    balance: {
        type: Number,
        default: 0
    },
    premium: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        type: String,
        default: ''
    },
    customizationLevel: {
        type: Number,
        default: 0
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    },
    preferences: {
        notifications: {
            type: Boolean,
            default: true
        },
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        }
    },
    socialLinks: {
        twitter: String,
        discord: String
    },
    gameStats: {
        propertiesCreated: { type: Number, default: 0 },
        totalVisitors: { type: Number, default: 0 },
        timeSpent: { type: Number, default: 0 }
    },
    inventory: [
        {
            itemType: String,
            quantity: Number
        }
    ],
    questProgress: [
        {
            questId: String,
            progress: Number,
            completed: Boolean
        }
    ]
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateLastLogin = function () {
    this.lastLogin = Date.now();
    return this.save();
};

userSchema.methods.addOwnedTile = function (tileId) {
    if (!this.ownedTiles.includes(tileId)) {
        this.ownedTiles.push(tileId);
    }
    return this.save();
};

userSchema.methods.removeOwnedTile = function (tileId) {
    this.ownedTiles = this.ownedTiles.filter((id) => !id.equals(tileId));
    return this.save();
};

userSchema.methods.addAchievement = function (achievement) {
    if (!this.achievements.includes(achievement)) {
        this.achievements.push(achievement);
    }
    return this.save();
};

userSchema.methods.addFriend = function (friendId) {
    if (!this.friends.includes(friendId)) {
        this.friends.push(friendId);
    }
    return this.save();
};

userSchema.methods.removeFriend = function (friendId) {
    this.friends = this.friends.filter((id) => !id.equals(friendId));
    return this.save();
};

userSchema.methods.updateBalance = function (amount) {
    this.balance += amount;
    return this.save();
};

userSchema.methods.setPremiumStatus = function (status) {
    this.premium = status;
    return this.save();
};

userSchema.methods.setProfilePicture = function (pictureUrl) {
    this.profilePicture = pictureUrl;
    return this.save();
};

userSchema.methods.incrementCustomizationLevel = function () {
    this.customizationLevel += 1;
    return this.save();
};

userSchema.methods.updateLastActive = function () {
    this.lastActiveAt = Date.now();
    return this.save();
};

userSchema.methods.setPreferences = function (preferences) {
    this.preferences = { ...this.preferences, ...preferences };
    return this.save();
};

userSchema.methods.setSocialLinks = function (links) {
    this.socialLinks = { ...this.socialLinks, ...links };
    return this.save();
};

userSchema.methods.updateGameStats = function (stats) {
    this.gameStats = { ...this.gameStats, ...stats };
    return this.save();
};

userSchema.methods.addToInventory = function (itemType, quantity) {
    const existingItem = this.inventory.find((item) => item.itemType === itemType);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        this.inventory.push({ itemType, quantity });
    }
    return this.save();
};

userSchema.methods.updateQuestProgress = function (questId, progress, completed) {
    const existingQuest = this.questProgress.find((quest) => quest.questId === questId);
    if (existingQuest) {
        existingQuest.progress = progress;
        existingQuest.completed = completed;
    } else {
        this.questProgress.push({ questId, progress, completed });
    }
    return this.save();
};

userSchema.statics.findActiveUsers = function (threshold) {
    const thresholdDate = new Date(Date.now() - threshold);
    return this.find({ lastActiveAt: { $gte: thresholdDate } });
};

userSchema.statics.findPremiumUsers = function () {
    return this.find({ premium: true });
};

userSchema.statics.findTopPropertyOwners = function (limit = 10) {
    return this.aggregate([
        { $project: { email: 1, ownedTilesCount: { $size: '$ownedTiles' } } },
        { $sort: { ownedTilesCount: -1 } },
        { $limit: limit }
    ]);
};

const User = mongoose.model('User', userSchema);

export default User;
