import express, { Express } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/dbConfiguration';
import { routesInit } from './routes/config.routes';
import cookieParser from 'cookie-parser';
import { SECRET } from './configuration/secret';
import cors from 'cors';



dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cookieParser());
const port = SECRET.PORT;
connectDB();
routesInit(app);

app.use(cors({ 
  origin: '*', 
  credentials: true 
}));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
