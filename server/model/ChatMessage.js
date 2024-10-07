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
        required: true
    },
    isSystemMessage: {
        type: Boolean,
        default: false
    }
});

chatMessageSchema.index({ room: 1, timestamp: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;