import ErrorWithStatus from "../utils/error.js";
import CategoryModel from "./categoryModel.js";
import Connection from "../db/configMysql.js";

let categoryProductModel = {
  getRelationshipByProductIdAndCategoryId: async (
    productId,
    categoryId
  ) => {
    try {
      const rows = await Connection.execute(
        "SELECT * FROM products_categories WHERE product_id = ? AND category_id = ?",
        [productId, categoryId]
      );
      return rows[0];
    } catch (error) {
      throw new Error("Không lấy được danh mục sản phẩm");
    }
  },

  getCategoriesByProductId: async ( productId) => {
    let query = `SELECT c.* FROM categories c JOIN products_categories pc ON c.id = pc.category_id WHERE pc.product_id = ?`;
    try {
      const rows = await Connection.query(query, [productId]);
      return rows;
    } catch (error) {
      throw new Error("Không lấy được danh mục sản phẩm");
    }
  },
  //----------------------------- product category ------------------------------
  addProductCategory: async (productId, categoryId) => {
    try {
      const query = `INSERT INTO products_categories (product_id, category_id) VALUES (?, ?)`;
      const result = await Connection.query(query, [productId, categoryId]);
      return result;
    } catch (error) {
      throw new Error("Không thêm được danh mục sản phẩm");
    }
  },
  

  removeProductCategory: async ( productId, categoryId) => {
    try {
      const query = `DELETE FROM products_categories WHERE product_id = ? AND category_id = ?`;
      const result = await Connection.query(query, [productId, categoryId]);
      return result;
    } catch (error) {
      throw new Error("Không xóa được danh mục sản phẩm");
    }
  },
  removeProductCategoryByProductId: async (productId) => {
    try {
      const query = `DELETE FROM products_categories WHERE product_id = ?`;
      const result = await Connection.query(query, [productId]);
      return result;
    } catch (error) {
      throw new Error("Không xóa được danh mục sản phẩm");
    }
  },
};

export default categoryProductModel;
