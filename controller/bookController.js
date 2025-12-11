const books = require('../models/bookModel')

// add books
exports.addBookController = async(req,res)=>{
    console.log("Inside addBookController");
    // get book details from req body
    console.log(req.body);
    
    // const {title,author, pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category,uploadImage} = req.body

    // console.log(title,author, pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category,uploadImage);

    res.status(200).json("add book request recieved")
    
}