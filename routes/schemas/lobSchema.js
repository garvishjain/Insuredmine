const mongoose = require('mongoose');

const lobSchema = new mongoose.Schema({ category_name: String });

const catagory = mongoose.model('catagories', lobSchema);

module.exports = catagory;