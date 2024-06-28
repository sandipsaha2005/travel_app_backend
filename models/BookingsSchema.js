import mongoose from "mongoose";
import validator from "validator";
const bookingSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the name of the application"],
    },
    email:{
        type:String,
        validator: [validator.isEmail, "Please provide a valid email"],
        required:[true,"Please enter the email"]
    },
    phone:{
        type:String,
        required:[true,"Please enter the phone number"]
    },
    fromDate:{
        type:String,
    },
    toDate:{
        type:String,
    },
    people:{
        type:String,
    },
    destinationId:{
        type: mongoose.Schema.Types.ObjectId,

    },
    destinationName:{
        type:String
    },
    destinationLocation:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId
    },
    approved:{
        type:Boolean
    }
})

export const BookingSchema= mongoose.model("BookingSchema",bookingSchema);
