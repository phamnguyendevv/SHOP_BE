import express from 'express'
import connection from './src/db/configMysql.js'
import indexRouter from './src/routers/index.js';
import defaultErrorHandler from './src/middlewares/errorMiddewares.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Establish connection to database
if (connection) {
    console.log('Connection to database established')
} else {
    console.log('Connection to database failed')
}





app.use('/', indexRouter);


//handle error

app.use(defaultErrorHandler)


export default app