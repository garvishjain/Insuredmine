const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({ accountName: String });

module.exports = accountSchema;