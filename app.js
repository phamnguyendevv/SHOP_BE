import express from 'express'
import connection from './src/db/configMysql.js'
import indexRouter from './src/routers/index.js';
import defaultErrorHandler from './src/middlewares/errorMiddewares.js'
import dotenv from 'dotenv';
dotenv.config();
console.log('Server is starting...1')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/', indexRouter);

console.log('Server is starting...2')
//handle error

app.use(defaultErrorHandler)


export default app