

const UserDataModel = require('../models/userdataModel');
const TokenModel = require('../models/tokenModel');
const transporter = require('../utils/emailTransporter');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.postsignup = async (req, res, next) => {
  let { username, email, password } = req.body;
  username = username.trim();
  email = email.trim();
  password = password.trim();

  if (username === "" || email === "" || password === "") {
    return res.json({ status: "Failed", message: "Empty input fields!" });
  }
  
  if (!/^[a-zA-Z]*$/.test(username)) {
    return res.json({ status: "Failed", message: "Invalid Name" });
  }
  
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.json({ status: "Failed", message: "Invalid Email" });
  }
  
  if (password.length < 8) {
    return res.json({ status: "Failed", message: "Password is too short" });
  }

  try {
    const existingUser = await UserDataModel.findOne({ email });
    if (existingUser) {
      return res.json({ status: "Failed", message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserDataModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = crypto.randomBytes(32).toString('hex');
    await TokenModel.create({ userId: newUser._id, token });

    const verificationUrl = `http://localhost:${process.env.PORT}/user/verify/${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Email Verification",
      html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">Verify Email</a>`,
    });

    res.json({ status: "Success", message: "Signup successful! Check your email for verification." });
  } catch (err) {
    console.error(err);
    res.json({ status: "Failed", message: "An error occurred during signup." });
  }
};







exports.postsignin = async (req, res, next) => {
    let{ email , password } = req.body;
    email=email.trim();
    password=password.trim();
    if(email=="" || password==""){
        res.json({
            status:"Failed",
            message:"Empty input fields!"
        });
    }else {
        UserDataModel.find({email})
        .then(data =>{
            if(data.length){

                const hashedPassword=data[0].password;
                bcrypt.compare(password,hashedPassword).then(result =>{
                    if(result){
                        res.json({
                            status: "Success",
                            message:"Sigin Successfully",
                            data:data
                        })
                    }else{
                        res.json({
                            status:"Failed",
                            message:"Invalid password"
                        })
                    }
                }).catch(err=>{
                    res.json({
                        status:"FAiled",
                        message:"An error occured"
                    })
                })
            }else{
                res.json(
                    {
                        status:"FAiled",
                        message:"Invalid credentials entered"
                    }
                )
            }
        })
        .catch(err=>{
            res.json({
                status:"FAiled",
                message:"An error occured"
            })
        })
    }
};





exports.resendVerification = async (req, res, next) => {
    const { email } = req.body;
    try {
      const user = await UserDataModel.findOne({ email });
      if (!user) {
        return res.json({ status: "Failed", message: "User not found." });
      }
      if (user.isVerified) {
        return res.json({ status: "Failed", message: "Email already verified." });
      }
  
      const token = crypto.randomBytes(32).toString('hex');
      await TokenModel.create({ userId: user._id, token });
  
      const verificationUrl = `http://localhost:${process.env.PORT}/user/verify/${token}`;
      await transporter.sendMail({
        to: email,
        subject: "Resend Email Verification",
        html: `<p>Click the link below to verify your email:</p><a href="${verificationUrl}">Verify Email</a>`,
      });
  
      res.json({ status: "Success", message: "Verification email resent." });
    } catch (err) {
      console.error(err);
      res.json({ status: "Failed", message: "An error occurred while resending verification email." });
    }
  };

  


  exports.verifyEmail = async (req, res, next) => {
    try {
      const { token } = req.params;
      const tokenData = await TokenModel.findOne({ token });
      if (!tokenData) {
        return res.json({ status: "Failed", message: "Invalid or expired token." });
      }
  
      const user = await UserDataModel.findById(tokenData.userId);
      if (!user) {
        return res.json({ status: "Failed", message: "User not found." });
      }
  
      user.isVerified = true;
      await user.save();
      await TokenModel.findByIdAndDelete(tokenData._id);
      
      res.json({ status: "Success", message: "Email verified successfully!" });
    } catch (err) {
      console.error(err);
      res.json({ status: "Failed", message: "An error occurred during verification." });
    }
  };
  