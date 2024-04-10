
let TokenModel = {


    getToken: async (connection, accessToken, refreshToken) => {
        try {
            const [rows] = await connection.execute(
                `SELECT accessToken, refreshToken, exp FROM token WHERE accessToken = ? AND refreshToken = ?`,
                [accessToken, refreshToken]
            );

            if (rows.length === 0) {
                throw new Error('Token không tồn tại');
            }

            console.log("Thông tin token:", rows[0]);
            return rows[0];
        } catch (error) {
            console.error("Lỗi khi lấy thông tin token:", error);
            throw error;
        }
    },



    updateTokens: async (connection, userId, newAccessToken, newRefreshToken, exp) => {
        try {
            let tokenInfo;

            // Kiểm tra xem user_id đã tồn tại trong bảng token chưa
            const [tokenRows] = await connection.execute(
                `SELECT id FROM token WHERE user_id = ?`,
                [userId]
            );

            if (tokenRows.length > 0) {
                // Nếu user_id đã tồn tại trong bảng token, thực hiện cập nhật thông tin
                await connection.execute(
                    `UPDATE token SET accessToken = ?, refreshToken = ?, exp = ?  ,created_at = CURRENT_DATE ,updated_at = CURRENT_DATE  WHERE user_id = ?`,
                    [newAccessToken, newRefreshToken, exp, userId]
                );
            } else {
                // Nếu user_id chưa tồn tại trong bảng token, tạo mới một dòng dữ liệu
                await connection.execute(
                    `INSERT INTO token (user_id, accessToken, refreshToken, exp, created_at =CURRENT_DATE ,updated_at =CURRENT_DATE ) VALUES (?, ?, ?, ?)`,
                    [userId, newAccessToken, newRefreshToken, exp]
                );
            }

            // Lấy thông tin token mới sau khi đã cập nhật hoặc thêm mới
            const [updatedTokenRows] = await connection.execute(
                `SELECT * FROM token WHERE user_id = ?`,
                [userId]
            );

            if (updatedTokenRows.length > 0) {


                const { id, user_id, created_at, updated_at, ...token } = updatedTokenRows[0];
                // Lưu trữ thông tin token
                tokenInfo = token;
            }

            // Thực hiện cập nhật thông tin token mới trong bảng user
            await connection.execute(
                `UPDATE user SET token_id = ? WHERE id = ?`,
                [updatedTokenRows[0].id, userId]
            );

            console.log("Tokens updated successfully for user with id:", userId);

            // Trả về thông tin token đã được thêm mới hoặc cập nhật
            return tokenInfo;
        } catch (error) {
            console.error("Error updating tokens:", error);
            throw error;
        }
    },


    updateAccessToken: async (connection, userId, newAccessToken, exp) => {
        try {
            // Thực hiện cập nhật accessToken và exp trong bảng token
            await connection.execute(
                `UPDATE token SET accessToken = ?, exp = ?, created_at = CURRENT_DATE, updated_at = CURRENT_DATE WHERE user_id = ?`,
                [newAccessToken, exp, userId]
            );

            // Thực hiện truy vấn để lấy thông tin cập nhật mới nhất từ bảng token
            const [updatedTokenRows] = await connection.execute(
                `SELECT * FROM token WHERE user_id = ?`,
                [userId]
            );

            console.log(updatedTokenRows[0])
            return updatedTokenRows[0]; // Trả về dòng dữ liệu được cập nhật
        } catch (error) {
            console.error("Error updating tokens:", error);
            throw error;
        }
    }




}

export default TokenModel;

