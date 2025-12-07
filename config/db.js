const mongoose = require("mongoose")

const connectionString = process.env.ATLASBDCOLLECTION

mongoose.connect(connectionString).then(res=>{
    console.log("MonogoBD connection Succefull")
}).catch(err=>{
    console.log("Database Connection Failed");
    console.log(err);
})