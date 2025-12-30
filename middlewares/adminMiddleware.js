const jwt = require('jsonwebtoken')

const adminMiddleware = (req,res,next)=>{
    console.log("Inside adminMiddleware");
    // logic to verify token
    // get token - req header
    const token = req.headers['authorization'].split(" ")[1]
    // verify token
    if (token) {
        try{
        const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
        req.role = jwtResponse.role
        if (jwtResponse.role == "admin") {
            next()
        }
        else{
            res.status(401).json("Authorization failed! Invalid User")
        }
    }
    catch(err){
        res.status(401).json("Authorization failed! Invalid token")
    }
    }
    else{
        res.status(401).json("Authorization failed! Token Missing")
    }
}

module.exports = adminMiddleware