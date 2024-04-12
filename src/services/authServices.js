import connection from '../db/configMysql.js';
import UserModel from '../models/userModel.js';
import password from '../utils/password.js';
import { generateToken, refreshTokens, decoToken } from '../utils/jwt.js';
import USERS_MESSAGES from '../constants/messages.js';
import crypto from 'crypto';



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

    const decod = await decoToken(accessToken);
    const exp = await decod.exp;

    const Token = {accessToken,refreshToken,exp}


    return { usercustom, Token };

  },


  auth: async (data) => {
    const { accessToken, refreshToken } = data;
    const decod = await decoToken(accessToken);
    const user = await UserModel.getUserById(connection, decod.id);
    const { password, created_at, updated_at, ...usercustom } = user;
    const newaccessToken = await generateToken(user);
    const exp = await decod.exp;
    const Token = {accessToken:newaccessToken,refreshToken,exp}
    return { usercustom, Token };
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



