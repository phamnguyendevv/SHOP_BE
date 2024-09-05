import Connection from "../db/configMysql.js";
import CategoryModel from "../models/categoryModel.js";
import crypto from "crypto";
import getSlug from "speakingurl";

let CategoryService = {
  createSlug: async (name) => {
    const slug = getSlug(name, { lang: "vn" });
    let fullSlug, existingCategory;
    do {
      const randomInt = crypto.randomBytes(4).readUInt32LE();
      fullSlug = `${slug}-${randomInt}`;
      existingCategory = await CategoryModel.getCategoryByField(
        "slug",
        fullSlug
      );
    } while (!existingCategory);
    return fullSlug;
  },

  // add new category
  addCategory: async (data) => {
    try {
      data.slug = await CategoryService.createSlug(data.name);
      const rows = await CategoryModel.addCategory(data);
      return rows;
    } catch (err) {
      throw new Error("Không thêm được danh mục mới");
    }
  },
  getCategoryList: async (data) => {
    try {
      const { pagingParams, filterParams } = data;
      const { keyword, pageIndex, isPaging, pageSize } = pagingParams;
      const { is_popular } = filterParams;

      const page = Math.max(0, parseInt(pageIndex) - 1 || 0);
      const limit = parseInt(pageSize) || 20;

      let queryParams = [];
      let conditions = [];

      if (keyword) {
        conditions.push(`p.name LIKE ?`);
        queryParams.push(`%${keyword}%`);
      }
      if (is_popular === 1) {
        conditions.push(`p.is_popular = 1`);
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const baseQuery = `FROM categories p ${whereClause}`;

      // Use SQL_CALC_FOUND_ROWS to get total count efficiently
      let query = `SELECT SQL_CALC_FOUND_ROWS p.* ${baseQuery}`;

      if (isPaging) {
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, page * limit);
      }

      // Execute main query to get data
      const rows = await Connection.query(query, queryParams);

      // Get total count
      const totalResult = await Connection.query(
        "SELECT FOUND_ROWS() as total"
      );
      const total = totalResult[0].total;

      // Calculate total pages
      const totalPages = Math.ceil(total / limit);

      const meta = {
        total,
        totalPage: totalPages,
      };

      return { data: rows, meta };
    } catch (error) {
      throw new Error("Không lấy được danh mục: " + error.message);
    }
  },

  //update category
  updateCategory: async (data) => {
    try {
      const result = await CategoryModel.updateCategory(data);
    } catch (error) {
      throw new Error("Không cập nhật được danh mục");
    }
  },

  //deleteCategory
  deleteCategory: async (id) => {
    try {
      const result = await CategoryModel.deleteCategory(id);
      return result;
    } catch (error) {
      // Xử lý lỗi ở đây
      throw new Error("Không xóa được danh mục");
    }
  },
};

export default CategoryService;
