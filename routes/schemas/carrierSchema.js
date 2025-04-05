const mongoose = require('mongoose');

const carrierSchema = new mongoose.Schema({ company_name: String });

const company = mongoose.model('companies', carrierSchema);

module.exports = company;