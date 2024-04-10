import connection from '../db/configMysql.js';
import ErrorWithStatus from '../utils/error.js';
import USERS_MESSAGES from '../constants/messages.js';
import HTTP_STATUS from '../constants/httpStatus.js';

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
        if (rows.length === 0) {
            throw new Error('Không tìm thấy user');
        }
        return rows[0];
    },
    getUserByUsername: async (connection, username) => {
        const [rows, fields] = await connection.execute(
            `SELECT * FROM user WHERE username = ?`,
            [username]
        );

        return rows[0];
    },
    getUserByToken: async (connection, accessToken, refreshToken) => {

        const [rows, fields] = await connection.execute(
            `SELECT u.id AS id, u.email, u.username, u.phone, u.birthday, u.sex ,u.role_id, u.status_id, u.balance, u.isOnline, u.qrcode, u.referrer_id, u.avatar, u.points, u.offlineAt, u.referral_code

            FROM user u JOIN token t ON u.id = t.user_id  WHERE t.accessToken = ? AND t.refreshToken = ?;`,
            [accessToken, refreshToken]
        );

        if (rows.length === 0) {
            throw new Error('Không tìm thấy user');
        }
        return rows[0];
    },






    createUser: async (connection, data, hashedPassword) => {
        const user = await connection.execute(
            `
            INSERT INTO user (
                email,
                status_id,
                password,
                role_id,
                phone,
                balance,
                birthday,
                isOnline,
                qrcode,
                referrer_id,
                username,
                avatar,
                points,
                sex,
                offlineAt,
                referral_code,
                token_id,
                created_at,
                updated_at
            ) VALUES (
                ?,
                2,
                ?,
                1,
                ?,
                0,
                ?,
                TRUE,
                "",
                0,
                ?,
                "",
                0,
                ?,
                NULL,
                "",
                0,
                CURRENT_DATE, 
                CURRENT_DATE
            )`,
            [
                data.email,
                hashedPassword,
                data.phone,
                data.birthday,
                data.username,
                data.sex
            ]


        );
        // Nếu không có lỗi, trả về thông tin người dùng vừa được tạo
        const [rows, fields] = await connection.execute(
            `SELECT * FROM user WHERE email = ?`,
            [data.email]
        );
        if (rows.length === 0) {
            throw new Error('Không tạo được user');
        }

        // Trả về thông tin người dùng đầu tiên trong mảng rows (do có thể có nhiều người dùng có cùng email)
        return rows[0];

    },

    updateUserReferralCode: async (connection, referralCode, userId) => {
        try {

            return await connection.execute('UPDATE `user` SET referral_code = ? WHERE id = ?', [referralCode, userId]);
        } catch (error) {
            throw new Error('Không cập nhật được mã giới thiệu');
        }
    },


    findAndUpdatePassword: async (connection, hashedPassword, username) => {
        try {
            return await connection.execute(
                `UPDATE user SET password = ? WHERE username = ?`,
                [hashedPassword, username]
            );
        } catch (error) {
            throw new Error('Lỗi khi cập nhật mật khẩu');
        }





    }
}

export default UserModel;






