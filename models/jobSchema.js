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
    location: {
        type: String,
        required: [true, "Please enter the location"],
        minLength: [50, "Job location must contain at least 50 characters"],
    },
    price: {
        type: Number,
        min: [0, "Costing must be a positive number"],
    },
    minCoast: {
        type: Number,
        min: [0, "Minimum cost must be a positive number"],
    },
    maxCoast: {
        type: Number,
        min: [0, "Maximum cost must be a positive number"],
    },
    expired: {
        type: Boolean,
        default: false,
    },
    postedOn: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    }
});

export const Post = mongoose.model("Post", postSchema);
