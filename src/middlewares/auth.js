const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const User = require('../Models/UserSchema')

dotenv.config()

const userAuth = async (req, res, next) => {
    try {
        //Read a token from cookie
        const { token } = req.cookies;

        //validate the token with logged user 
        const { id } = await jwt.verify(token, process.env.secretKey);
        
        //Find logged-in User
        const userData = await User.findOne({ _id: id })

        if (!userData) {
            return res.status(404).json({ err: "User not found!" })
        }

        //Attach user to request
        req.user = userData;
        next()
    }
    catch (err) {
        res.status(500).json({ err: "User not authenticated", error: err.message })
    }
}

module.exports = { userAuth }