const mongoose = require('mongoose');

const userAccountSchema = new mongoose.Schema({
  account_name: String,
  account_type: String,
  primary: String,
  userId: mongoose.Schema.Types.ObjectId,
});

const userAccount = mongoose.model('useraccount', userAccountSchema);

module.exports = userAccount;