const express=require("express");
const { blogPost, deleteBlog, getAllBlogs, getSingleBlog } = require("../controllers/blogcontoller");
const { isAuthorized, isAuthenticated } = require("../middleware/auth");

const blogRouter=express.Router();

blogRouter.post("/create",isAuthenticated,isAuthorized("Author"),blogPost)
blogRouter.delete("/delete/:id",isAuthenticated,isAuthorized("Author"),deleteBlog)
blogRouter.get("/all",getAllBlogs)
blogRouter.get('/single/:id',isAuthenticated,getSingleBlog)


module.exports=blogRouter