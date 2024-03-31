import UserModel from '../models/userModel.js';
import validate from '../utils/validate.js'; // Đảm bảo đường dẫn đúng
import USERS_MESSAGES from '../constants/messages.js';
import { checkSchema } from 'express-validator';
import connection from '../db/configMysql.js';
import passwordhandler from '../utils/password.js';


let productMiddlewares = {
    //add product validator
    addProductValidator: validate(checkSchema({
        user_id : {
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

        url_Demo:{
            trim: true,
            isURL: {
                errorMessage: 'URL Demo must be a URL',
            },
        },

        // validator  '{"category1": "WebDevelopment", "category2": "JavaScript"}', --json
        // category:  {
        //      trim: true,
        //         custom: {
        //             options: (value) => {
        //                 try {
        //                     console.log(JSON.parse(value.category));
        //                     return true;
        //                 } catch (error) {
        //                     throw new Error('Category must be a JSON');
        //                 }
        //             },
        //         },
                
        // },

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

        // technology: {
        //     trim: true,
        //     isJSON: {
        //         errorMessage: 'Category must be a JSON',

        //     },
        // },
    }, ['body'])),


   
}



export default productMiddlewares;



