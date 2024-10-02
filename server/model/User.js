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
        required: true,
        minlength: 6
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
            enum: ['first_property', 'ten_properties', 'customization_master']
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
    }
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

const User = mongoose.model('User', userSchema);

export default User;
