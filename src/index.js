const connectDB = require('./database/connectDB')
const dotenv = require('dotenv')

dotenv.config()
connectDB()

//express server 
const express = require("express");
const app = express();
const port = 3000;
const { userAuth } = require('./middlewares/auth')
const User = require('./Models/UserSchema')
const validator = require('validator')
const {validateSignupData} = require('./utility/dataValidaton')
const bcrypt = require('bcrypt')

app.use(express.json());

//signup route
app.post('/signup', async (req, res) => {
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

app.post('/signin', async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email:email});

        if(!user){
            return res.status(404).json({err:"User not found!"});
        }

        const isPassword = await bcrypt.compare(password, user.password);
        console.log(isPassword)
        if(!isPassword){
            return res.status(404).json({err:"email and password are incorrect!"})
        }

        res.status(200).json({message: "User signed In successfully!", user})
    }
    catch(err){
        res.status(500).json({message:"Failed to SignIn",err:err.message})
    }
})
//fetch profile route
app.get('/profile', async (req, res) => {
    const { email } = req.body;
    const profile = await User.findOne({ email: email });
    if (!profile) {
        return res.status(404).json({ err: "User not found" })
    }
    res.send(profile)
})

//profile delete route
app.delete('/profile/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleteProfile = await User.findByIdAndDelete(id);
        if (!deleteProfile) {
            return res.status(404).json({ err: "User not found or already deleted!" })
        }
        res.status(200)({message:"Profile deleted Successfully!",deleteProfile});
    }
    catch (err) {
        res.status(500).json({ err: "Failed to delete profile" })
    }
})

//profile update route 
app.patch('/profile', async (req, res) => {
    try {
        const { firstName, lastName, email, password,_id } = req.body;

        const updatedProfile = await User.findByIdAndUpdate(_id, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        },{runValidators:true})

        if(!updatedProfile){
            return res.status(404).json({err:"User not found!"})
        }
        res.status(200).json({message:"Profile Updated Successfully!", updatedProfile})
    }
    catch (err) {
        res.status(500).josn({ err: "failed to update profile!",err:err.message })
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})