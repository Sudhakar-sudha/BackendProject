const mongoose = require('mongoose');

// Define the schema
const formdataSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name as a required string
  age: { type: Number, required: true }, // Age as a required number
  picture: { type: String, required: true } // Picture filename or URL as a required string
});

// Create the model
const FormDataModel = mongoose.model('FormData', formdataSchema);

module.exports = FormDataModel;
