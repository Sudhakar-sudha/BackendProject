
const FormDataModel = require('../models/formdataModel');
const formidable = require("formidable");
exports.formdata = async (req, res) => {
  const form =new formidable.IncomingForm();
  form.parse(req,(err,fields,files)=>{
    console.log(`name:${fields.name}`);
    console.log(`age:${fields.age}`);
  })
    res.send("uploading image");
  };
  