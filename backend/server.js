//requiring express to app          
import express from 'express'
const app = express()

import cookieParser from 'cookie-parser'
app.use(cookieParser())

//requie the env file
import dotenv from "dotenv";
dotenv.config()

//importing the routers to handle request
import authRoutes from './routes/authRouter.js'
import productRoutes from './routes/productRoutes.js'
import adminRouter from './routes/adminRouter.js'
import userRouter from './routes/userRouter.js'

//cors for react can send req from diff port
import cors from 'cors'

//connecting the DB file
import ConnectDB from "./config/connectDB.js";
//logger
import morgan from "morgan";
import logger from './utils/logger.js';


ConnectDB()

app.use(express.json())

//enabling cors with port
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://346d5cdda7cf.ngrok-free.app",
  "https://peter-heinlien-pfoi-qr57fzs8j-shibin-shajan-kps-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}))

// app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));

app.use('/api/auth', authRoutes)
app.use('/api/v1', productRoutes, adminRouter)
app.use('/api/v1/users', userRouter)

//port assigning
app.listen(process.env.PORT, () => logger.info(`The server started localhost:${process.env.PORT}`))