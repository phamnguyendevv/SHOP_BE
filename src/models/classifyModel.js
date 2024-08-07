import Connection from "../db/configMysql.js";

let ClassifyModel = {
  findClassifyById: async (connection, id) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `classify` WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  getClassifyByField: async (field, value) => {
    console.log(field, value);
    const query = `SELECT * FROM \`classify\` WHERE ${field} = ?`;
    const rows = await Connection.execute(query, [value]);
    return rows;
  },

  getClassifyByFields: async (field, values) => {
    const query = `SELECT * FROM \`classify\` WHERE ${field}`;
    const rows = await Connection.execute(query, values);
    return rows;
  },

  addClassify: async (productId, classifyData) => {
    const query = `INSERT INTO classify (product_id, name,price,url_download,created_at, updated_at) VALUES (?, ?,?,?, CURDATE(), CURDATE())`;
    const result = await Connection.query(query, [
      productId,
      classifyData.name,
      classifyData.price,
      classifyData.url_download,
    ]);
    return result;
  },

  updateClassify: async (productId, data) => {
    const fieldsToUpdate = [];
    const params = [];

    if (data.name !== undefined) {
      fieldsToUpdate.push("name = ?");
      params.push(data.name);
    }
    if (productId !== undefined) {
      fieldsToUpdate.push("product_id = ?");
      params.push(productId);
    }
    if (data.price !== undefined) {
      fieldsToUpdate.push("price = ?");
      params.push(data.price);
    }
    if (data.url_download !== undefined) {
      fieldsToUpdate.push("url_download = ?");
      params.push(data.url_download);
    }
    params.push(data.id);

    const fieldsToUpdateString = fieldsToUpdate.join(", ");
    const query = `UPDATE classify SET ${fieldsToUpdateString}, updated_at = NOW() WHERE id = ?`;

    const result = await Connection.query(query, params);
  },

  getClassifyByProduct: async (connection, product_id) => {
    const query = `SELECT * FROM classify WHERE product_id = ?`;
    const [result] = await connection.query(query, product_id);
    return result;
  },

  deleteClassifyByFild: async (field, value) => {
    const query = `DELETE FROM classify WHERE ${field} = ?`;
    const result = await Connection.query(query, value);
    return result;
  },

  deleteClassify: async (id) => {
    const query = `DELETE FROM classify WHERE product_id = ?`;
    const result = await Connection.query(query, id);
    return result;
  },
  deleteClassify: async (product_id, id) => {
    const query = `DELETE FROM classify WHERE product_id = ? AND id = ?`;
    const result = await Connection.query(query, [product_id, id]);
    return result;
  },
};
export default ClassifyModel;