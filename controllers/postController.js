import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { Post } from '../models/jobSchema.js';

export const getAllPosts = catchAsyncError(async (req, res, next) => {
    const activePosts = await Post.find({ expired: false });

    if (!activePosts) {
        return next(new ErrorHandler('No active posts found', 404));
    }

    res.status(200).json({
        success: true,
        posts: activePosts
    });
});

export const createPost=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role==='Job Seeker'){
        return next(new ErrorHandler("Job Seeker can't create post",400))
    }
    const {title,description,category,country,city,location,price,minCoast,maxCoast}=req.body;
    if(!title || !description || !category || !country || !city || !location || !price){
        return next(new ErrorHandler("Please enter all the fields", 400));
    }
    const postedBy=req.user._id;
    const post = await Post.create({
        title,description,category,country,city,location,price,minCoast,maxCoast,postedBy
    })
    res.status(200).json({
        success:true,
        message:"Post created successfully",
        post
    })
})

export const getMyPost=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role==='Job Seeker'){
        return next(new ErrorHandler("Job seeker aren't allowed to get access of this resource",400));
    }
    const myPost= await Post.find({postedBy:req.user._id});
    res.status().json({
        success:true,

        myPost,
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

