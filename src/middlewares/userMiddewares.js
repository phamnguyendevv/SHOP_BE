import UserModel from '../models/userModel.js';
import validate from '../utils/validate.js'; // Đảm bảo đường dẫn đúng
import USERS_MESSAGES from '../constants/messages.js';
import { checkSchema } from 'express-validator';
import connection from '../db/configMysql.js';
import passwordhandler from '../utils/password.js';


let userMiddlewares = {

    //register validator
    registerValidator: validate(checkSchema({
        email: {
            trim: true,
            isEmail: {
                errorMessage: USERS_MESSAGES.INVALID_EMAIL,
            },
            matches:{

                options: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/],
                errorMessage: USERS_MESSAGES.INVALID_EMAIL,
            },
            custom: {
                options: async (value) => {
                    const user = await UserModel.getUserByEmail(connection, value);
                    if (!user) {
                        return true;
                    }
                    throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS);
                },
            },
        },
        password: {
            trim: true,
            isLength: {
                options: { min: 6 },
                errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_LONGER_THAN_6_CHARACTERS,
            },
            matches:{
                options: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/],
                errorMessage: USERS_MESSAGES.MATCH_PASSWORD,
            }

        },
        fullname: {
            trim: true,
            isLength: {
                options: { min: 6 },
                errorMessage: USERS_MESSAGES.USERNAME_MUST_BE_LONGER_THAN_6_CHARACTERS,
            },
            custom: {
                options: async (value) => {
                   
                    const user = await UserModel.getUserByFullname(connection, value);
                    if (user) {
                        console.log(user); 
                        throw new Error(USERS_MESSAGES.USERNAME_IS_EXISTED);
                    }
                    return true;
                },
            },
        },
    }, ['body'])),


    //login validator
    loginValidator: validate(checkSchema({
        email: {
            trim: true,
            isEmail: {
                errorMessage: USERS_MESSAGES.INVALID_EMAIL,
            },
            custom: {
                options: async (value, { req }) => {
                    const user = await UserModel.getUserByEmail(connection, value);
                    if (!user) {
                        throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
                    }
                    // check ban hay ko 
                    req.user = user;
                    return true;
                },
            },
        },
        password: {
            trim: true,
            isLength: {
                options: { min: 6 },
                errorMessage: USERS_MESSAGES.MATCH_PASSWORD,
            },

            custom: {
                options: async (value, { req }) => {
                    const user = req.user;
                    const password = user.password;
                    const isMatch = await passwordhandler.comparePassword(value, password);
                    if (!isMatch) {
                        throw new Error(USERS_MESSAGES.PASSWORD_NOT_MATCH);
                    }
                    return true;
                },
            },
        },
    }, ['body'])),
    changePassword: validate(checkSchema({
        username:{
            trim: true,
            custom: {
                options: async (value, { req }) => {
                    const user = await UserModel.getUserByUsername(connection, value);
                    if (!user) {
                        throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
                    }
                    // check ban hay ko 
                    req.user = user;
                    return true;
                },
            },

        },
        oldPassword: {
            trim: true,
            isLength: {
                options: { min: 6 },
                errorMessage: USERS_MESSAGES.MATCH_PASSWORD,
            },

            custom: {
                options: async (value, { req }) => {
                    const user = req.user;
                    const password = user.password;
                    const isMatch = await passwordhandler.comparePassword(value, password);
                    if (!isMatch) {
                        throw new Error(USERS_MESSAGES.PASSWORD_NOT_MATCH);
                    }
                    return true;
                },
            },
        },
    }, ['body'])),

}



export default userMiddlewares;



