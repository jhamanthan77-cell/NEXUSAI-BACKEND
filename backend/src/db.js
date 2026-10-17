import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const connectDB=async()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to mongoDB:", error);
        process.exit(1);
        throw error;
    }
}
export  default connectDB;