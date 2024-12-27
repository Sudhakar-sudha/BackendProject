
// const FormDataModel = require('../models/formdataModel');
// const detect =require("detect-file-type");
// const formidable = require("formidable");
// const {v1:uuidv1}=require ("uuid")
// const fs =require("fs");

// const path=require("path");


// exports.formdata = async (req, res) => {
//   const form =new formidable.IncomingForm();
//   form.parse(req,(err,fields,files)=>{

// if(err){
//   return res.send("Error in file");
// }
//   // Check if the file is uploaded correctly
//   if (!files.picture) {
//     return res.status(400).json({ error: "No picture file uploaded" });
//   }

//   console.log("Fields:", fields);
//   console.log("Files:", files);

//     console.log(`name:${fields.name}`);
//     console.log(`age:${fields.age}`);
//     console.log(files.picture.name);
//     console.log(files.picture.path);


// detect.fromFile(files.picture.path,(err,result)=>{
//   console.log(result);
//   console.log(result.ext);

//   const pictureName =uuidv1() +"."+result.ext;
//   console.log(pictureName);


//   const allowedImagesTypes =['jpg','jpeg','png']
//   if(!allowedImagesTypes.includes(result.ext)){
//     return res.send("image not allowed ")
//   }

//   const oldpath=files.picture.path;
//   const newpath=path.join(__dirname,"..","..","pictures",pictureName);
//   fs.rename(oldpath,newpath,err =>{
//     if(err){
//       console.log("Cannot move file");
//       return ;
//     }
//     return res.send("done");

//     const formdatas={
//       "name":fields.name,
//       "age":fields.age,
//       "picture":"pictureName",
//     }

//     try{
//       FormDataModel.db.collection("formdatas").inseertOne(formdata,(err,dbResponse)=>{
//         if(err){
//           return res.send("mongo db cannot create");
//         }
//         return res.send("super");
//       })
//     }
//     catch(err){
//         return res.status(500).send("Syster under update");
//     }
//   });
// })

//     res.send("ok");
//   })
//     res.send("uploading image");
//   };
const FormDataModel = require("../models/formdataModel");
const detect = require("detect-file-type");
const formidable = require("formidable");
const { v1: uuidv1 } = require("uuid");
const fs = require("fs");
const path = require("path");

exports.formdata = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).send("Error in file upload");
    }

    // Check if the file is uploaded
    if (!files.picture || !Array.isArray(files.picture) || files.picture.length === 0) {
      return res.status(400).json({ error: "No picture file uploaded" });
    }

    const pictureFile = files.picture[0];

    // Detect file type
    detect.fromFile(pictureFile.filepath, (err, result) => {
      if (err) {
        console.error("Error detecting file type:", err);
        return res.status(500).send("Error detecting file type");
      }

      // Validate file type
      const allowedImageTypes = ["jpg", "jpeg", "png"];
      if (!allowedImageTypes.includes(result.ext)) {
        return res.status(400).send("Image type not allowed");
      }

      // Generate unique file name
      const pictureName = uuidv1() + "." + result.ext;

      // Define target directory and file path
      const targetDirectory = path.join(__dirname, "..", "..", "pictures");
      const targetPath = path.join(targetDirectory, pictureName);

      // Ensure the directory exists
      if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true });
      }

      // Move file to target directory
      fs.rename(pictureFile.filepath, targetPath, (err) => {
        if (err) {
          console.error("Error moving file:", err);
          return res.status(500).send("Cannot move file");
        }

        // Save to database
        const formdata = {
          name: fields.name,
          age: fields.age,
          picture: pictureName,
        };

        FormDataModel.create(formdata, (err, dbResponse) => {
          if (err) {
            console.error("Error inserting into MongoDB:", err);
            return res.status(500).send("MongoDB insert failed");
          }

          console.log("Data inserted into MongoDB:", dbResponse);
          return res.status(200).send("Data saved successfully");
        });
      });
    });
  });
};
