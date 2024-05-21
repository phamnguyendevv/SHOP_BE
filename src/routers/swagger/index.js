import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from 'express'
const router = express.Router()

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
export default swaggerSpec;