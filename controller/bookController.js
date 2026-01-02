const books = require('../models/bookModel')
const stripe = require('stripe')(process.env.STRIPESECRET);
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

// get home books - guest user
exports.getHomePageBooksController = async (req,res)=>{
    console.log("Inside getHomePageBooksController");
    try{
        // get newly added 4 books from db
        const homeBooks = await books.find().sort({_id:-1}).limit(4)
        res.status(200).json(homeBooks)

    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
    
}

// get all books - user : login user
exports.getUserAllBooksPageController = async (req,res)=>{
    console.log("getUserAllBooksPageController");
    // get query from request
    const searchKey = req.query.search
    console.log(searchKey);
    // get login user mail from token
    const loginUserMail = req.payload
    try{
        // get all books from db except logged in user
        const allBooks = await books.find({sellerMail:{$ne:loginUserMail},title:{$regex:searchKey,$options:'i'}})
        res.status(200).json(allBooks)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
    
}

// get all user uploaded books
exports.getUserUploadBookProfilePageController = async (req,res)=>{
    console.log("getUserAllBooksPageController");
    // get login user mail from token
    const loginUserMail = req.payload
    try{
        // get all user uploaded books from db 
        const allUserBooks = await books.find({sellerMail:loginUserMail})
        res.status(200).json(allUserBooks)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
    
}

// get all user bought books
exports.getUserBoughtBookProfilePageController = async (req,res)=>{
    console.log("getUserAllBooksPageController");
    // get login user mail from token
    const loginUserMail = req.payload
    try{
        // get all user purchsed books from db 
        const allUserPurchaseBooks = await books.find({buyerMail:loginUserMail})
        res.status(200).json(allUserPurchaseBooks)         
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
    
}

// get one book details
exports.getOneBookDetailController = async (req,res)=>{
    // get id from request
    const {id} = req.params 
    try{
        const book = await books.findById({_id:id})
        res.status(200).json(book)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

// get all books - admin : login user
exports.getAllBooksController = async (req,res)=>{
    console.log("inside getAllBooksController");
    try{
        // get all books
        const allBooks = await books.find()
        res.status(200).json(allBooks)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

// update book status - admin : login user
exports.updateBookStatusController = async(req,res)=>{
    console.log("Inside updateBookStatusController");
    // get _id of book
    const {id} = req.params
    try{
        const bookDetails = await books.findById({_id:id})
        bookDetails.status = "approved"
        // save changes to mongoBD
        await bookDetails.save()
        res.status(200).json(bookDetails)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

// delete user book - user
exports.deleteBookController = async(req,res)=>{
    console.log("Inside deleteBookController");
    // get _id of book
    const {id} = req.params
    try{
        const bookDetails = await books.findByIdAndDelete({_id:id})
        res.status(200).json(bookDetails)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

// payement
exports.bookPaymentController = async(req,res)=>{
    console.log("bookPaymentController");
    // const {title,author, pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category,_id,uploadImages,sellerMail} = req.body
    const email = req.payload
    const {id} = req.params
    try{
        const bookDetails = await books.findById({_id:id})
        bookDetails.status = "sold"
        bookDetails.buyerMail = email
        await bookDetails.save()
        const {title,author, pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category,_id,uploadImages,sellerMail} = bookDetails
    //    check out session creation
        const line_items = [{
            price_data:{
                currency:"usd",
                product_data:{
                    name:title,
                    description: `${author} | ${publisher}`,
                    images:uploadImages,
                    metadata:{
                        title,author,pages,price,discountPrice,imageURL
                    }  
            },
            unit_amount:Math.round(discountPrice*100)
            },
            quantity:1
        }]
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: 'http://localhost:5173/user/payment-success',
            cancel_url:'http://localhost:5173/user/payment-error',
            payment_method_types:["card"]
        });
       console.log(session);
       res.status(200).json({checkoutURL:session.url})
       
    }catch(err){
      console.log(err);
      res.status(500).json(err)
    }
}