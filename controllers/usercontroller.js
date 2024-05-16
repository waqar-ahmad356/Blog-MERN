const userModel = require("../models/userModel");
const bcrypt= require("bcrypt");

const jwt =require("jsonwebtoken")


//create token 

const createToken=(id)=>{
   return jwt.sign({id},process.env.JWT_SECRET)
}
const registerUser=async(req,res)=>{
    try {
        const{name,email,password,role,education,phone}=req.body;

        if(!name||!email||!password||!role||!education||!phone){
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
        //create a new user instance
        const newUser=new userModel({
            name:name,
            email:email,
            password:hashedPassword,
            role:role,
            education:education,
            phone:phone
        })
        //save new user to the database

        const user =await newUser.save();

        const token=createToken(user._id);

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
        return res.json({success:false,token})
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:"Error"})
        
    }
   


}

module.exports={registerUser,userLogin}