import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  public_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter the job title"],
        minLength: [3, "Post title must contain at least 3 characters"],
        // maxLength: [50, "Post title cannot exceed 50 characters"],
    },
    description: {
        type: String,
        required: [true, "Please enter the job description"],
        minLength: [3, "Post description must contain at least 30 characters"],
        // maxLength: [3500, "Post description cannot exceed 350 characters"],
    },
    category: {
        type: String,
        required: [true, "Please enter the Post category"],
    },
    country: {
        type: String,
        required: [true, "Please enter the country"],
    },
    city: {
        type: String,
        required: [true, "Please enter the city"],
    },
    priceRange: {
        type: String,
    },
    postedOn: {
        type: Date,
        default: Date.now,
    },

    postedBy: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["Employer"],
          required: true,
        },
    },
    images: {
      type: [imageSchema],
      required: true,
      validate: [arrayLimit, '{PATH} exceeds the limit of 6']
    },
    

    
    // virtualHost:{
    //   imgage:{
    //     type:String
    //   },
    //   about:{
    //     type:String
    //   }
    // },
    guideName:{
      type:String
    },
    lat: {
      type: Number,
      // required: true
    },
    lng: {
      type: Number,
      // required: true
    },
    todo1:{
      type:String
    },
    todo2:{
      type:String
    },
    todo3:{
      type:String
    },
    todo4:{
      type:String
    },
    neighburHood:{
      type:String
    },
    guideName:{
      type:String
    }
    
});

function arrayLimit(val) {
  return val.length <= 6;
}

export const Post = mongoose.model("Post", postSchema);
