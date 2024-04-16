import express from 'express'
import connection from './src/db/configMysql.js'
import indexRouter from './src/routers/index.js';
import defaultErrorHandler from './src/middlewares/errorMiddewares.js'
import dotenv from 'dotenv';
dotenv.config();
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
import cors from 'cors';

app.use(cors({
    origin: '*'
}));

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
            },
        ],
    },
    apis: ["./openapi/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/', indexRouter);


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
console.log('Server is starting...2')
//handle error

app.use(defaultErrorHandler)


export default app