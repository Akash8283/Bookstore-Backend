// importing usermodel
const users = require('../models/userModel')
// jsonwebtoken
const jwt = require('jsonwebtoken')
// register api request
exports.registerController = async (req,res)=>{
    console.log("Inside registerController");
    const {username, email, password} = req.body
    console.log(username,email,password);
    try{
        // check mail in model
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(409).json("User Already exist!!! Please Login")
        }
        else{
            const newUser = new users({
                username,email,password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error)
    }
    // res.status(200).json("Request Recieved")

}
// login api request
exports.loginController = async (req,res)=>{
    console.log("Inside loginController");
    const {email,password} = req.body
    console.log(email,password);
    try{
        // check email in model
        const existingUser = await users.findOne({email})
        if (existingUser) {
            if (password == existingUser.password) {
                // generate token
                const token = jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.JWTSECRET)
                res.status(200).json({user:existingUser,token})
            }
            else{
                res.status(401).json("Incorrect Email or Password")
            }
        }
        else{
            res.status(404).json("Account Does not Exists!!!")
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}
// google login
exports.googleLoginController = async (req,res)=>{
    console.log("Inside googleLoginController");
    const {email,password,username,picture} = req.body
    console.log(email,password,username,picture);
    try{
        // check mail
        const existingUser = await users.findOne({email})
        if(existingUser){
            //login
            //generate token
            const token = jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.JWTSECRET)
                res.status(200).json({user:existingUser,token})
        }
        else{
            // auto register
            const newUser = await users.create({
                username,email,password,picture
            })
            const token = jwt.sign({userMail:newUser.email,role:newUser.role},process.env.JWTSECRET)
                res.status(200).json({user:newUser,token})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err)
    }  
}
// user edit profile
// admin edit profile