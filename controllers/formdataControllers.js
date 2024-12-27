
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


// const formidable = require("formidable"); // Ensure this line is present at the top of the file
// const fs = require("fs");
// const path = require("path");
// const FormDataModel = require("../models/formdataModel");
// const detect = require("detect-file-type");
// const { v1: uuidv1 } = require("uuid");

// exports.formdata = async (req, res) => {
//   const form = new formidable.IncomingForm();

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       console.error("Error parsing form:", err);
//       return res.status(500).send("Error in file upload");
//     }

//     console.log("Fields received:", fields); // Debug: Log name and age
//     console.log("Files received:", files); // Debug: Log file info

//     // Extract and sanitize fields
//     const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
//     const age = Array.isArray(fields.age) ? parseInt(fields.age[0], 10) : parseInt(fields.age, 10);

//     // Validate extracted fields
//     if (!name || isNaN(age)) {
//       return res.status(400).json({ error: "Invalid name or age" });
//     }

//     // Check if the file is uploaded
//     if (!files.picture || !Array.isArray(files.picture) || files.picture.length === 0) {
//       return res.status(400).json({ error: "No picture file uploaded" });
//     }

//     const pictureFile = files.picture[0];

//     // Detect file type
//     detect.fromFile(pictureFile.filepath, async (err, result) => {
//       if (err) {
//         console.error("Error detecting file type:", err);
//         return res.status(500).send("Error detecting file type");
//       }

//       console.log("File detected:", { name: pictureFile.originalFilename, path: pictureFile.filepath, ext: result.ext }); // Debug: Log file path and extension

//       // Validate file type
//       const allowedImageTypes = ["jpg", "jpeg", "png"];
//       if (!allowedImageTypes.includes(result.ext)) {
//         return res.status(400).send("Image type not allowed");
//       }

//       // Generate unique file name
//       const pictureName = uuidv1() + "." + result.ext;

//       // Define target directory and file path
//       const targetDirectory = path.join(__dirname, "..", "..", "pictures");
//       const targetPath = path.join(targetDirectory, pictureName);

//       // Ensure the directory exists
//       if (!fs.existsSync(targetDirectory)) {
//         fs.mkdirSync(targetDirectory, { recursive: true });
//       }

//       // Copy file to target directory and delete source
//       fs.copyFile(pictureFile.filepath, targetPath, async (err) => {
//         if (err) {
//           console.error("Error copying file:", err);
//           return res.status(500).send("Cannot copy file");
//         }

//         // Delete the source file
//         fs.unlink(pictureFile.filepath, (unlinkErr) => {
//           if (unlinkErr) {
//             console.error("Error deleting temp file:", unlinkErr);
//           }
//         });

//         // Save to database
//         const formdata = {
//           name,
//           age,
//           picture: pictureName,
//         };

//         try {
//           const dbResponse = await FormDataModel.create(formdata); // Use promise-based API
//           console.log("Data inserted into MongoDB:", dbResponse); // Debug: Log database response
//           return res.status(200).send("Data saved successfully");
//         } catch (dbError) {
//           console.error("Error inserting into MongoDB:", dbError);
//           return res.status(500).send("MongoDB insert failed");
//         }
//       });
//     });
//   });
// };



// exports.getFormData = async (req, res) => {
//   try {
//     const formData = await FormDataModel.find(); // Fetch all data
//     res.status(200).json(formData);
//   } catch (err) {
//     console.error("Error fetching form data:", err);
//     res.status(500).send("Error fetching form data");
//   }
// };




const formidable = require("formidable"); // Ensure this line is present at the top of the file
const fs = require("fs");
const path = require("path");
const FormDataModel = require("../models/formdataModel");
const detect = require("detect-file-type");
const { v1: uuidv1 } = require("uuid");

exports.formdata = async (req, res) => {
  const form = new formidable.IncomingForm();

  // Parse the incoming form
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).send("Error in file upload");
    }

    console.log("Fields received:", fields); // Log the fields received
    console.log("Files received:", files); // Log the file info

    // Extract and sanitize fields
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const age = Array.isArray(fields.age) ? parseInt(fields.age[0], 10) : parseInt(fields.age, 10);

    // Validate extracted fields
    if (!name || isNaN(age)) {
      return res.status(400).json({ error: "Invalid name or age" });
    }

    // Check if a picture file is uploaded
    if (!files.picture || !Array.isArray(files.picture) || files.picture.length === 0) {
      return res.status(400).json({ error: "No picture file uploaded" });
    }

    const pictureFile = files.picture[0]; // Assuming the file is an array, take the first file

    // Detect file type (jpg, jpeg, png)
    detect.fromFile(pictureFile.filepath, async (err, result) => {
      if (err) {
        console.error("Error detecting file type:", err);
        return res.status(500).send("Error detecting file type");
      }

      console.log("File detected:", { name: pictureFile.originalFilename, path: pictureFile.filepath, ext: result.ext });

      // Validate file type
      const allowedImageTypes = ["jpg", "jpeg", "png"];
      if (!allowedImageTypes.includes(result.ext)) {
        return res.status(400).send("Image type not allowed");
      }

      // Generate a unique file name
      const pictureName = uuidv1() + "." + result.ext;

      // Define the target directory and file path
      const targetDirectory = path.join(__dirname, "..", "pictures");
      const targetPath = path.join(targetDirectory, pictureName);

      // Ensure the directory exists
      try {
        if (!fs.existsSync(targetDirectory)) {
          fs.mkdirSync(targetDirectory, { recursive: true });
          console.log("Target directory created:", targetDirectory);
        }
      } catch (dirErr) {
        console.error("Error creating directory:", dirErr);
        return res.status(500).send("Error creating target directory");
      }

      // Copy the file to the target directory
      fs.copyFile(pictureFile.filepath, targetPath, async (err) => {
        if (err) {
          console.error("Error copying file:", err);
          return res.status(500).send("Cannot copy file");
        }

        console.log("File copied to:", targetPath);

        // Delete the temporary file after copying
        fs.unlink(pictureFile.filepath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting temp file:", unlinkErr);
          }
        });

        // Save form data to MongoDB with picture name
        const formdata = {
          name,
          age,
          picture: pictureName, // Store only the file name
        };

        try {
          const dbResponse = await FormDataModel.create(formdata); // Save to database
          console.log("Data inserted into MongoDB:", dbResponse);
          return res.status(200).send("Data saved successfully");
        } catch (dbError) {
          console.error("Error inserting into MongoDB:", dbError);
          return res.status(500).send("MongoDB insert failed");
        }
      });
    });
  });
};


exports.getFormData = async (req, res) => {
  try {
    const formData = await FormDataModel.find(); // Fetch all data
    console.log(formData); // This will log the data with the image names
    res.status(200).json(formData); // Send the data back to the frontend
  } catch (err) {
    console.error("Error fetching form data:", err);
    res.status(500).send("Error fetching form data");
  }
};

