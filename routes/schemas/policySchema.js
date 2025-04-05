const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  policy_number: String,
  premium_amount_written: String,
  premium_amount: String,
  policy_type: String,
  policy_mode: Number,
  producer: String,
  csr: String,
  policy_start_date: Date,
  policy_end_date: Date,
  policyCategoryId: mongoose.Schema.Types.ObjectId,
  companyId: mongoose.Schema.Types.ObjectId,
  accountId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
});

const policy = mongoose.model('policy', policySchema);

module.exports = policy;