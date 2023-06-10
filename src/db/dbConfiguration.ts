import mongoose from 'mongoose';

export async function connectDB() {
    const uri = process.env.DB_URI as string; // Get your DB URI from an environment variable

    try {
        await mongoose.connect(uri);
        console.log("Connected successfully to database");
    } catch (error) {
        console.error("Error connecting to database: ", error);
    }
}
