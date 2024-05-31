import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { decrypt } from "dotenv";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide your name'],
        minLength:[3,'Name must contain at least 3 character'],
        maxLength:[30,'Name must cotain at most 30 character']
    },
    email:{
        type:String,
        required: [true, "please provide your email"],
        validate: [validator.isEmail,'Please enter a valid email']
    },
    phone:{
        type:Number,
        required:[true,'Please provide you phone'],
    },
    password:{
        type:String,
        required:[true, "Please enter the password"],
        minLength:[5,"Password must contain at least 5 character"],
        maxLength:[30, "Password must contain at most 30 character"],
        select:false,
    },
    role:{
        type:String,
        required:[true,"Please enter you role"],
        enum:['Job Seeker','Employer'],
    },
    createdAt:{
        type:Date,
        default: Date.now,
    }
})

// hashing the pass
userSchema.pre("save",async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
})
// comparing password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
// generating jwt token
userSchema.methods.getJwtToken= function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn:process.env.JWT_EXPIRE,
    })
}

export const User=mongoose.model("User", userSchema)