const jwt =require("jsonwebtoken");
const userModel = require("../models/userModel");
//authentication
const isAuthenticated=async(req,res,next)=>{
    const {token}=req.cookies
    if(!token)
        {
            res.json({success:false,message:"user is not authenticated"})
        }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=await userModel.findById(decoded.id);
    next()
}

//authorization

const isAuthorized=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.json({success:false,message:`user with this role ${req.user.role}not allowed to access this resource`})
        }
    }
    next();

}

module.exports={isAuthenticated,isAuthorized}