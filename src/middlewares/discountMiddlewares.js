import UserModel from '../models/userModel.js';
import validate from '../utils/validate.js'; // Đảm bảo đường dẫn đúng
import USERS_MESSAGES from '../constants/messages.js';
import { checkSchema } from 'express-validator';
import Connection from '../db/configMysql.js';
const connection = await Connection();

import passwordhandler from '../utils/password.js';
import ErrorWithStatus from '../utils/error.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import DiscountModel from '../models/DiscountModel.js';

let discountMiddlewares = {


    //add discount validator
    addDiscountValidator: validate(checkSchema({

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
        start_discount: {
            trim: true,
            isDate: {
                errorMessage: 'Start discount must be a date',
            },
        },
        end_discount: {
            trim: true,
            isDate: {
                errorMessage: 'End discount must be a date',
            },
        },
        persen_discount: {
            trim: true,
            isNumeric: {
                errorMessage: 'Discount must be a number',
            },
        },
        name_discount: {
            trim: true,
            isLength: {
                options: { min: 2 },
                errorMessage: 'Name discount must be at least 2 characters long',
            },
        },
    }, ['body'])),
    // update discount validator
    updateDiscountValidator: validate(checkSchema({
        id: {
            trim: true,
            isNumeric: {
                errorMessage: 'Discount id must be a number',
            },
            custom: {
                options: async (value, { req }) => {

                    const discount = await DiscountModel.getDiscountById(connection, value);
                    if (!discount) {
                        throw new Error('Discount not found');
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
        },
        start_discount: {
            trim: true,
            isDate: {
                errorMessage: 'Start discount must be a date',
            },
        },
        end_discount: {
            trim: true,
            isDate: {
                errorMessage: 'End discount must be a date',
            },
        },
        persen_discount: {
            trim: true,
            isNumeric: {
                errorMessage: 'Discount must be a number',
            },
        },
        name_discount: {
            trim: true,
            isLength: {
                options: { min: 2 },
                errorMessage: 'Name discount must be at least 2 characters long',
            },
        },
    }, ['body'])),

}

export default discountMiddlewares