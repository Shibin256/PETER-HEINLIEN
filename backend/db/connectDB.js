// const mongoose=require('mongoose')
import mongoose from "mongoose"
const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {})
        console.log(`mongoDB connected:${conn.connection.host}`)
    } catch (error) {
        console.log(`MongooDb NotConnected...`)
        console.log(error);
        process.exit(1);
    }
}
export default ConnectDB 