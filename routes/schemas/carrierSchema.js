const mongoose = require('mongoose');

const carrierSchema = new mongoose.Schema({ companyName: String });

const company = mongoose.model('companies', carrierSchema);

module.exports = company;