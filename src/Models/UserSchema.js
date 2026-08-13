const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 3,
        required: true
    },
    lastName: {
        type: String,
        minLength:2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Invalid Email!");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Choose correct gender!");
            }
        }
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

module.exports = User