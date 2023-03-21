import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("Database connected:", db.connection.host);
    } catch (error) {
        console.log("Database error:", error);
    }
};

export default connectDB;
