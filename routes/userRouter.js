import express from 'express'
import {register,login,logout,getUser,testGetApi} from '../controllers/userController.js'
import {isAuthorized} from '../middlewares/auth.js'
import { catchAsyncError } from '../middlewares/catchAsyncError.js'
const router= express.Router()
router.post('/register', register)
router.get('/test', testGetApi)
router.post('/login', login)
router.get('/logout',isAuthorized,logout)
router.get('/getuser',isAuthorized,getUser)

export default router;