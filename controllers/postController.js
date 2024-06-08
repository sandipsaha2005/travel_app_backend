import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { Post } from '../models/jobSchema.js';
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

// const storage = multer.diskStorage({
//     destination: './uploads/', // Folder to store uploaded files
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

// // Check file type
// function checkFileType(file, cb) {
//     const filetypes = /jpeg|jpg|png/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (extname && mimetype) {
//         return cb(null, true);
//     } else {
//         cb(new Error('Images only!'));
//     }
// }

// // Init upload
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1000000 }, // 1MB limit
//     fileFilter: (req, file, cb) => {
//         checkFileType(file, cb);
//     }
// }).single('image');

// export const createPost = catchAsyncError(async (req, res, next) => {
//     const { role } = req.user;
//     if (role === 'Job Seeker') {
//         return next(new ErrorHandler("Job Seeker can't create post", 400));
//     }
    
//     // Handle file upload
//     upload(req, res, async (err) => {
//         if (err) {
//             console.error('Error occurred during file upload:', err);
//             return next(new ErrorHandler(err.message, 400));
//         }
    
//         console.log('File uploaded successfully');
    
//         const { title, description, category, country, city, priceRange } = req.body;
//         if (!title || !description || !category || !country || !city || !priceRange || !req.file) {
//             console.error('Required fields are missing or file is not uploaded:', req.body, req.file);
//             return next(new ErrorHandler("Please enter all the fields and upload an image", 400));
//         }
    
//         console.log('All required fields are present');
    
//         const postedBy = req.user._id;
//         const imageUrl = `/uploads/${req.file.filename}`;
//         console.log('Image URL:', imageUrl);
    
//         try {
//             const post = await Post.create({
//                 title, description, category, country, city, priceRange, postedBy, imageUrl
//             });
    
//             console.log('Post created successfully:', post);
    
//             res.status(200).json({
//                 success: true,
//                 message: "Post created successfully",
//                 post
//             });
//         } catch (error) {
//             console.error('Error occurred while creating post:', error);
//             return next(new ErrorHandler("Error occurred while creating post", 500));
//         }
//     });
// });
// export const createPost=catchAsyncError(async(req,res,next)=>{
//     const {role}=req.user;
//     if(role==='Job Seeker'){
//         return next(new ErrorHandler("Job Seeker can't create post",400))
//     }
//     const {title,description,category,country,city,priceRange}=req.body;
//     if(!title || !description || !category || !country || !city || !priceRange){
//         return next(new ErrorHandler("Please enter all the fields", 400));
//     }
//     const postedBy=req.user._id;
//     const post = await Post.create({
//         title,description,category,country,city,priceRange,postedBy
//     })
//     res.status(200).json({
//         success:true,
//         message:"Post created successfully",
//         post
//     })
// })

export const postDestinatioin = async (req, res, next) => {
    const { role } = req.user;
    if (role != "Employer") {
      return next(
        new ErrorHandler("Only Employers are allowed to access this resource.", 400)
      );
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("image File Required!", 400));
    }
  
    const { image } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(image.mimetype)) {
      return next(
        new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
      );
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath
    );
  
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
    }
    const { title, category, country, city, description, priceRange } = req.body;
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
      !image
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
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
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

