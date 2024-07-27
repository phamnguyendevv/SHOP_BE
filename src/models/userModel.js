let UserModel = {
  getUserByEmail: async (connection, email) => {
    const [rows, fields] = await connection.execute(
      `SELECT * FROM user WHERE email = ?`,
      [email]
    );

    return rows[0];
  },

  getUserById: async (connection, id) => {
    const [rows, fields] = await connection.execute(
      `SELECT * FROM user WHERE id = ?`,
      [id]
    );
    return rows[0];
  },
  getUserByFullname: async (connection, fullname) => {
    const [rows, fields] = await connection.execute(
      `SELECT * FROM user WHERE full_name = ?`,
      [fullname]
    );

    return rows[0];
  },
  getProductByField: async (connection, field, value) => {
    const query = `SELECT * FROM \`user\` WHERE ${field} = ?`;
    const [rows, fields] = await connection.execute(query, [value]);
    return rows[0];
  },

  createUser: async (connection, data, hashed, code) => {
    try {
      const [rows, fields] = await connection.execute(
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
                2,  -- Assuming this is a constant value for role_id
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
          code,
        ]
      );
      const user = await UserModel.getUserByEmail(connection, data.email);
      return user;
    } catch (error) {
      throw new Error("Không thêm được user");
    }
  },
  createUserAdmin: async (connection, data, hashed, code) => {
    try {
      console.log(data);
      const [rows, fields] = await connection.execute(
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
          code,
        ]
      );
      const user = await UserModel.getUserByEmail(connection, data.email);
      return user;
    } catch (error) {
      throw new Error("Không thêm được user");
    }
  },

  findAndUpdatePassword: async (connection, hashedPassword, email) => {
    try {
    
      const [rows, fields] = await connection.execute(
        `UPDATE user SET password = ? WHERE email = ?`,
        [hashedPassword, email]
      );
      return rows;

    } catch (error) {
      throw new Error("Không cập nhật được mật khẩu");
    }
  
  },
  updateUser: async (connection, data) => {
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
      if (data.fullname !== undefined) {
        fieldsToUpdate.push("fullname = ?");
        params.push(data.fullname);
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
      if (data.sex !== undefined) {
        fieldsToUpdate.push("sex = ?");
        params.push(data.sex);
      }

      if (fieldsToUpdate.length === 0) {
        throw new Error("Không có trường nào được cập nhật");
      }

      params.push(data.id);

      const fieldsToUpdateString = fieldsToUpdate.join(", ");

      const query = `UPDATE user SET ${fieldsToUpdateString}, updated_at = CURRENT_DATE WHERE id = ?`;

      const result = await connection.execute(query, params);
    } catch (error) {
      throw new Error("Không cập nhật được user");
    }

    return result;
  },
};

export default UserModel;
