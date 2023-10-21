import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const mongo_url=process.env.MONGO_URL
        if (mongo_url) {
            await mongoose.connect(mongo_url)
            console.log("Connected to DB"); 
        }
    } catch (error) {
        console.log(error);
    }
}