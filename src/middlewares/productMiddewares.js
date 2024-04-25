import UserModel from '../models/userModel.js';
import validate from '../utils/validate.js'; // Đảm bảo đường dẫn đúng
import ProductModel from '../models/productModel.js';
import { checkSchema } from 'express-validator';
import Connection from '../db/configMysql.js';
const connection = await Connection();




let productMiddlewares = {
    //add product validator
    addProductValidator: validate(checkSchema({
        user_id: {
            trim: true,
            isNumeric: {
                errorMessage: 'User id must be a number',
            },
            custom: {
                options: async (value, { req }) => {
                    const user = await UserModel.getUserById(connection, value);
                    if (!user) {
                        throw new Error('User not found');
                    }
                    return true;
                },
            },
        },
        price: {
            trim: true,
            isNumeric: {
                errorMessage: 'Price must be a number',
            },
        },

        url_Demo: {
            trim: true,
            isURL: {
                errorMessage: 'URL Demo must be a URL',
            },
        },

        description: {
            trim: true,
            isLength: {
                options: { min: 2 },
                errorMessage: 'Description must be at least 2 characters long',
            },
        },

        url_Download: {
            trim: true,
            isURL: {
                errorMessage: 'URL Download must be a URL',
            },
        },
    }, ['body'])),


    //update product validator
    updateProductValidator: validate(checkSchema({
        id: {
            trim: true,
            isNumeric: {
                errorMessage: 'Product id must be a number',
            },
            custom: {
                options: async (value, { req }) => {
                    const product = await ProductModel.findProductById(connection, value);
                    if (!product) {
                        throw new Error('Product not found');
                    }
                    return true;
                },
            },
        },
        user_id: {
            trim: true,
            isNumeric: {
                errorMessage: 'User id must be a number',
            },
            custom: {
                options: async (value, { req }) => {
                    const user = await UserModel.getUserById(connection, value);
                    if (!user) {
                        throw new Error('User not found');
                    }
                    return true;
                },
            },
        }
        
    }, ['body'])),
    //delete product validator

    deleteProductValidator: validate(checkSchema({
        id: {
            trim: true,
            isNumeric: {
                errorMessage: 'Product id must be a number',
            },
            custom: {
                options: async (value, { req }) => {
                    const product = await ProductModel.findProductById(connection, value);
                    if (!product) {
                        throw new Error('Product not found');
                    }
                    return true;
                },
            },
        },
    }, ['query'])),

}


export default productMiddlewares;



