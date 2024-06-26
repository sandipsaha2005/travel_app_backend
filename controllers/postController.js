import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { Post } from '../models/postSchema.js';
import path from 'path'
import multer from 'multer';
import { log } from 'console';
import cloudinary from "cloudinary";

export const getAllPosts = catchAsyncError(async (req, res, next) => {
    const activePosts = await Post.find();
    if (!activePosts) {
        return next(new ErrorHandler('No active posts found', 404));
    }

    res.status(200).json({
        success: true,
        posts: activePosts
    });
});


export const postDestinatioin = async (req, res, next) => {
  const { role } = req.user;
  if (role !== "Employer") {
    return next(
      new ErrorHandler("Only Employers are allowed to access this resource.", 400)
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Image files are required!", 400));
  }

  const images = req.files.images;

  if (!Array.isArray(images) || images.length > 6) {
    return next(new ErrorHandler("You can upload up to 6 images.", 400));
  }

  const allowedFormats = ["image/png", "image/jpeg", "image/webp","image/avif"];
  const uploadedImages = [];



  for (let image of images) {
    // console.log(image);
    if (!allowedFormats.includes(image.mimetype)) {
      return next(
        new ErrorHandler("Invalid file type. Please upload PNG, JPEG, or WEBP files.", 400)
      );
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
    
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
    }

    uploadedImages.push({
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    });
  }


  const { title, category, country, city, description, priceRange,todo1,todo2,todo3,todo4,neighburHood,guideName,lat,lng } = req.body;
  const postedBy = {
    user: req.user._id,
    role: "Employer",
  };

  if (
    !title ||
    !category ||
    !country ||
    !city ||
    !description ||
    !priceRange ||
    !postedBy ||
    !todo1 ||
    !todo2 ||
    !todo3 ||
    !todo4 ||
    !neighburHood ||
    !guideName ||
    !lat ||
    !lng

  ) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  

  const Destination = await Post.create({
    title,
    category,
    country,
    city,
    description,
    priceRange,
    postedBy,
    images: uploadedImages,
    todo1,
    todo2,
    todo3,
    todo4,
    neighburHood,
    guideName,
    lat,
    lng,
    

  });

  res.status(200).json({
    success: true,
    message: "Post Created Successfully",
    Destination,
  });
};

export const getPost=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    const post= await Post.findById(id);
    if (!post) {
      return next(new ErrorHandler('Post not found', 404));
  }
  
    res.status(200).json({
        success:true,
        post,
    })
})


export const updatePost = catchAsyncError(async (req, res, next) => {

    const { role } = req.user;
    if (role === 'Job Seeker') {
        return next(new ErrorHandler("Job seekers aren't allowed to get access to this resource", 403)); 
    }

    const { id } = req.params;
    const myPost = await Post.find({ postedBy: req.user._id });
    let post = await Post.findById(id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404)); te
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You do not have permission to update this post", 403)); 
    }

    post = await Post.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        post,
        message: 'Post updated successfully'
    });
});

export const deletePost= catchAsyncError(async (req,res,next)=>{
    const { role } = req.user;
    if (role === 'Job Seeker') {
        return next(new ErrorHandler("Job seekers aren't allowed to get access to this resource", 403)); 
    }

    const { id } = req.params;
    let post = await Post.findById(id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404)); te
    }
    await post.deleteOne();
    res.status(200).json({
        success:true,
        message:"Post deleted successfully"
    })
})

