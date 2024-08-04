import TechnologyModel from "../models/technologyModel.js";
import Connection from "../db/configMysql.js";

let TechnologyService = {
  // add new Technology
  addTechnology: async (data) => {
    try {
      console.log(data);
      const rows = await TechnologyModel.addTechnology(data);
      return rows;
    } catch (err) {
      throw new Error("Không thêm được danh mục mới");
    }
  },
  getTechnologyList: async (data) => {
    try {
      const { pagingParams, filterParams } = data;
      const { keyword, pageIndex, isPaging, pageSize } = pagingParams;
      const { category_id } = filterParams;

      const page = Math.max(0, parseInt(pageIndex) - 1 || 0);
      const limit = parseInt(pageSize) || 20;

      let conditions = [];
      let queryParams = [];

      if (keyword) {
        conditions.push("t.name LIKE ?");
        queryParams.push(`%${keyword}%`);
      }

      if (category_id) {
        conditions.push("t.category_id = ?");
        queryParams.push(category_id);
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      // Sử dụng SQL_CALC_FOUND_ROWS để lấy tổng số bản ghi hiệu quả
      let query = `SELECT SQL_CALC_FOUND_ROWS t.* FROM technologies t ${whereClause}`;

      if (isPaging) {
        query += " LIMIT ? OFFSET ?";
        queryParams.push(limit, page * limit);
      }
      console.log(query);
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
      throw new Error(`Không lấy được công nghệ`);
    }
  },
  //update Technology
  updateTechnology: async (data) => {
    try {
      const result = await TechnologyModel.updateTechnology(data);
    } catch (error) {
      throw new Error("Không cập nhật được danh mục");
    }
  },

  //deleteTechnology
  deleteTechnology: async (id) => {
    try {
      const result = await TechnologyModel.deleteTechnology(id);
      return result;
    } catch (error) {
      // Xử lý lỗi ở đây
      throw new Error("Không xóa được danh mục");
    }
  },
};

export default TechnologyService;
