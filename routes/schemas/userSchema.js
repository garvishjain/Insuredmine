const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  dob: String,
  address: String,
  phone: String,
  state: String,
  city: String,
  zip: String,
  email: String,
  gender: String,
  userType: String,
  agentId: mongoose.Schema.Types.ObjectId,
});

const user = mongoose.model('users', userSchema);

module.exports = user;