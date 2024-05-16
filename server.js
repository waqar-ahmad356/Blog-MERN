const express=require("express");
const connectDb = require("./config/db");
const cors=require("cors")
const dotenv =require("dotenv");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoute");

dotenv.config();

const port=process.env.PORT;


const app=express();

connectDb();
//middleware
app.use(express.json())
app.use(cookieParser)
app.use(cors({
    origin:[],
    methods:["GET","PUT","DELETE","POST"],
    credentials:true
}))
app.use(express.urlencoded({extended:true}))

//endpoint
app.use("/api/user",userRouter)

app.listen(port,()=>{
    console.log(`server is runnig on http://localhost:${port}`)
})
