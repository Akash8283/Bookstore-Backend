// import express
const express = require('express')
const userController = require('../controller/userController')
const bookController = require('../controller/bookController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerMiddleware = require("../middlewares/multerMiddleware")
// create router object
const router = new express.Router()

// define path for client api request
// register
router.post('/register',userController.registerController)

// login
router.post('/login',userController.loginController)

// google login
router.post('/google/sign-in',userController.googleLoginController)

// get home books
router.get('/books/home',bookController.getHomePageBooksController)

// ---------authorized user---------

// add book - request body content is formdata
router.post('/user/book/add',jwtMiddleware,multerMiddleware.array('uploadImages',3),bookController.addBookController)

// get all books page - 
router.get('/books/all',jwtMiddleware,bookController.getUserAllBooksPageController)

// get alluser  upload books page - 
router.get('/user-books/all',jwtMiddleware,bookController.getUserUploadBookProfilePageController)

// get alluser  upload books page - 
router.get('/user-books/bought',jwtMiddleware,bookController.getUserBoughtBookProfilePageController)

// get one book
router.get('/books/:id/view',jwtMiddleware,bookController.getOneBookDetailController)

// user edit
router.put('/user/:id/edit',jwtMiddleware,multerMiddleware.single('picture'),userController.updateUserProfileController) 


module.exports = router