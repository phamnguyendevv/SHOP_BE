import connection from '../db/configMysql.js';
import UserModel from '../models/userModel.js';
import password from '../utils/password.js';
import { generateToken, refreshTokens, getTokenExpiration } from '../utils/jwt.js';
import ErrorWithStatus from '../utils/error.js';
import USERS_MESSAGES from '../constants/messages.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import crypto from 'crypto';
import { check } from 'express-validator';
import TokenModel from '../models/tokenModel.js';
import { Console } from 'console';

let AuthService = {

  register: async (data) => {
    const code = crypto
      .randomBytes(10)
      .toString("hex")
      .slice(0, 5)
      .toUpperCase();

    const hashed = await password.hashPassword(data.password);

    const userNew = await UserModel.createUser(connection, data, hashed);

    const newReferralCode = `${userNew.id}${code}`;
    console.log(newReferralCode);
    userNew.referralCode = newReferralCode;
    await UserModel.updateUserReferralCode(connection, newReferralCode, userNew.id);


    return userNew;

  },

  //login
  login: async (data) => {
    const { email } = data;
    const user = await UserModel.getUserByEmail(connection, email);
    const { password, created_at, updated_at, ...usercustom } = user;
    const accessToken = await generateToken(user);
    const refreshToken = await refreshTokens(user);

    const exp = await getTokenExpiration(accessToken);

    const Token = await TokenModel.updateTokens(connection, user.id, accessToken, refreshToken, exp);


    return { usercustom, Token };

  },


  auth: async (data) => {
    const { accessToken, refreshToken } = data;
    const user = await UserModel.getUserByToken(connection, accessToken, refreshToken);
    const token = await TokenModel.getToken(connection, accessToken, refreshToken);

    if (user) {
      return { user, token };
    }
    throw new Error(USERS_MESSAGES.AUTH_FAIL);
  },



  refreshToken: async (data) => {
    const { accessToken, refreshToken } = data;
    const user = await UserModel.getUserByToken(connection, accessToken, refreshToken);

    if (user) {
      const newAccessToken = await generateToken(user);
      const exp = await getTokenExpiration(newAccessToken);

      const Token = await TokenModel.updateAccessToken(connection, user.id, newAccessToken, exp);
      const tokenupdated = Token.accessToken
      const tokenNew = await TokenModel.getToken(connection, tokenupdated, refreshToken);
      return { user, tokenNew };
    }
    throw new Error(USERS_MESSAGES.AUTH_FAIL);
  },

  changePassword: async (data) => {
    const { newPassword, username } = data
    const hashedPassword = await password.hashPassword(newPassword)
    const result = UserModel.findAndUpdatePassword(connection, hashedPassword, username)
    if (!result) {

      throw new Error(USERS_MESSAGES.CHANGE_PASSWORD_FAILED)
    }
  },
  confirmPassword: async (data) =>{


    

    user.password = password_new
    user.confirm_password = confirm_password_new
    user.forgot_password_token = undefined
    user.save({validateBeforeSave:false})
    user.updatedAt = undefined

    return {
        messages: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS,
    }
  }
}

export default AuthService;



