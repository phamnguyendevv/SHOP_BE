
import UserModel from '../models/userModel.js';
import password from '../utils/password.js';
import { generateToken, refreshTokens, decoToken } from '../utils/jwt.js';
import USERS_MESSAGES from '../constants/messages.js';
import Connection from '../db/configMysql.js';
import { sendEmail } from '../utils/email.js';
const connection = await Connection();

import axios from 'axios';
import crypto from 'crypto';
const code = crypto
  .randomBytes(10)
  .toString("hex")
  .slice(0, 5)
  .toUpperCase();
const tempCodes = {};

let AuthService = {

  register: async (data) => {

    const hashed = await password.hashPassword(data.password);
    const referral_code = `${data.id}${code}`;
    const user = await UserModel.createUser(connection, data, hashed, code);
    if (!user) {
      throw new Error(USERS_MESSAGES.REGISTER_FAILED)
    }

  },

  //login
  login: async (user) => {
    const { password, created_at, updated_at, ...usercustom } = user;

    const accessToken = await generateToken(user);
    const refreshToken = await refreshTokens(user);
    const decod = await decoToken(accessToken);
    const exp = decod.exp;
    const Token = { accessToken, refreshToken, exp }
    return { usercustom, Token };

  },

  refreshToken: async (data) => {
    const { refreshToken } = data;
    const decod = await decoToken(refreshToken);
    const user = await UserModel.getUserById(connection, decod.id);
    const { password, created_at, updated_at, ...usercustom } = user;
    const newaccessToken = await generateToken(user);
    const expNewaccessToken = await decoToken(newaccessToken);
    const exp = expNewaccessToken.exp;
    const Token = { accessToken: newaccessToken, refreshToken, exp }
    return { usercustom, Token };
  },

  forgotPassword: async (user) => {
    const email = user.email;
    const code_verify = `${user.id}${code}`
    tempCodes[email] = code_verify;

    try {
      await sendEmail(email, 'Gửi mã Xác nhận', 'Mã xác nhận của bạn là: ' + code_verify + '');
      console.log('Gửi mã xác nhận thành công')
      return { code_verify }
    } catch (error) {
      throw new Error(error);
    }
  },

  resetPassword: async (data) => {
    const { email, code, newPassword } = data;
    if (!email || !code || !newPassword) {
      throw new Error('Vui lòng nhập đầy đủ thông tin')
    }
    if (tempCodes[email] !== code) {
      throw new Error('Mã xác nhận không chính xác')
    }
    delete tempCodes[email];
    const hashedPassword = await password.hashPassword(newPassword);
    const result = UserModel.findAndUpdatePassword(connection, hashedPassword, email);
    if (!result) {
      throw new Error('Cập nhật mật khẩu thất bại')
    }

  },


  Oauth: async (code) => {
    //get token from google 
    try {
      const body = {
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      };
      const response = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams(body), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const { access_token, id_token } = response.data;
      // Get user info from Google
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        params: {
          access_token,
          alt: 'json'
        },
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      const codess = crypto
        .randomBytes(10)
        .toString("hex")
        .slice(0, 5)
        .toUpperCase();
      const { email, name } = data;
      const fullname = name;
      const hashedPassword = await password.hashPassword(crypto.randomBytes(20).toString('hex'));
      const qr_admin = [
        {
          "nameAccout": "admin",
          "nameBank": "Vietcombank",
          "numberAccout": "123456789",
          "qrcode": "https://www.qrcode-monkey.com/qrcode-api/?size=200&data=123456789",
          "money": 1000000
        },
        {
          "nameAccout": "admin",
          "nameBank": "Vietinbank",
          "numberAccout": "123456789",
          "qrcode": "https://www.qrcode-monkey.com/qrcode-api/?size=200&data=123456789",
          "money": 1000000
        }
      ]
      // Check if user exists in the database
      const users = { email, fullname, qr_admin }
      let user = await UserModel.getUserByEmail(connection, email);
      if (!user) {
        // Create a new user
        user = await UserModel.createUser(connection, users, hashedPassword);
        const referralCode = `${user.id}${codess}`;
        const userId = user.id;
        await UserModel.updateUserReferralCode(connection, referralCode, userId);
        return user;
      }
      // Create token pair
      const accessToken = await generateToken(user);
      const refreshToken = await refreshTokens(user);
      return { user, accessToken, refreshToken };
    } catch (error) {
      throw new Error("Không thể đăng nhập bằng Google")
    }
  }
}

export default AuthService;



