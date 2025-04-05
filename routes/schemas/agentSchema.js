const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({ name: String });

const agent = mongoose.model('agent', agentSchema);

module.exports = agent;