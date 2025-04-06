const mongoose = require('mongoose');
const SheetData = require('./sheetdatamodel'); // Import the SheetData model

const roomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    roomName: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
});

// Middleware to delete associated sheet data when a room is deleted
roomSchema.pre('findOneAndDelete', async function(next) {
    const room = await this.model.findOne(this.getQuery());
    if (room) {
        await SheetData.deleteOne({ roomId: room.roomId });
    }
    next();
});

module.exports = mongoose.model('Room', roomSchema);
