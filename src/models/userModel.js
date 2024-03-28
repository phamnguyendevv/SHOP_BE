import connection from '../db/configMysql.js';

let UserModel = {
    getUserByEmail: async (connection, email) => {
        try {
            const user = await connection.execute('SELECT * FROM `user`  LIMIT 1;', [email]);
           
            return user[0][0];
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Error in getUserByEmail:', error);
            throw error;
        }
    },

    createUser: async (connection, data, hashedPassword) => {
        try {
            await connection.execute(
                `
                INSERT INTO user (
                    email,
                    status_id,
                    password,
                    role_id,
                    phone,
                    balance,
                    birthday,
                    firstName,
                    isOnline,
                    lastName,
                    referrer_id,
                    username,
                    avatar,
                    points,
                    sex,
                    offlineAt,
                    referral_code,
                    created_at,
                    updated_at
                ) VALUES (
                    ?,
                    1,
                    ?,
                    2,
                    ?,
                    0,
                    ?,
                    ?,
                    TRUE,
                    ?,
                    0,
                    ?,
                    "",
                    0,
                    ?,
                    NULL,
                    "",
                    CURRENT_DATE, 
                    CURRENT_DATE
                )`,
                [
                    data.email,
                    hashedPassword,
                    data.phone,
                    data.birthday,
                    data.firstName,
                    data.lastName,
                    data.username,
                    data.sex
                ]
            );
            // Nếu không có lỗi, trả về thông tin người dùng vừa được tạo
            const [rows, fields] = await connection.execute(
                `SELECT * FROM user WHERE email = ?`,
                [data.email]
            );
            // Trả về thông tin người dùng đầu tiên trong mảng rows (do có thể có nhiều người dùng có cùng email)
            return rows[0];
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Error in createUser:', error);
            throw error;
        }
    },
    
    updateUserReferralCode: async (connection, referralCode, userId) => {
        try {
            return await connection.execute('UPDATE `user` SET referralCode = ? WHERE id = ?', [referralCode, userId]);
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Error in updateUserReferralCode:', error);
            throw error;
        }
    }
};

export default UserModel;






