const express= require ("express");
const app= express();
const dotenv =require("dotenv");
const path=require("path");
const connectDatabase = require('./config/connectDatabase')

dotenv.config({path:path.join(__dirname,'config','config.env')})

const userdata = require ('./routes/User');
 
connectDatabase();
app.use(express.json());

app.use('/user',userdata);


app.listen(process.env.PORT ,() =>{
console.log(`Server is running   ${process.env.PORT} port  for ${process.env.NODE_ENV}`);
});