const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: String,
    scheduledAt: Date,
    inserted: { type: Boolean, default: false }}
);

const messages = mongoose.model('messages', messageSchema);

module.exports = messages;