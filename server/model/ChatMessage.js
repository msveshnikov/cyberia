import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    room: {
        type: String,
        required: true,
        default: 'global'
    },
    isSystemMessage: {
        type: Boolean,
        default: false
    }
});

chatMessageSchema.index({ room: 1, timestamp: -1 });

chatMessageSchema.statics.getMessagesForRoom = async function (room, limit = 50) {
    return this.find({ room })
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('sender', 'email profilePicture')
        .lean();
};

chatMessageSchema.statics.addMessageToRoom = async function (senderId, content, room) {
    const message = new this({
        sender: senderId,
        content,
        room
    });
    await message.save();
    return message.populate('sender', 'email profilePicture');
};

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
