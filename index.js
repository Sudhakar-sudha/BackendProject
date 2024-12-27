const express= require ("express");
const cors = require('cors');
const app= express();
const dotenv =require("dotenv");
const path=require("path");
const connectDatabase = require('./config/connectDatabase')

dotenv.config({path:path.join(__dirname,'config','config.env')})

const userdata = require ('./routes/User');
const formdata = require ('./routes/FormData')
connectDatabase();

// Serve images from the 'pictures' folder
app.use('/pictures', express.static(path.join(__dirname, 'pictures')));
app.use(cors());
app.use(express.json());

app.use('/user',userdata);
app.use('/formdata', formdata);

app.listen(process.env.PORT ,() =>{
console.log(`Server is running   ${process.env.PORT} port  for ${process.env.NODE_ENV}`);
});


