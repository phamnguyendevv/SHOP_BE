import TechnologyModel from "../models/technologyModel.js";
import Connection from "../db/configMysql.js";
const connection = await Connection();

let TechnologyService = {
  // add new Technology
  addTechnology: async (data) => {
    try {
      console.log(data);
      const rows = await TechnologyModel.addTechnology(connection, data);
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
      // Construct the SQL query
      let query = `SELECT t.* FROM technologies t `;
      let conditions = [];
      let joins = [];
      if (keyword) {
        conditions.push(`t.name LIKE '%${keyword}%'`);
      }

      if (category_id) {
        conditions.push(`t.category_id = ${category_id}`);
      }
      // Combine joins and conditions
      if (joins.length > 0) {
        query += joins.join(" ");
      }
      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      // Apply paging
      if (isPaging) {
        const offset = (pageIndex - 1) * pageSize;
        query += ` LIMIT ${pageSize} OFFSET ${offset}`;
      }

      const totalCountQuery =
        `SELECT COUNT(DISTINCT t.id) as totalCount FROM technologies t ` +
        (joins.length > 0 ? joins.join(" ") : "") +
        (conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "");

      const [totalCountRows, totalCountFields] = await connection.query(
        totalCountQuery
      );
      const totalCount = totalCountRows[0].totalCount;

      // Calculate total pages
      const totalPage = Math.ceil(totalCount / pageSize);

      // Execute main query to get data
      const [rows, fields] = await connection.query(query);

      return { data: rows, meta: { total: totalCount, totalPage: totalPage } };
    } catch (error) {
      throw new Error("Không lấy được công nghệ");
    }
  },

  //update Technology
  updateTechnology: async (Technology) => {
    try {
      const result = await TechnologyModel.updateTechnology(
        connection,
        Technology
      );
    } catch (error) {
      throw new Error("Không cập nhật được danh mục");
    }
  },

  //deleteTechnology
  deleteTechnology: async (id) => {
    try {
      const result = await TechnologyModel.deleteTechnology(connection, id);
      return result;
    } catch (error) {
      // Xử lý lỗi ở đây
      throw new Error("Không xóa được danh mục");
    }
  },
};

export default TechnologyService;
