const books = require('../models/bookModel')

// add books
exports.addBookController = async(req,res)=>{
    console.log("Inside addBookController");
    // get book details from req body, upload file from request files & seller mail from req payload 
    const {title,author, pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category} = req.body

    const uploadImages = req.files.map(item=>item.filename)
    const sellerMail = req.payload

    console.log(title,author,pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category,uploadImages,sellerMail);

    try{
        // check book alredy exists
        const existingBook = await books.findOne({title,sellerMail})
        if (existingBook) {
            res.status(401).json("Uploaded book is already exists!!!Request Failed")
        }
        else{
            const newBook = await books.create({
                title,author,pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category,uploadImages,sellerMail
            })
            res.status(200).json(newBook)
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}