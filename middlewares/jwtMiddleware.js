const jwt = require('jsonwebtoken')

const jwtMiddleware = (req,res,next)=>{
    console.log("Inside jwtmiddleware");
    // logic to verify token
    // get token - req header
    const token = req.headers['authorization'].split(" ")[1]
    // verify token
    if (token) {
        try{
        const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
        next()
    }
    catch(err){
        res.status(401).json("Authorization failed! Invalid token")
    }
    }
    else{
        res.status(401).json("Authorization failed! Token Missing")
    }
}

module.exports = jwtMiddleware