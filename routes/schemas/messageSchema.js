const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({ message: String, insertAt: Date });

const messages = mongoose.model('messages', messageSchema);

module.exports = messages;