require('dotenv').config();
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register controller
const registerUser = async(req,res) => {
  try{
    
    //extract user information from our request body
    const { username, email, password , role } = req.body;

    //check if the user already exists in the database
    const checkExistingUser = await User.findOne({$or : [ {username},{email} ]})

    if(checkExistingUser) {
      return res.status(400).json({
        success: false,
        message : 'User is already exists either with same username or same email. Please try with a different username or email',
      })
    }

    //hash user password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save in your database

    const newlyCreatedUser = await User.create({
      username,
      email,
      password : hashedPassword,
      role : role || 'user'
    });

    if(newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message : 'User registered successfully',
      })
    } else {
      res.status(400).json({
        success: false,
        message : 'Unable to register user. Please try again.',
      })
    }


  }catch(err){
    console.log(err);
    res.status(500).json({
      success: false,
      message : 'Something error occured! Please try again'
    })
  }
}


//login controller

const loginUser = async (req,res) => {
  try{
    const {username, password} = req.body;


    //find if the current user is exist in the database or not
    const user = await User.findOne({username});
    if(!user) {
      return res.status(400).json({
        success : false,
        message : `User doesn't exists`
      })
    }

    //if the password is correct or not
    const isPasswordMatch = await bcrypt.compare(password , user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success : false,
        message : 'Password is incorrect'
      })
    }


    //create user token
    const accessToken  = jwt.sign({
      userId : user._id,
      username : user.username,
      role : user.role
    }, process.env.JWT_SECRECT_KEY , {expiresIn : '30m'} )


    res.status(201).json({
      success: true,
      message : 'Logged in successfull',
      accessToken
    })
0


  }catch(err){
    console.log(err);
    res.status(500).json({
      success: false,
      message : 'Something error occured! Please try again'
    })
  }
};


const changePassword = async(req, res) => {

  try{

    const userId = req.userInfo.userId;

    //extract old and new password;
    const {oldPassword , newPassword } = req.body;

    //find the current logged in user
    const user = await User.findById(userId);

    if(!user) {
      return res.status(400).json({
        success : false,
        message : 'User not found'
      })
    }

    //if the old password is correct
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success : false,
        message : 'Old Password is not correct. Please try again'
      })
    }

    //hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update the password
    user.password = newHashedPassword
    await user.save();

    res.status(200).json({
      success : true,
      message : 'Password changed successfully'
    })

  }catch(err){
    console.log(err);
    res.status(500).json({
      success:false,
      message : 'Something went wrong! Please try again.'
    })
  }
}


module.exports = {
  registerUser, loginUser, changePassword
}