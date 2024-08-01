let ClassifyModel = {
  findClassifyById: async (connection, id) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `classify` WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  getClassifyByField: async (connection, field, value) => {
    const query = `SELECT * FROM \`classify\` WHERE ${field} = ?`;
    const [rows, fields] = await connection.execute(query, [value]);
    return rows;
  },

  addClassify: async (connection, productId, classifyData) => {
    const query = `INSERT INTO classify (product_id, name,price,url_download,created_at, updated_at) VALUES (?, ?,?,?, CURDATE(), CURDATE())`;
    const [result] = await connection.query(query, [
      productId,
      classifyData.name,
      classifyData.price,
      classifyData.url_download,
    ]);
    return result;
  },

  updateClassify: async (connection, productId, classifyData) => {
    const fieldsToUpdate = [];
    const params = [];

    if (classifyData.name !== undefined) {
      fieldsToUpdate.push("name = ?");
      params.push(classifyData.name);
    }
    if (productId !== undefined) {
      fieldsToUpdate.push("product_id = ?");
      params.push(productId);
    }
    if (classifyData.price !== undefined) {
      fieldsToUpdate.push("price = ?");
      params.push(classifyData.price);
    }
    if (classifyData.url_download !== undefined) {
      fieldsToUpdate.push("url_download = ?");
      params.push(classifyData.url_download);
    }
    params.push(classifyData.id);

    const fieldsToUpdateString = fieldsToUpdate.join(", ");
    const query = `UPDATE classify SET ${fieldsToUpdateString}, updated_at = NOW() WHERE id = ?`;

    const [result] = await connection.query(query, params);
  },
  updateProductClassify: async (transaction, productId, classifyData) => {
    const classifyIds = classifyData.map((classify) => classify.id);
    const existingClassifyData = await ProductModel.findClassifyByIds(
      transaction,
      classifyIds
    );
    const existingClassifyMap = new Map(
      existingClassifyData.map((item) => [item.id, true])
    );

    await Promise.all(
      classifyData.map((classify) => {
        const classifyId = Number(classify.id);
        if (existingClassifyMap.has(classifyId)) {
          return ProductClassifyModel.updateClassify(
            transaction,
            productId,
            classify
          );
        } else {
          classify.product_id = productId;
          return ClassifyModel.addClassify(transaction, productId, classify);
        }
      })
    );
  },

  getClassifyByProduct: async (connection, product_id) => {
    const query = `SELECT * FROM classify WHERE product_id = ?`;
    const [result] = await connection.query(query, product_id);
    return result;
  },

  deleteClassify: async (connection, id) => {
    const query = `DELETE FROM classify WHERE product_id = ?`;
    const [result] = await connection.query(query, id);
    return result;
  },
};
export default ClassifyModel;