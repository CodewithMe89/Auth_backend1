const userAuth = (req,res,next) => {
    const token = "xyzj"
    const isAuthenticated = token === "xyz"
    if(isAuthenticated){
        next()
    }
    else{
        res.status(500).send("Unauthorized Access")
    }
}

module.exports = {userAuth }