
const FormDataModel = require('../models/formdataModel');
const detect =require("detect-file-type");
const formidable = require("formidable");
const {v1:uuidv1}=require ("uuid")


exports.formdata = async (req, res) => {
  const form =new formidable.IncomingForm();
  form.parse(req,(err,fields,files)=>{

if(err){
  return res.send("Error in file");
}
  // Check if the file is uploaded correctly
  if (!files.picture) {
    return res.status(400).json({ error: "No picture file uploaded" });
  }

  console.log("Fields:", fields);
  console.log("Files:", files);

    console.log(`name:${fields.name}`);
    console.log(`age:${fields.age}`);
    console.log(files.picture.name);
    console.log(files.picture.path);


detect.fromFile(files.picture.path,(err,result)=>{
  console.log(result);
  console.log(result.ext);

  const pictureName =uuidv1() +"."+result.ext;
  
})

    res.send("ok");
  })
    res.send("uploading image");
  };
  