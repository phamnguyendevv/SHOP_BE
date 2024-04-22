import express from 'express'
import createDatabasePool from './src/db/configMysql.js'
import indexRouter from './src/routers/index.js';
import defaultErrorHandler from './src/middlewares/errorMiddewares.js'
import checkExitsDB from './src/db/checkExistsDB.js'
import dotenv from 'dotenv';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from 'cors';



dotenv.config();
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//check database and create if not exists
checkExitsDB()



// // connect to database
createDatabasePool()
app.use(cors());

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Shope web",
            version: "1.0.0",
            description: "A simple"
        },
        servers: [
            {
                url: "http://localhost:8989/api/v0",
                description: "Local development server"
            },
            {
                url: "http://20.206.240.27:8090/api/v0",
                description: "Production server"
            },
        ],

    },
    apis: ["./openapi/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/', indexRouter);


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

//handle error
app.use(defaultErrorHandler)


export default app