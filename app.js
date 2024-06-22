import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';
import applicationRouter from './routes/applicationRouter.js';
import { dbConnection } from './database/dbConnection.js';
import { errorMiddleware } from './middlewares/error.js';
import multer from 'multer';
import path from 'path'
const app = express();
dotenv.config({ path: './config/config.env' });

app.use(cors({
    origin: 'http://localhost:5173', // The URL of your React app
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true, // Allow credentials
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp/',
}));
app.use('/api-v2/user', userRouter);
app.use('/api-v2/application', applicationRouter);
app.use('/api-v2/destination', postRouter);

dbConnection();

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './uploads/images'); // Destination folder for images
//     },
//     filename: function(req, file, cb) {
//         const ext = path.extname(file.originalname);
//         cb(null, `${uuidv4()}${ext}`); // Unique filename with original extension
//     }
// });
// const upload = multer({ storage: storage });

// app.post('/upload/image', upload.single('image'), function(req, res) {
//     if (!req.file) {
//         return res.status(400).json({ message: 'No image uploaded' });
//     }

//     // Get the uploaded image path
//     const imagePath = req.file.path;

//     // Construct the image URL
//     const imageUrl = `${process.env.BASE_URL || 'http://localhost:8000'}/uploads/images/${req.file.filename}`;

//     res.status(200).json({
//         message: 'Image uploaded successfully',
//         imageUrl: imageUrl
//     });
// });


app.use(errorMiddleware);

export default app;
