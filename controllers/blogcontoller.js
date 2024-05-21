const cloudinary = require("cloudinary").v2;
const blogModel = require("../models/blogModel");

// Create a function to handle blog post
const blogPost = async (req, res) => {
    // Check if image files are provided
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json({ success: false, message: "Please upload main image" });
    }

    // Extract images from the request
    const { mainImage, subImageOne, subImageTwo, subImageThree } = req.files;

    if (!mainImage) {
        return res.json({ success: false, message: "Blog main image is mandatory" });
    }

    // Define allowed image formats
    const allowedFormats = ["image/jpeg", "image/png"];

    // Validate image format
    if (!allowedFormats.includes(mainImage.mimetype) ||
        (subImageOne && !allowedFormats.includes(subImageOne.mimetype)) ||
        (subImageTwo && !allowedFormats.includes(subImageTwo.mimetype)) ||
        (subImageThree && !allowedFormats.includes(subImageThree.mimetype))
    ) {
        return res.json({ success: false, message: "Invalid file type. Please upload images in PNG or JPG format." });
    }

    try {
        // Extract blog data from request body
        const { title, intro, subTitleOne, subContentOne, subTitleTwo, subContentTwo, subTitleThree, subContentThree, category } = req.body;
        const createdBy = req.user._id;
        const authorName = req.user.name; // Ensure this field is correct
        const authorAvatar = req.user.avatar.url; // Ensure this field is correct

        if (!title || !category || !intro) {
            return res.json({ success: false, message: "Title, category, and intro are required fields" });
        }

        // Upload images to Cloudinary
        const uploadPromises = [
            cloudinary.uploader.upload(mainImage.tempFilePath),
            subImageOne ? cloudinary.uploader.upload(subImageOne.tempFilePath) : Promise.resolve(null),
            subImageTwo ? cloudinary.uploader.upload(subImageTwo.tempFilePath) : Promise.resolve(null),
            subImageThree ? cloudinary.uploader.upload(subImageThree.tempFilePath) : Promise.resolve(null)
        ];

        const [mainImageRes, subImageOneRes, subImageTwoRes, subImageThreeRes] = await Promise.all(uploadPromises);

        const blogData = {
            title,
            intro,
            subTitleOne,
            subContentOne,
            subTitleTwo,
            subContentTwo,
            subTitleThree,
            subContentThree,
            category,
            createdBy,
            authorName,
            authorAvatar,
            mainImage: {
                public_id: mainImageRes.public_id,
                url: mainImageRes.secure_url
            }
        };

        if (subImageOneRes) {
            blogData.subImageOne = {
                public_id: subImageOneRes.public_id,
                url: subImageOneRes.secure_url
            };
        }
        if (subImageTwoRes) {
            blogData.subImageTwo = {
                public_id: subImageTwoRes.public_id,
                url: subImageTwoRes.secure_url
            };
        }
        if (subImageThreeRes) {
            blogData.subImageThree = {
                public_id: subImageThreeRes.public_id,
                url: subImageThreeRes.secure_url
            };
        }

        const blog = new blogModel(blogData);
        await blog.save();

        return res.json({ success: true, message: "Blog created successfully", blog });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}
//delete blog

const deleteBlog=async(req,res)=>{
    try {
        const {id}=req.params
        const blog=await blogModel.findById(id)
        if(!blog){
            return res.json({success:false,message:"Blog not found"})
        }
        await blog.deleteOne();
        return res.json({success:true,message:"Blog deleted successfully"})
    } catch (error) {
        console.log(error);
       return  res.json({success:false,message:"Error"})
        
    }
}
//get all blogs
const getAllBlogs=async(req,res)=>{
    try {
        const allblogs=await blogModel.find({published:true})
        return res.json({success:true,message:"All blogs fetched successfully",allblogs})
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:"Error"})
        
    }
}

// get single blog

const getSingleBlog=async(req,res)=>{
    try {
        const {id}=req.params;
    const blog=await blogModel.findById(id);
    if(!blog){
        return res.json({success:false,message:"Blog not found"})
    }
    return res.json({success:true,blog})
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:"Error"})
        
    }
    
}
module.exports = { blogPost,deleteBlog,getAllBlogs ,getSingleBlog};