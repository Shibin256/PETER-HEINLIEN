//requiring express to app          
import express from 'express'
const app = express()

//requie the env file
import dotenv from "dotenv";
dotenv.config()

//importing the routers to handle request
import authRoutes from './routes/authRouter.js'

//cors for react can send req from diff port
import cors from 'cors'

//connecting the DB file
import ConnectDB from "./config/connectDB.js";


ConnectDB()

app.use(express.json())

//enabling cors with port
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


app.use('/api/auth',authRoutes)

//port assigning
app.listen(process.env.PORT, () => console.log(`The server started localhost:${process.env.PORT}`))