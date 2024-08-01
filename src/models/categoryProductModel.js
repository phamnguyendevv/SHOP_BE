import ErrorWithStatus from "../utils/error.js";
import CategoryModel from "./categoryModel.js";

let categoryProductModel = {
  getRelationshipByProductIdAndCategoryId: async (
    connection,
    productId,
    categoryId
  ) => {
    try {
      const [rows, fields] = await connection.execute(
        "SELECT * FROM products_categories WHERE product_id = ? AND category_id = ?",
        [productId, categoryId]
      );
      return rows[0];
    } catch (error) {
      throw new Error("Không lấy được danh mục sản phẩm");
    }
  },

  getCategoriesByProductId: async (connection, productId) => {
    let query = `SELECT c.* FROM categories c JOIN products_categories pc ON c.id = pc.category_id WHERE pc.product_id = ?`;
    try {
      const [rows, fields] = await connection.query(query, [productId]);
      return rows;
    } catch (error) {
      throw new Error("Không lấy được danh mục sản phẩm");
    }
  },
  //----------------------------- product category ------------------------------
  addProductCategory: async (connection, productId, categoryId) => {
    try {
      const query = `INSERT INTO products_categories (product_id, category_id) VALUES (?, ?)`;
      console.log(`productId: ${productId}, categoryId: ${categoryId}`);
      const [result] = await connection.query(query, [productId, categoryId]);
      console.log("result", result);
      return result;
    } catch (error) {
      throw new Error("Không thêm được danh mục sản phẩm");
    }
  },
  updateProductCategories: async (transaction, productId, newCategories) => {
    const existingCategories =
      await categoryProductModel.getCategoriesByProductId(
        transaction,
        productId
      );

    const categoriesToAdd = newCategories.filter(
      (newCat) =>
        !existingCategories.some((existingCat) => existingCat.id === newCat)
    );
    const categoriesToRemove = existingCategories.filter(
      (existingCat) => !newCategories.includes(existingCat.id)
    );

    await Promise.all([
      ...categoriesToRemove.map((cat) =>
        categoryProductModel.removeProductCategory(
          transaction,
          productId,
          cat.id
        )
      ),
      ...categoriesToAdd.map(async (catId) => {
        const category = await CategoryModel.getCategoryByField(
          transaction,
          "id",
          catId
        );
        if (!category) throw new Error("Không tìm thấy danh mục sản phẩm");
        return categoryProductModel.addProductCategory(
          transaction,
          productId,
          catId
        );
      }),
    ]);
  },

  removeProductCategory: async (connection, productId, categoryId) => {
    try {
      const query = `DELETE FROM products_categories WHERE product_id = ? AND category_id = ?`;
      const [result] = await connection.query(query, [productId, categoryId]);
      return result;
    } catch (error) {
      throw new Error("Không xóa được danh mục sản phẩm");
    }
  },
  removeProductCategoryByProductId: async (connection, productId) => {
    try {
      const query = `DELETE FROM products_categories WHERE product_id = ?`;
      const [result] = await connection.query(query, [productId]);
      return result;
    } catch (error) {
      throw new Error("Không xóa được danh mục sản phẩm");
    }
  },
};

export default categoryProductModel;
