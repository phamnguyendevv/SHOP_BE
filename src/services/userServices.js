import UserModel from "../models/userModel.js";
import Connection from "../db/configMysql.js";
import mysql from "mysql2";

let userServices = {
  getList: async (data) => {
    try {
      const { pagingParams, filterParams } = data;
      const { orderBy, keyword, pageIndex, pageSize, isPaging } = pagingParams;
      // const { user_id } = filterParams;

      const page = Math.max(0, parseInt(pageIndex) - 1 || 0);
      const limit = parseInt(pageSize) || 20;

      let whereConditions = [];
      let queryParams = [];

      // if (user_id && Array.isArray(user_id) && user_id.length > 0) {
      //   whereConditions.push("id IN (?)");
      //   queryParams.push(user_id);
      // }

      if (keyword) {
        whereConditions.push("full_name LIKE ?");
        queryParams.push(`%${keyword}%`);
      }

      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : "";

      // Sử dụng SQL_CALC_FOUND_ROWS để lấy tổng số bản ghi hiệu quả
      let query = `SELECT SQL_CALC_FOUND_ROWS * FROM user ${whereClause}`;

      if (orderBy) {
        query += ` ORDER BY ${mysql.escapeId(orderBy)}`;
      }

      if (isPaging) {
        query += " LIMIT ? OFFSET ?";
        queryParams.push(limit, page * limit);
      }

      // Thực hiện truy vấn chính
      const rows = await Connection.query(query, queryParams);

      // Lấy tổng số bản ghi
      const totalResult = await Connection.query(
        "SELECT FOUND_ROWS() as total"
      );
      const total = totalResult[0].total;

      const totalPages = Math.ceil(total / limit);

      const meta = {
        total,
        totalPage: totalPages,
      };

      return { data: rows, meta };
    } catch (error) {
      throw new Error(`Không lấy được danh sách: ${error.message}`);
    }
  },
  getUserById: async (id) => {
    const user = await UserModel.getUserByField("id", id);
    const { password, created_at, updated_at, ...usercustom } = user;
    return usercustom;
  },
  updateUser: async (data) => {
    const result = await UserModel.updateUser(data);
    return result;
  },
};

export default userServices;
