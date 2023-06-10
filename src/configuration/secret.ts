import dotenv from 'dotenv';
dotenv.config();
export const secret = {
    DB_URI: process.env.DB_URI as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    PORT: process.env.PORT as string,
}