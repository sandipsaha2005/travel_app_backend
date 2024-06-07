import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter the job title"],
        minLength: [3, "Job title must contain at least 3 characters"],
        maxLength: [50, "Job title cannot exceed 50 characters"],
    },
    description: {
        type: String,
        required: [true, "Please enter the job description"],
        minLength: [3, "Job description must contain at least 3 characters"],
        maxLength: [350, "Job description cannot exceed 350 characters"],
    },
    category: {
        type: String,
        required: [true, "Please enter the job category"],
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
    // postedBy: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true,
    // },
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
    image: {
        public_id: {
          type: String, 
          required: true,
        },
        url: {
          type: String, 
          required: true,
        },
      },
});

export const Post = mongoose.model("Post", postSchema);
