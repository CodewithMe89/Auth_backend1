const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../Models/UserSchema');
const {validateSignupData} = require('../utility/dataValidaton')
const jwt = require('jsonwebtoken')
const authRouter = express.Router()
const {userAuth} = require('../middlewares/auth')
const validator = require('validator')
const dotenv = require('dotenv');
dotenv.config()
//signup route
authRouter.post('/signup', async (req, res) => {
    try {
        const {firstName, lastName, email, password, gender} = req.body;
        const alreadyUser = await User.findOne({email:email})

        if(alreadyUser){
            throw new Error("User already exists!");
        }

        validateSignupData(req);

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({firstName, lastName, email, password:passwordHash, gender})
        await newUser.save();
        res.status(200).json({message:"User signed up successfully!", newUser})
    } catch (err) {
        res.status(500).json({ err: "Failed to signup",err:err.message })
    }
})

//signin route
authRouter.post('/signin', async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email:email});

        if(!user){
            return res.status(404).json({err:"User not found!"});
        }

        const isPassword = await bcrypt.compare(password, user.password);
        
        if(!isPassword){
            return res.status(404).json({err:"email and password are incorrect!"})
        }

        const token = await jwt.sign({id:user._id},process.env.secretKey)
        //store the generated token in cookie 
        res.cookie("token",token)

        res.status(200).json({message: "User signed In successfully!", user})
    }
    catch(err){
        res.status(500).json({message:"Failed to SignIn",err:err.message})
    }
})

//logout route
authRouter.post('/logout', async (req, res) => {
    res.cookie("token",null),{
        expires:new Date(Date.now())
    }
    res.status(200).json({message:"Logout Done Successfully!"})
})

//fetch profile route
authRouter.get('/profile', async (req, res) => {
    const {token} = req.cookies;
    if(!token){
        throw new Error("User not logged in!")
    }
    //validate the token
    const {id} = await jwt.verify(token,process.env.secretKey)
    const profile = await User.findOne({_id:id});
    if (!profile) {
        return res.status(404).json({ err: "User not Logged in" })
    }
    res.status(200).json({message: "Profile fetched Successfully!", profile})
})

//profile delete route
authRouter.delete('/profile', userAuth, async (req, res) => {
    try {
        const {_id} = req.user;

        const deleteProfile = await User.findByIdAndDelete(_id);

        if (!deleteProfile) {
            return res.status(404).json({ err: "User not found or already deleted!" })
        }
        res.status(200).json({message:"Profile deleted Successfully!",deleteProfile});
    }
    catch (err) {
        res.status(500).json({ err: "Failed to delete profile" })
    }
})

//profile update route 
authRouter.patch('/profile', userAuth, async (req, res) => {
    try {
        const {_id} = req.user
       
        const { firstName, lastName, email, password,gender} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const updatedProfile = await User.findByIdAndUpdate(_id, {
            firstName,
            lastName,
            email,
            password:passwordHash,
            gender
        },{new:true,runValidators:true})

        if(!updatedProfile){
            return res.status(404).json({err:"User not found!"})
        }
        res.status(200).json({message:"Profile Updated Successfully!", updatedProfile})
    }
    catch (err) {
        res.status(500).josn({ err: "failed to update profile!",err:err.message })
    }
})
module.exports = authRouter