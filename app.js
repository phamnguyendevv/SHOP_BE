import express from 'express'
import indexRouter from './src/routers/index.js';
import initDatabase from "./src/db/checkExistsDB.js";

import logger from './src/loggers/loggerRun.js'
import defaultErrorHandler from './src/middlewares/errorMiddewares.js'
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//check database and create if not exists
await initDatabase();

app.use(cors());

app.use(logger);

app.use('/', indexRouter);

//handle error
app.use(defaultErrorHandler)

export default app