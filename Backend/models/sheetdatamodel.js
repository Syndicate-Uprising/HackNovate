const mongoose = require('mongoose');

const sheetDataSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SheetData = mongoose.model('SheetData', sheetDataSchema);

module.exports = SheetData;
