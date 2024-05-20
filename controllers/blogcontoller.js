const cloudinary=require("cloudinary");
const blogModel = require("../models/blogModel");


//create a function to handle blog post

const blogPost=async(req,res)=>{
    //check image file is provided
    if(!req.files||Object.keys(req.files).length===0){
        return res.json({success:false,message:"Please uplaod main image"})
    }
    //extract images from the request
    const {mainImage,subImageOne,subImageTwo,subImageThree}=req.files;
    if(!mainImage){
        return res.json({success:false,message:"Blog main image is mandatory"})
    }
    //define allowed image formats
    const allowedFormats=["image/jpeg","image/png"]
    //validate image format
    if(!allowedFormats.includes(mainImage.mimetype) || (subImageOne && !allowedFormats.includes(mainImage.mimetype))
        || (subImageTwo && !allowedFormats.includes(mainImage.mimetype))
    || (subImageThree && !allowedFormats.includes(mainImage.mimetype))
    ){
        return res.json({success:false,message:"Invalid file type.Please upload image in png or jpg format."})
    }
    try {
        //extract blog data from request body
        const {title,
            intro,
            subTitleOne,
            subContentOne,
            subTitleTwo,
            subContentTwo,
            subTitleThree,
            subContentThree,
            category,}=req.body

            const createdBy=req.user._id;
            const authorName=req.user;
            const authorAvatar=req.user.avatar.url;

            if(!title||!category||!intro){
                return res.json({success:false,message:"Title, category and intro required fields"})
            }
            const uplaodPromises={
                mainImage:cloudinary.uploader.upload(mainImage.tempFilePath),
                subImageOne:subImageOne?cloudinary.uploader.upload(subImageOne.tempFilePath):Promise.resolve(null),
               subImageTwo: subImageTwo?cloudinary.uploader.upload(subImageTwo.tempFilePath):Promise.resolve(null),
               subImageThree: subImageThree?cloudinary.uploader.upload(subImageThree.tempFilePath):Promise.resolve(null),

            }
            const [mainImageRes,subImageOneRes,subImageTwoRes,subImageThreeRes]=await Promise.all(uplaodPromises)

           const blogData={
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
            mainImage:{
                public_id:mainImage.public_id,
                url:mainImage.secure_url
            }
            
           } 
           if(subImageOne){
            blogData.subImageOne={
                public_id:subImageOne.public_id,
                url:subContentOne.secure_url
            }
           }
           if(subImageTwo){
            blogData.subImageTwo={
                public_id:subImageTwo.public_id,
                url:subContentTwo.secure_url
            }
           }
           if(subImageThree){
            blogData.subImageOne={
                public_id:subImageThree.public_id,
                url:subContentThree.secure_url
            }
           }

           const blog=await blogModel.save(blogData);
           return res.json({suceess:true,message:"blog created successfully",blog})


    } catch (error) {
        console.log(error)
        return res.json({success:false,message:"Error"})
        
    }

}