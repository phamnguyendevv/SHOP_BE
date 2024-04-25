import UserModel from '../models/userModel.js';
import validate from '../utils/validate.js'; // Đảm bảo đường dẫn đúng
import ProductModel from '../models/productModel.js';
import { checkSchema } from 'express-validator';
import statusProductModel from '../models/statusProductModel.js';
import Connection from '../db/configMysql.js';
const connection = await Connection();

let cartMiddlewares = {
    addCartValidator: validate(checkSchema({
        product_id: {
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
                    req.product = product;
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
                    req.user = user;
                    return true;
                },
            },
        },
    }, ['body'])),




}

export default cartMiddlewares;