const mongoose = require('mongoose');

const formdataSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const FormDataModel = mongoose.model('FormData', formdataSchema);
module.exports = FormDataModel;
