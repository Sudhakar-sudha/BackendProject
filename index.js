// const express= require ("express");
// const cors = require('cors');
// const app= express();
// const dotenv =require("dotenv");
// const path=require("path");
// const connectDatabase = require('./config/connectDatabase')

// dotenv.config({path:path.join(__dirname,'config','config.env')})

// const userdata = require ('./routes/User');
 
// connectDatabase();
// app.use(cors());
// app.use(express.json());

// app.use('/user',userdata);


// app.listen(process.env.PORT ,() =>{
// console.log(`Server is running   ${process.env.PORT} port  for ${process.env.NODE_ENV}`);
// });




// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const cors = require('cors');
// const path = require('path');
// const app = express();

// // Middleware
// app.use(cors()); // Enable Cross-Origin Resource Sharing
// app.use(express.json()); // Parse JSON requests
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// // MongoDB Connection
// mongoose.connect('mongodb+srv://sudhakar:sudhakar@cluster0.odnra1b.mongodb.net/CustomerData?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Define File Schema
// const fileSchema = new mongoose.Schema({
//   originalName: { type: String, required: true },
//   storedName: { type: String, required: true },
//   path: { type: String, required: true },
//   size: { type: Number, required: true },
//   mimeType: { type: String, required: true },
//   uploadDate: { type: Date, default: Date.now },
// });

// // Create File Model
// const File = mongoose.model('File', fileSchema);

// // Set up Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Set the destination folder for uploaded files
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     // Set the uploaded file's name
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
//   fileFilter: (req, file, cb) => {
//     // Only allow image file types
//     const fileTypes = /jpeg|jpg|png/;
//     const mimeType = fileTypes.test(file.mimetype);
//     const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

//     if (mimeType && extName) {
//       return cb(null, true);
//     }
//     cb(new Error('Only .jpeg, .jpg, and .png formats are allowed!'));
//   },
// });

// // Route for uploading files
// app.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded.' });
//     }

//     // Save file metadata to the database
//     const newFile = new File({
//       originalName: req.file.originalname,
//       storedName: req.file.filename,
//       path: `/uploads/${req.file.filename}`,
//       size: req.file.size,
//       mimeType: req.file.mimetype,
//     });

//     const savedFile = await newFile.save();

//     res.status(200).json({
//       message: 'File uploaded and saved successfully!',
//       file: savedFile,
//     });
//   } catch (error) {
//     console.error('Error saving file to database:', error);
//     res.status(500).json({ error: 'Failed to save file to database.' });
//   }
// });

// // Serve static files (for uploaded files)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     // Handle Multer-specific errors
//     return res.status(400).json({ error: err.message });
//   } else if (err) {
//     // Handle general errors
//     return res.status(500).json({ error: err.message });
//   }
//   next();
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });






// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');

const cors = require('cors');

// Initialize app
const app = express();
const PORT = 5000;

app.use(cors());

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://sudhakar:sudhakar@cluster0.odnra1b.mongodb.net/CustomerData?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Database connection error:', err));

// Mongoose Schema and Model
const ImageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String,
  },
});

const ImageModel = mongoose.model('Image', ImageSchema);

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Temporarily store in memory
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'));
    }
  },
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit
});

// Routes
// POST route to upload image
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const newImage = new ImageModel({
      name: req.body.name,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newImage.save();
    res.status(201).json({ message: 'Image uploaded successfully!', image: newImage });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error. Could not upload image.' });
  }
});

// GET route to retrieve images
app.get('/images', async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.status(200).json(images);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Could not fetch images.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
