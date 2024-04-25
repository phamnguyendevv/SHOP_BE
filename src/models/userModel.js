
import ErrorWithStatus from '../utils/error.js';
import USERS_MESSAGES from '../constants/messages.js';
import HTTP_STATUS from '../constants/httpStatus.js';

let UserModel = {
    getUserByEmail: async (connection, email) => {
        const [rows, fields]= await connection.execute(
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
    getUserByFullname: async (connection, fullname) => {
        const [rows, fields] = await connection.execute(
            `SELECT * FROM user WHERE fullname = ?`,
            [fullname]
        );

        return rows[0];
    },






    createUser: async (connection, data, hashed) => {
        const user = await connection.execute(
            `
            INSERT INTO user (
                email,
                fullname,
                password,
                qr_admin,
                status_id,
                role_id,
                balance,
                created_at,
                updated_at
            ) VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                2,
                0,
                CURRENT_DATE, 
                CURRENT_DATE
            )`,
            [
                data.email,
                data.fullname,
                hashed,
                data.qr_admin,
                data.status_id  || 1  
            ]


        );
        // Nếu không có lỗi, trả về thông tin người dùng vừa được tạo
        const [rows] = await connection.execute(
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
           const result =  await connection.execute('UPDATE `user` SET referral_code = ? WHERE id = ?', [referralCode, userId]);
           if (result[0].affectedRows === 0) {
               throw new Error('Không cập nhật được mã giới thiệu');
           }
           return  result;

    },


    findAndUpdatePassword: async (connection, hashedPassword, email) => {
            const result = await connection.execute(
                `UPDATE user SET password = ? WHERE email = ?`,
                [hashedPassword, email]
            );
            if (result[0].affectedRows === 0) {
                throw new Error('Không cập nhật được mật khẩu');
            }
            return result;
    },
    updateUser: async (connection, data) => {
        const fieldsToUpdate = [];
        const params = [];
    
        if (data.fullname !== undefined) {
            fieldsToUpdate.push('fullname = ?');
            params.push(data.fullname);
        }
        if (data.username !== undefined) {
            fieldsToUpdate.push('username = ?');
            params.push(data.username);
        }
        if (data.avatar !== undefined) {
            fieldsToUpdate.push('avatar = ?');
            params.push(data.avatar);
        }
        if (data.phone !== undefined) {
            fieldsToUpdate.push('phone = ?');
            params.push(data.phone);
        }
        if (data.birthday !== undefined) {
            fieldsToUpdate.push('birthday = ?');
            params.push(data.birthday);
        }
        if (data.sex !== undefined) {
            fieldsToUpdate.push('sex = ?');
            params.push(data.sex);
        }
    
        if (fieldsToUpdate.length === 0) {
            throw new Error('Không có trường nào được cập nhật');
        }
    
        params.push(data.id);
    
        const fieldsToUpdateString = fieldsToUpdate.join(', ');
    
        const query = `UPDATE user SET ${fieldsToUpdateString}, updated_at = CURRENT_DATE WHERE id = ?`;
    
        const result = await connection.execute(query, params);
    
        if (result[0].affectedRows === 0) {
            throw new Error('Không cập nhật được user');
        }
    
        return result;
    },
    deleteUser: async (connection, id) => {
        const result = await connection.execute(
            `DELETE FROM user WHERE id = ?`,
            [id]
        );
        if (result[0].affectedRows === 0) {
            throw new Error('Không xóa được user');
        }
        return result;
    },
    
    
}

export default UserModel;






