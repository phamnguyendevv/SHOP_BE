import Connection from "../db/configMysql.js";
let ProductTechnologyModel = {
  //------------------------------- product technology ------------------------------
  addProductTechnology: async (productId, technologyId) => {
    try {
      const query = `INSERT INTO products_technologies (product_id, technology_id) VALUES (?, ?)`;
      console.log(`productId: ${productId}, technologyId: ${technologyId}`);
      const result = await Connection.query(query, [productId, technologyId]);
      return result;
    } catch (error) {
      throw new Error("Không thêm được công nghệ sản phẩm");
    }
  },
  getTechnologiesByProductId: async (productId) => {
    try {
      const query = `SELECT t.name ,t.category_id FROM technologies t 
      JOIN products_technologies ON t.id = products_technologies.technology_id
      WHERE products_technologies.product_id = ?`;

      const result = await Connection.query(query, [productId]);
      return result;
    } catch (error) {
      throw new Error("Không lấy được công nghệ sản phẩm");
    }
  },
  deleteProductTechnology: async (connection, productId, technologyId) => {
    try {
      const query = `DELETE FROM products_technologies WHERE product_id = ? AND technology_id = ?`;
      const [result] = await connection.query(query, [productId, technologyId]);
      return result;
    } catch (error) {
      throw new Error("Không xóa được công nghệ sản phẩm");
    }
  },
  deleteProductTechnologyByProductId: async (connection, productId) => {
    try {
      const query = `DELETE FROM products_technologies WHERE product_id = ?`;
      const [result] = await connection.query(query, [productId]);
      return result;
    } catch (error) {
      throw new Error("Không xóa được công nghệ sản phẩm");
    }
  },
};
export default ProductTechnologyModel;
