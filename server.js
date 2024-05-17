const express=require("express");
const connectDb = require("./config/db");

const dotenv =require("dotenv");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoute");
const expressfileupload=require("express-fileupload")
const cloudinary =require("cloudinary")


cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET
})
dotenv.config();

const port=process.env.PORT;


const app=express();

connectDb();
//middleware

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(expressfileupload({
    useTempfiles:true,
    tempFileDir:"/tmp/",
}))



//endpoint
app.use("/api/user",userRouter)

app.listen(port,()=>{
    console.log(`server is runnig on http://localhost:${port}`)
})
