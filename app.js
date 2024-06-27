import express from 'express'


const publisher = require("./pub");
const subscriber = require("./sub");




import Connection from './src/db/configMysql.js'
import indexRouter from './src/routers/index.js';
import defaultErrorHandler from './src/middlewares/errorMiddewares.js'
import checkExitsDB from './src/db/checkExistsDB.js'
import MyLogger from './src/loggers/myLogger.js'
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();


const myLogger = new MyLogger();
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//check database and create if not exists
checkExitsDB()
Connection()


app.use(cors());

app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] || Date.now().toString();
    req.requestId = requestId;
    // console.log(req)
    const params = [
        req.path,
        { requestId: requestId },
        req.method === 'POST' ? req.body : req.query
    ];

    myLogger.log(`Input params :: ${req.method}`, params);
    next();
});

app.use('/', indexRouter);
//handle error
app.use(defaultErrorHandler)


export default app