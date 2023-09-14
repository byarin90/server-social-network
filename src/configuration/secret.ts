import dotenv from 'dotenv';
dotenv.config();
export const SECRET = {
    DB_URI: process.env.DB_URI as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    PORT: process.env.PORT as string,
    TTL_ACCESS_TOKEN: +(process.env.TTL_ACCESS_TOKEN as string),
    TTL_REFRESH_TOKEN: +(process.env.TTL_REFRESH_TOKEN as string),
}