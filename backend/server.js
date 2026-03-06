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

// // Logging (optional)
app.use(
  morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }),
);

const allowedOrigins = [
  'http://localhost:5173',
  'https://346d5cdda7cf.ngrok-free.app',
  'https://peter-heinlien-pfoi-qr57fzs8j-shibin-shajan-kps-projects.vercel.app',
  'https://peterheinlien.shop',
  'https://www.peterheinlien.shop',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

// API Routes (must be before React frontend route)
app.use('/api/auth', authRoutes);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1', productRoutes);

// Serve React frontend (correct path)
const frontendPath = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 2028;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});
