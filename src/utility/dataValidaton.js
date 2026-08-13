const validator = require('validator');

const validateSignupData = (data) => {
const {firstName, lastName, email, password, gender} = data.body;

if(!firstName || !firstName.length>=3){
    throw new Error ("Name is not valid or missed!");
}
else if(!validator.isEmail(email)){
    throw new Error ("Email is not valid or missed!")
}
}

module.exports = {validateSignupData}