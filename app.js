import express from 'express'
import Connection from './src/db/configMysql.js'
import indexRouter from './src/routers/index.js';
import checkExitsDB from './src/db/checkExistsDB.js'
import logger from './src/loggers/loggerRun.js'
import defaultErrorHandler from './src/middlewares/errorMiddewares.js'
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//check database and create if not exists
checkExitsDB()
Connection()


app.use(cors());

app.use(logger);

app.use('/', indexRouter);

//handle error
app.use(defaultErrorHandler)

export default app