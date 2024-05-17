const express=require("express");
const { registerUser, userLogin, userLogout, getMyProfile, getAllAuthors } = require("../controllers/usercontroller");
const { isAuthenticated, isAuthorized } = require("../middleware/auth");


const userRouter=express.Router();


userRouter.post("/register",registerUser);
userRouter.post("/login",userLogin)
userRouter.post("/logout",userLogout)
userRouter.get("/myprofile",isAuthenticated,getMyProfile)
userRouter.get("/authors",getAllAuthors)


module.exports=userRouter;