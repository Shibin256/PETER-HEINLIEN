//requiring express to app          
import express from 'express'
const app = express()


//requie the env file
import dotenv from "dotenv";
dotenv.config()


//port assigning
app.listen(process.env.PORT, () => console.log(`The server started localhost:${process.env.PORT}`))