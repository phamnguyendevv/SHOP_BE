let ProductTechnologyModel = {
  //------------------------------- product technology ------------------------------
  addProductTechnology: async (connection, productId, technologyId) => {
    try {
      const query = `INSERT INTO products_technologies (product_id, technology_id) VALUES (?, ?)`;
      const [result] = await connection.query(query, [productId, technologyId]);
      return result;
    } catch (error) {
      throw new Error("Không thêm được công nghệ sản phẩm");
    }
  },
};
export default ProductTechnologyModel;