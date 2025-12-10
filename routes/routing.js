// import express
const express = require('express')
const userController = require('../controller/userController')
// create router object
const router = new express.Router()

// define path for client api request
// register
router.post('/register',userController.registerController)

// login
router.post('/login',userController.loginController)

// google login
router.post('/google/sign-in',userController.googleLoginController)

module.exports = router