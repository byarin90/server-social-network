import mongoose from 'mongoose';
import { SECRET } from '../configuration/secret';

export async function connectDB() {
    try {
       await mongoose.connect(SECRET.DB_URI);
      
        console.log("Connected successfully to database");
    } catch (error) {
        console.error("Error connecting to database: ", error);
    }
}
