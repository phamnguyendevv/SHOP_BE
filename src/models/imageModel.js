let ImageModel = {
  getImageByField: async (connection, field, value) => {
    try {
      const query = `SELECT * FROM images WHERE ${field} = ?`;
      const [result] = await connection.query(query, [value]);
      return result[0];
    } catch (error) {
      throw new Error("Không lấy được ảnh");
    }
  },
  addImage: async (connection, data) => {
    try {
      const query = `INSERT INTO images (product_id, url, type) VALUES (?, ?, ?)`;

      const [result] = await connection.query(query, [
        data.product_id,
        data.url,
        data.type,
      ]);
      // get inserted image
      const queryGet = `SELECT * FROM images WHERE id = ?`;
      const [resultGet] = await connection.query(queryGet, [result.insertId]);
      return resultGet[0];
    } catch (error) {
      throw new Error("Không thêm được ảnh");
    }
  },
  updateImage: async (connection, data) => {
    try {
      // Base query
      let query = `UPDATE images SET `;
      let queryParams = [];
      let updateFields = [];

      // Dynamically build query based on fields present in data
      if (data.url) {
        updateFields.push(`url = ?`);
        queryParams.push(data.url);
      }
      if (data.product_id) {
        updateFields.push(`product_id = ?`);
        queryParams.push(data.product_id);
      }
      if (data.type) {
        updateFields.push(`type = ?`);
        queryParams.push(data.type);
      }

      // Ensure there is at least one field to update
      if (updateFields.length === 0) {
        throw new Error("Không có trường nào được cập nhật");
      }
      // Add update fields to query
      query += updateFields.join(", ");
      query += ` WHERE id = ?`;

      // Add id to queryParams
      queryParams.push(data.id);

      // Execute query
      const [result] = await connection.query(query, queryParams);

      // get updated image
      const queryGet = `SELECT * FROM images WHERE id = ?`;
      const [resultGet] = await connection.query(queryGet, [data.id]);
      return resultGet[0];
    } catch (error) {
      throw new Error("Không cập nhật được ảnh");
    }
  },

  deleteImage: async (connection, id) => {
    try {
      const query = `DELETE FROM images WHERE id = ?`;
      const [result] = await connection.query(query, [id]);
      return result;
    } catch (error) {
      throw new Error("Không xóa được ảnh");
    }
  },
  getImage: async (connection, id) => {
    try {
      const query = `SELECT * FROM images WHERE id = ?`;
      const [result] = await connection.query(query, [id]);
      return result[0];
    } catch (error) {
      throw new Error("Không lấy được ảnh");
    }
  },
  deleteImageByField: async (connection, field, value) => {
    try {
      const query = `DELETE FROM images WHERE ${field} = ?`;
      const [result] = await connection.query(query, [value]);
      return result;
    } catch (error) {
      throw new Error("Không xóa được ảnh");
    }
  },
  
};


export default ImageModel;