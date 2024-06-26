const cloudinary = require("cloudinary").v2;
const blogModel = require("../models/blogModel");

// Function to handle creating a new blog post
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

        // Prepare blog data with image URLs and other details
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

        // Add sub image data if available
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

        // Create new blog instance and save to database
        const blog = new blogModel(blogData);
        await blog.save();

        return res.json({ success: true, message: "Blog created successfully", blog });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}

// Function to delete a blog
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        await blog.deleteOne();
        return res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}

// Function to get all published blogs
const getAllBlogs = async (req, res) => {
    try {
        const allblogs = await blogModel.find({ published: true });
        return res.json({ success: true, message: "All blogs fetched successfully", allblogs });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}

// Function to get a single blog by ID
const getSingleBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        return res.json({ success: true, blog });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}

// Function to get blogs created by the current user
const getMyBlogs = async (req, res) => {
    try {
        const blog_createdBy = req.user._id;
        const myBlogs = await blogModel.find({ createdBy: blog_createdBy });
        return res.json({ success: true, message: "Your Blogs", "yours blogs": myBlogs });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}

// Function to update a blog
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        let blog = await blogModel.findById(id);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        // Extract updated blog data from request body
        const { title, intro, subTitleOne, subContentOne, subTitleTwo, subContentTwo, subTitleThree, subContentThree, category, published } = req.body;

        // Prepare updated blog data
        const newBlogData = {
            title,
            intro,
            subTitleOne,
            subContentOne,
            subTitleTwo,
            subContentTwo,
            subTitleThree,
            subContentThree,
            category,
            published
        };

        // Check if new image files are provided
        let mainImage, subImageOne, subImageTwo, subImageThree;
        if (req.files) {
            ({ mainImage, subImageOne, subImageTwo, subImageThree } = req.files);
            const allowedFormats = ['image/png', 'image/jpg'];
            // Validate image formats
            if ((mainImage && !allowedFormats.includes(mainImage.mimetype)) ||
                (subImageOne && !allowedFormats.includes(subImageOne.mimetype)) ||
                (subImageTwo && !allowedFormats.includes(subImageTwo.mimetype)) ||
                (subImageThree && !allowedFormats.includes(subImageThree.mimetype))) {
                return res.json({ success: false, message: "Invalid image format" });
            }
        }

        // Handle main image update
        if (req.files && mainImage) {
            // Delete previous main image from Cloudinary if exists
            if (blog.mainImage) {
                await cloudinary.uploader.destroy(blog.mainImage.public_id);
            }
            // Upload new main image to Cloudinary
            const newBlogMainImage = await cloudinary.uploader.upload(mainImage.tempFilePath);
            newBlogData.mainImage = {
                public_id: newBlogMainImage.public_id,
                url: newBlogMainImage.secure_url,
            };
        }

        // Handle sub image updates similarly...

        // Update the blog in the database with new data
        blog = await blogModel.findByIdAndUpdate(id, newBlogData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        
        return res.json({ success: true, message: "Blog updated successfully", blog });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}

// Export all functions for use in other modules
module.exports = { blogPost, deleteBlog, getAllBlogs, getSingleBlog, getMyBlogs, updateBlog };
