import express from 'express'
import {register,login,logout,getUser,createBooking,getAllBookings,getBookingById,getSpecBookings,updateBooking} from '../controllers/userController.js'
import {isAuthorized} from '../middlewares/auth.js'
import { catchAsyncError } from '../middlewares/catchAsyncError.js'
const router= express.Router()
router.post('/register', register)
// router.get('/test', testGetApi)
router.post('/login', login)
router.get('/logout',isAuthorized,logout)
router.get('/getuser',isAuthorized,getUser)
router.get('/get-all-bookings',isAuthorized,getAllBookings)
router.post('/update-bookings/:id',isAuthorized,updateBooking)
router.get('/get-spec-bookings/:id',isAuthorized,getSpecBookings)
router.get('/getbookings/:id',isAuthorized,getBookingById)
router.post('/create-booking',isAuthorized,createBooking)

export default router;