import UserModel from '../models/userModel.js';
import validate from '../utils/validate.js';
import USERS_MESSAGES from '../constants/messages.js';
import { checkSchema } from 'express-validator';
import connection from '../db/configMysql.js';
import CategoryModel from '../models/categoryModel.js';
import ProductModel from '../models/productModel.js';


let categoryMiddlewares = {
    // add category validator
    addCategoryValidator: validate(checkSchema({
        user_id: {
            trim: true,
            isNumeric: {
                errorMessage: 'Product id must be a number',
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
        name: {
            trim: true,
            isLength: {
                options: { min: 2 },
                errorMessage: 'Name must be at least 2 characters long',
            },
        },
        image: {
            trim: true,
            isURL: {
                errorMessage: 'Image must be a URL',
            },
        }
    }, ['body'])),
    //update category validator
    updateCategoryValidator: validate(checkSchema({
        id: {
            trim: true,
            isNumeric: {
                errorMessage: 'Id must be a number',
            },
            custom: {
                options: async (value, { req }) => {


                    const category = await CategoryModel.getCategoryById(connection, value);
                    if (!category) {
                        throw new Error('Danh mục không tồn tại');
                    }

                    req.category = category;
                    return true;
                },
            },
        },
        user_id: {
            trim: true,
            isNumeric: {
                errorMessage: 'Product id must be a number',
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
        name: {
            trim: true,
            isLength: {
                options: { min: 2 },
                errorMessage: 'Name must be at least 2 characters long',
            },
        },
        image: {
            trim: true,
            isURL: {
                errorMessage: 'Image must be a URL',
            },
        }
    }, ['body'])),

    //delete category validator
    deleteCategoryValidator: validate(checkSchema({
        id: {
            trim: true,
            isNumeric: {
                errorMessage: 'Id must be a number',
            },
            custom: {
                options: async (value, { req }) => {


                    const category = await CategoryModel.getCategoryById(connection, value);
                    if (!category) {
                        throw new Error('Category not found');
                    }

                    req.category = category;
                    return true;
                },
            },
        },
    }, ['body'])),
}



export default categoryMiddlewares;