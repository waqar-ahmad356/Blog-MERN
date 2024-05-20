const express=require("express");
const { blogPost } = require("../controllers/blogcontoller");
const { isAuthorized } = require("../middleware/auth");

const blogRouter=express.Router();

blogRouter.post("/create",isAuthorized,blogPost)


module.exports=blogRouter