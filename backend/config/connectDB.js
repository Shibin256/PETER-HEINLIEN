// import mongoose from "mongoose"
// //mogodb connection with app
// const ConnectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI, {})
//         console.log(`mongoDB connected:${conn.connection.host}`)
//     } catch (error) {
//         console.log(`MongooDb NotConnected...`)
//         console.log(error);
//         process.exit(1);
//     }
// }
// export default ConnectDB 


// import mongoose from "mongoose";

// const ConnectDB = async () => {
//     try {
//         console.log(process.env.MONGO_URI)
//         const conn = await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log(`✅ MongoDB connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`❌ MongoDB connection failed: ${error.message}`);
//         process.exit(1);
//     }
// };

// export default ConnectDB;

import mongoose from "mongoose";

const ConnectDB = async () => {
    try {
        console.log(process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

export default ConnectDB;