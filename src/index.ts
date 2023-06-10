import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/dbConfiguration';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
connectDB();
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Servers');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
