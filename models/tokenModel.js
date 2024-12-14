const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserData' },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Token expires after 1 hour
});

const TokenModel = mongoose.model('Token', tokenSchema);
module.exports = TokenModel;
