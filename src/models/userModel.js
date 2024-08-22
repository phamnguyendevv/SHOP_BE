import Connection from "../db/configMysql.js";

let UserModel = {
  getUserByField: async (field, value) => {
    console.log(field, value);
    const query = `SELECT * FROM \`user\` WHERE ${field} = ?`;
    const results = await Connection.execute(query, [value]);
    return results[0];
  },
  getUserByFields: async (field, values) => {
    const query = `SELECT * FROM \`user\` WHERE ${field}`;
    const results = await Connection.execute(query, values);
    return results[0];
  },
  

  createUser: async (data, hashed) => {
    try {
      const rows = await Connection.execute(
        `
            INSERT INTO user (
                email,
                full_name,
                password,
                qr_admin,
                status_id,
                role_id,
                balance,
                referrer_id,
                referral_code,
                created_at,
                updated_at
            ) VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                2,  -- Assuming this is a constant value for role_id
                0,  -- Assuming this is a constant value for balance
                ?,  -- Referrer id
                ?,  -- Referral code
                CURRENT_DATE,
                CURRENT_DATE
            )`,
        [
          data.email,
          data.full_name,
          hashed,
          data.qr_admin,
          data.status_id || 1,
          data.referrer_id || null,
          data.referral_code,
        ]
      );
      const user = await UserModel.getUserByField("email", data.email);
      return user;
    } catch (error) {
      throw new Error("Không thêm được user");
    }
  },
  createUserAdmin: async (data, hashed, code) => {
    try {
      console.log(data);
      const rows = await Connection.execute(
        `
            INSERT INTO user (
                email,
                full_name,
                password,
                qr_admin,
                status_id,
                role_id,
                balance,
                referral_code,
                created_at,
                updated_at
            ) VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,  -- Assuming this is a constant value for role_id
                0,  -- Assuming this is a constant value for balance
                ?,  -- Referral code
                CURRENT_DATE,
                CURRENT_DATE
            )`,
        [
          data.email,
          data.full_name,
          hashed,
          data.qr_admin,
          data.status_id || 1,
          data.role_id,
          data.referral_code,
        ]
      );
      const user = await UserModel.getUserByField("email", data.email);
      return user;
    } catch (error) {
      throw new Error("Không thêm được user");
    }
  },
  updateUserReferralCode: async (id, referral_code) => {
    const results = await Connection.execute(
      `UPDATE user SET referral_code = ? WHERE id = ?`,
      [referral_code, id]
    );
    return results;
  },

  findAndUpdatePassword: async (hashedPassword, id) => {
    try {
      const results = await Connection.execute(
        `UPDATE user SET password = ? WHERE id = ?`,
        [hashedPassword, id]
      );
      return results;
    } catch (error) {
      throw new Error("Không cập nhật được mật khẩu");
    }
  },
  updateUser: async (data) => {
    try {
      const fieldsToUpdate = [];
      const params = [];

      if (data.status_id !== undefined) {
        fieldsToUpdate.push("status_id = ?");
        params.push(data.status_id);
      }
      if (data.role_id !== undefined) {
        fieldsToUpdate.push("role_id = ?");
        params.push(data.role_id);
      }
      if (data.avatar !== undefined) {
        fieldsToUpdate.push("avatar = ?");
        params.push(data.avatar);
      }
      if (data.full_name !== undefined) {
        fieldsToUpdate.push("full_name = ?");
        params.push(data.full_name);
      }
      if (data.username !== undefined) {
        fieldsToUpdate.push("username = ?");
        params.push(data.username);
      }
      if (data.avatar !== undefined) {
        fieldsToUpdate.push("avatar = ?");
        params.push(data.avatar);
      }
      if (data.phone !== undefined) {
        fieldsToUpdate.push("phone = ?");
        params.push(data.phone);
      }
      if (data.birthday !== undefined) {
        fieldsToUpdate.push("birthday = ?");
        params.push(data.birthday);
      }
      if (data.referral_code !== undefined) {
        fieldsToUpdate.push("referral_code = ?");
        params.push(data.referral_code);
      }
      if (data.sex !== undefined) {
        fieldsToUpdate.push("sex = ?");
        params.push(data.sex);
      }
      if (data.balance !== undefined) {
        fieldsToUpdate.push("balance = ?");
        params.push(data.balance);
      }

      if (fieldsToUpdate.length === 0) {
        throw new Error("Không có trường nào được cập nhật");
      }

      params.push(data.id);

      const fieldsToUpdateString = fieldsToUpdate.join(", ");

      const query = `UPDATE user SET ${fieldsToUpdateString}, updated_at = CURRENT_DATE WHERE id = ?`;

      const result = await Connection.execute(query, params);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Không cập nhật được user");
    }
  },
};

export default UserModel;
