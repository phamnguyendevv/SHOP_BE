import ErrorWithStatus from "../utils/error.js";

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
    const [rows, fields] = await connection.execute(
      "SELECT c.* FROM categories c JOIN products_categories pc ON c.id = pc.category_id WHERE pc.product_id = ?",
      [productId]
    );
    return rows;
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
  removeProductCategory: async (connection, productId, categoryId) => {
    console.log("productId", productId);
    console.log("categoryId", categoryId);
    const fieldsToUpdate = [];
    const params = [];

    if (productId !== undefined) {
      fieldsToUpdate.push("product_id = ?");
      params.push(productId);
    }
    if (categoryId !== undefined) {
      fieldsToUpdate.push("category_id = ?");
      params.push(categoryId);
    }
    const fieldsToUpdateString = fieldsToUpdate.join(", ");
    const query = `DELETE FROM products_categories WHERE ${fieldsToUpdateString}`;
    const [result] = await connection.query(query, params);

    return result;
  },
};

export default categoryProductModel;
