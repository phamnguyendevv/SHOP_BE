import UserModel from '../models/userModel.js';
import validate from '../utils/validate.js'; // Đảm bảo đường dẫn đúng
import USERS_MESSAGES from '../constants/messages.js';
import { checkSchema } from 'express-validator';
import connection from '../db/configMysql.js';
import passwordhandler from '../utils/password.js';


let userMiddlewares = {
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
                        throw new Error({ message: USERS_MESSAGES.EMAIL_NOT_FOUND });
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
                options: { min: 2 },
                errorMessage: 'Password must be at least 6 characters long',
            },

            custom: {
                options: async (value, { req }) => {
                    const user = req.user;
                    
                    if (!user) {
                        throw new Error({ message: USERS_MESSAGES.EMAIL_NOT_FOUND });
                    }
                    const password = user.password;

                    const isMatch = await passwordhandler.comparePassword(value, password);
                    
                    if (!isMatch) {
                        throw new Error({ message: USERS_MESSAGES.PASSWORD_NOT_MATCH });
                    }
                    
                    return true;
                },
            },
        },
    }, ['body'])),
}



export default userMiddlewares;



