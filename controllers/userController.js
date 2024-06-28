import {catchAsyncError} from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../middlewares/error.js'
import {User} from '../models/userSchema.js'
import {BookingSchema} from '../models/BookingsSchema.js'
import {sendToken} from '../utils/jwtToken.js'

export const register= catchAsyncError( async(req,res,next)=>{
    const {name,email,phone,role,password}=req.body;
    if(!name || !email || !phone || !role || !password){
        return next(new ErrorHandler("Please enter the credential"))
    }
    const isEmail= await User.findOne({email});
    if(isEmail){
        return next(new ErrorHandler("Email already Exists"));
    }
    const user= await User.create({
        name,
        email,
        phone,
        role,
        password
    });
    sendToken(user,200,res,"User registered successfully ")
});

export const login= catchAsyncError(async (req,res,next)=>{
    const {email, password,role}=req.body;
    if(!email || !password || !role){
        return next(new ErrorHandler("Please provid requried details", 400))
    }
    const user=await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("User not found", 400))
    }
    const isPasswordMatched= await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("User not found", 400)) 
    }
    if(user.role !== role){
        return next(new ErrorHandler("User with this role not found", 400))
    }
    sendToken(user,200,res,"User logged in successfully")
})

export const logout= async (req,res,next)=>{
    res.status(201).cookie('token','',{
        httpOnly:true,
        expires:new Date(Date.now()),
    }).json({
        success:true,
        message:"User logout successfully!"
    });
}
export const getUser = catchAsyncError((req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  });
  
  const validateStartDateBeforeEndDate = (startDate, endDate) => {
    const currentDate = new Date(); 
  
    if (!startDate || !endDate || new Date(startDate) < currentDate || new Date(endDate) < currentDate) {
      return false;
    }
    
    return new Date(startDate) <= new Date(endDate);
  };

export const createBooking= async (req,res,next)=>{
    const {name,email,phone,fromDate,toDate,people,destinationId,destinationName,destinationLocation,userId,approved}=req.body;
    if(!name || !email || !phone || !fromDate || !toDate || !people || !destinationId || !destinationName || !destinationLocation ){
        return next(new ErrorHandler("Please provid requried details", 400))
    }
    if (!validateStartDateBeforeEndDate(fromDate, toDate)) {
        return next(new ErrorHandler("End date cannot be before start date and Past Dates are not allowed", 400));
      }

    const booking=await BookingSchema.create({
        name,
        email,
        phone,
        fromDate,
        toDate,
        people,
        destinationId,
        destinationName,
        destinationLocation,
        userId,
        approved
    });
    res.status(200).json({
        success: true,
        message: "Booking Created Successfully",
        booking,
      });
}

export const updateBooking = async (req, res, next) => {
    const {
      name,
      email,
      phone,
      fromDate,
      toDate,
      people,
      
      
    } = req.body;
    const { id } = req.params;
    console.log(id);
    if (!id) {
      return next(new ErrorHandler("Booking ID is required", 400));
    }

    if (
      !name ||
      !email ||
      !phone ||
      !fromDate ||
      !toDate ||
      !people
     
    ) {
      return next(new ErrorHandler("Please provide required details", 400));
    }
  
    try {
      const booking = await BookingSchema.findById(id);
  
      if (!booking) {
        return next(new ErrorHandler("Booking not found", 404));
      }
  
      booking.name = name;
      booking.email = email;
      booking.phone = phone;
      booking.fromDate = fromDate;
      booking.toDate = toDate;
      booking.people = people;
      
  
      await booking.save();
  
      res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        booking,
      });
    } catch (error) {
      next(new ErrorHandler("Failed to update booking", 500));
    }
  };

  
export const getAllBookings = async(req,res,next)=>{
    const activeBookings=await BookingSchema.find();

    if (!activeBookings) {
        return next(new ErrorHandler('No active bookings found', 400));
    }
    res.status(200).json({
        success: true,
        posts: activeBookings
    });
}
export const getSpecBookings = async(req,res,next)=>{
    const bookId=req.params.id;
    const Bookings=await BookingSchema.findById(bookId);

    if (!Bookings) {
        return next(new ErrorHandler('No active bookings found', 400));
    }
    res.status(200).json({
        success: true,
        posts: Bookings
    });
}

export const getBookingById = async (req, res, next) => {
    const userId = req.params.id;
    try {
        console.log(userId);
        const booking = await BookingSchema.find({userId:userId});
        console.log(booking);
        if (!booking) {
            return next(new ErrorHandler('Booking not found', 400));
        }

        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        return next(new ErrorHandler('Server Error', 500));
    }
};

export const approve=async(req,res,nexy)=>{
    const {
        approved
      } = req.body;
      const { id } = req.params;
      console.log(approved);
      if (!id) {
        return next(new ErrorHandler("Booking ID is required", 400));
      }
      try {
        const booking = await BookingSchema.findById(id);
    
        if (!booking) {
          return next(new ErrorHandler("Booking not found", 404));
        }
    
        booking.approved=approved;
        await booking.save();
        res.status(200).json({
          success: true,
          message: "Booking updated successfully",
          booking,
        });
      } catch (error) {
        next(new ErrorHandler("Failed to update booking", 500));
      }
}
