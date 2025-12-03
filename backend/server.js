// //requiring express to app          
// import express from 'express'
// const app = express()

// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// import cookieParser from 'cookie-parser'
// app.use(cookieParser())

// //requie the env file
// import dotenv from "dotenv";
// dotenv.config()

// //importing the routers to handle request
// import authRoutes from './routes/authRouter.js'
// import productRoutes from './routes/productRoutes.js'
// import adminRouter from './routes/adminRouter.js'
// import userRouter from './routes/userRouter.js'

// //cors for react can send req from diff port
// import cors from 'cors'

// //connecting the DB file
// import ConnectDB from "./config/connectDB.js";
// //logger
// import morgan from "morgan";
// import logger from './utils/logger.js';


// ConnectDB()

// app.use(express.json())

// //enabling cors with port
// // app.use(cors({
// //   origin: 'http://localhost:5173',
// //   credentials: true,
// // }));

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://346d5cdda7cf.ngrok-free.app",
//   "https://peter-heinlien-pfoi-qr57fzs8j-shibin-shajan-kps-projects.vercel.app"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }))

// // app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));

// app.use('/api/auth', authRoutes)
// app.use('/api/v1', productRoutes)
// app.use('/api/v1/admin', adminRouter)
// app.use('/api/v1/users', userRouter)

// // serve static frontend
// app.use(express.static(path.join(__dirname, "dist")));

// // for any unknown route, send frontend
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// //port assigning
// // app.listen(process.env.PORT, () => logger.info(`The server started localhost:${process.env.PORT}`))
// app.listen(process.env.PORT, '0.0.0.0', () => {
//   logger.info(`Server running on port ${process.env.PORT}`)
// })


// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utils/logger.js';

import ConnectDB from './config/connectDB.js';

// Import routers
import authRoutes from './routes/authRouter.js';
import productRoutes from './routes/productRoutes.js';
import adminRouter from './routes/adminRouter.js';
import userRouter from './routes/userRouter.js';

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
ConnectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Logging (optional)
// app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));

// CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://346d5cdda7cf.ngrok-free.app",
  "https://peter-heinlien-pfoi-qr57fzs8j-shibin-shajan-kps-projects.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// API Routes (must be before React frontend route)
app.use('/api/auth', authRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/users', userRouter);

// Serve React frontend for unknown routes
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
const PORT = process.env.PORT || 2028;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});
