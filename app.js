import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import jobRuter from './routes/jobRouter.js';
import applicationRouter from './routes/applicationRouter.js';
import { dbConnection } from './database/dbConnection.js';
import { errorMiddleware } from './middlewares/error.js';

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
app.use('/api-v2/job', jobRuter);

dbConnection();

app.use(errorMiddleware);

export default app;
