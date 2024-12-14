

const mongoose = require('mongoose');

const userdataSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const UserDataModel = mongoose.model('UserData', userdataSchema);
module.exports = UserDataModel;  