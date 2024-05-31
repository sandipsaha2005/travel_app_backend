import mongoose from "mongoose";
import validator from "validator";
const appSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the name of the application"],
    },
    email:{
        type:String,
        validator: [validator.isEmail, "Please provide a valid email"],
        required:[true,"Please enter the email"]
    },
    coveredLetter:{
        type:String,
        required:[true, "Please enter the cover letter"],

    },
    phone:{
        type:Number,
        required:[true,"Please enter the phone number"]
    },
    address:{
        type:String,
        required:[true, "Please enter the address"]
    }
})

export const AppSchema= mongoose.model("AppSchema",appSchema);
