import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/dbConfiguration';
import { routesInit } from './routes/config.routes';
import cookieParser from 'cookie-parser';
import { secret } from './configuration/secret';
import cors from 'cors';



dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cookieParser());
const port = secret.PORT;
connectDB();
routesInit(app);

app.use(cors({ 
  origin: '*', 
  credentials: true 
}));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
