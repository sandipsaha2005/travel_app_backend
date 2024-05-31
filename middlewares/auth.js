import { catchAsyncError } from "./catchAsyncError.js"
import ErrorHandler from './error.js'
import jwt, { decode } from 'jsonwebtoken'
import { User } from "../models/userSchema.js"
export const isAuthorized=catchAsyncError(async (req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return next(new ErrorHandler("unauthorized",400))
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user= await User.findById(decoded.id);
    await next();
})