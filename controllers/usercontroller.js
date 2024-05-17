const createToken = require("../Utils");
const userModel = require("../models/userModel");
const bcrypt= require("bcrypt");
const cloudinary =require("cloudinary");





const registerUser=async(req,res)=>{

    if(!req.files || Object.keys(req.files).length===0){
        res.json({success:false,message:"User Avatar Required"})
    }
    const {avatar}=req.files
    const allowedFormats=["image/png","image/jpeg","image/jpg","image/webp"];
    if(!allowedFormats.includes(avatar.minetype)){
        res.json({success:false,message:"Invalid file type. please upload avatar in png,jpg or webp format"})
    }


    try {
        const{name,email,password,role,education,phone}=req.body;

        if(!name||!email||!password||!role||!education||!phone||!avatar){
            return res.json({success:false,message:"Please filled out all fiedls"})
        }
        if(name.length<=3 || name.length>32){
            return res.json({success:false,message:"Name must be greater than 3 characters and less than 32"})
        }
        if(password.length<8 || password.length>32){
            return res.json({success:false,message:"Password must be greater than 8 characters and less than 32"})
        }

        //check the user is already registerd
        const exists=await userModel.findOne({email})

        if(exists){
            return res.json({success:false,message:"User Already Regsitered!"})
        }
        //hash the password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)

        const cloundinaryResponse=await cloudinary.uploader.upload(avatar.tempFilePath)
        if(!cloundinaryResponse ||cloundinaryResponse.error)
            {
                console.log("cloudinary error"||cloundinaryResponse.error||"unknown cloudinary error")
            }
        //create a new user instance
        const newUser=new userModel({
            name:name,
            email:email,
            password:hashedPassword,
            role:role,
            education:education,
            phone:phone,
            avatar:{
                public_id:cloundinaryResponse.public_id,
                url:cloundinaryResponse.secure_url
            }
        })
        //save new user to the database

        const user =await newUser.save();

        const token=createToken(user._id);
        res.cookie("token",token,{
            httpOnly:true
        })

        //send the token in the response
        res.json({success:true,token})


        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
        
    }
}

const userLogin=async(req,res)=>{
    const {email,password,role}=req.body;
    if(!email||!password||!role){
        return res.json({success:false,message:"Please filled out all fields"})
    }
    try {
        
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User not Found"})
        }
        if(user.role !==role)
            {
                return res.json({success:false,message:"Incorrect Role"})
            }
            //check password
        const isPasswordMatch=await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            return res.json({success:false,message:"Invalid credentials"})
        }

        const token=createToken(user._id)
        res.cookie("token",token,{
            httpOnly:true
        })
        return res.json({success:true,token})
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:"Error"})
        
    }
   


}

const userLogout=async(req,res)=>{
    res.clearCookie("token",{
        httpOnly:true
    })
    res.json({success:true,message:"Successfully logout!"})
}

const getMyProfile=async(req,res)=>{
    const user=req.user;
    return res.json({success:true,user})
}

const getAllAuthors=async(req,res)=>{
    const author=await userModel.find({role:"Reader"})
    return res.json({success:true,authors:author})
}

module.exports={registerUser,userLogin,userLogout,getMyProfile,getAllAuthors}