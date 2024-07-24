import ErrorWithStatus from "../utils/error.js";

let categoryProductModel = {
  getRelationshipByProductIdAndCategoryId: async (
    connection,
    productId,
    categoryId
  ) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM categories_products WHERE product_id = ? AND category_id = ?",
      [productId, categoryId]
    );
    return rows[0];
  },

  getCategoriesByProductId: async (connection, productId) => {
    const [rows, fields] = await connection.execute(
      "SELECT c.* FROM categories c JOIN categories_products pc ON c.id = pc.category_id WHERE pc.product_id = ?",
      [productId]
    );
    return rows;
  },
    removeProductCategory: async (connection, productId, categoryId) => {
        console.log("productId", productId);
        console.log("categoryId", categoryId);
        const [result, fields] = await connection.execute(
            "DELETE FROM categories_products WHERE product_id = ? AND category_id = ?",
            [productId, categoryId]
        );
        return result;
    },
};

export default categoryProductModel;