import UserModel from "../models/userModel.js";
import Connection from '../db/configMysql.js';
const connection = await Connection();



let userServices = {
    getList: async (data) => {
        const { pagingParams, filterParams } = data;
        const { orderBy, keyword, pageIndex, pageSize } = pagingParams;
        const { user_id } = filterParams;

        const page = (parseInt(pageIndex) || 1) - 1;
        const limit = parseInt(pageSize) || 20; // Giới hạn mặc định là 20

        // Tạo câu truy vấn SQL để tính tổng số lượng bản ghi
        let sql = `SELECT COUNT(*) AS total FROM user`;

        if (user_id && user_id.length > 0) {
            sql += ` WHERE id IN (${user_id.join(',')})`;
        }

        if (keyword) {
            if (user_id && user_id.length > 0) {
                sql += ` AND full_name LIKE '%${keyword}%'`;
            } else {
                sql += ` WHERE full_name LIKE '%${keyword}%'`;
            }
        }
        const [totalRows] = await connection.query(sql);
        const total = totalRows[0].total;

        const totalPages = Math.ceil(total / pageSize);

        // Tạo câu truy vấn SQL để lấy dữ liệu phân trang
        let query = `SELECT * FROM user`;

        if (user_id && user_id.length > 0) {
            query += ` WHERE id IN (${user_id.join(',')})`;
        }

        if (keyword) {
            if (user_id && user_id.length > 0) {
                query += ` AND full_name LIKE '%${keyword}%'`;
            } else {
                query += ` WHERE full_name LIKE '%${keyword}%'`;
            }
        }

        if (orderBy) {
            query += ` ORDER BY ${orderBy}`;
        }

        query += ` LIMIT ${limit} OFFSET ${page * limit}`;

        // Thực hiện truy vấn SQL để lấy dữ liệu phân trang
        const [rows, fields] = await connection.query(query);

        const meta = {
            total: total,
            totalPage: totalPages
        };

        return { data: rows, meta: meta };
    },
    getUserById: async (id) => {
        const user  = await UserModel.getUserById(connection, id);
        const { password, created_at, updated_at, ...usercustom } = user;
        return usercustom
    },
    updateUser: async (data) => {

        const result = await UserModel.updateUser(connection, data);
        return result
    },
  

}


export default userServices;



