import connection from '../db/configMysql.js';
import UserModel from '../models/userModel.js';
import password from '../utils/password.js';
import crypto from 'crypto';
let AuthService = {
  
  register: async (data) => {
    try {
      const code = crypto
        .randomBytes(10)
        .toString("hex")
        .slice(0, 5)
        .toUpperCase();

      const hashed = await password.hashPassword(data.password);
      const userNew = await UserModel.createUser(connection, data, hashed);


      if (userNew) {
        const newReferralCode = `${userNew.id}${code}`;
        userNew.referralCode = newReferralCode;
        await UserModel.updateUserReferralCode(connection, newReferralCode, userNew.id);
      }
      return userNew;
    } catch (e) {
      // Xử lý lỗi ở đây
      console.error('Error in register:', e);
      throw e;
    }
  },

  //login
  login: async (user_id, body) => {
    try {
     //gen cokeeee ở đây
    
    } catch (e) {
      // Xử lý lỗi ở đây
      console.error('Error in login:', e);
      throw e;
    }
  }
}

export default AuthService;





