const mongoose = require('mongoose');

const lobSchema = new mongoose.Schema({ categoryName: String });

const catagory = mongoose.model('catagories', lobSchema);

module.exports = catagory;