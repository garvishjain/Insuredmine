const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  DOB: Date,
  address: String,
  phoneNumber: String,
  state: String,
  zipCode: String,
  email: String,
  gender: String,
  userType: String,
  agentId: mongoose.Schema.Types.ObjectId,
});

const user = mongoose.model('users', userSchema);

module.exports = user;