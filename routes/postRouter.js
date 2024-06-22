import express from 'express'
import {getAllPosts} from '../controllers/postController.js'
import {isAuthorized} from '../middlewares/auth.js'
import { postDestinatioin,getPost ,updatePost,deletePost} from '../controllers/postController.js'
const router= express.Router()
router.get('/getAllPost',getAllPosts)
router.post('/createPost',isAuthorized,postDestinatioin)
router.get('/getPost/:id',isAuthorized,getPost)

router.put('/updatePost/:id',isAuthorized,updatePost)
router.delete('/deletePost/:id',isAuthorized,deletePost)
export default router;