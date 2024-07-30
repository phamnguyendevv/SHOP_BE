let TechnologyModel = {
  getTechnologyByField: async (connection, field, value) => {
    try {
      const query = `SELECT * FROM \`technologies\` WHERE ${field} = ?`;
      const [rows, fields] = await connection.execute(query, [value]);

      return rows[0];
    } catch (error) {
      throw new Error("Không lấy được công nghệ");
    }
  },
  addTechnology: async (connection, data) => {
    try {
      const query = `INSERT INTO technologies (name, category_id) VALUES (?, ?)`;
      const [rows, fields] = await connection.execute(query, [
        data.name,
        data.category_id,
      ]);
      const query2 = `SELECT * FROM technologies WHERE id = ?`;
      const [rows2, fields2] = await connection.execute(query2, [
        rows.insertId,
      ]);
      return rows2[0];
    } catch (error) {
      throw new Error("Không thêm được công nghệ mới");
    }
  },
  updateTechnology: async (connection, data) => {
    try {
      const query = `UPDATE technologies SET name = ?, category_id = ? WHERE id = ?`;
      const [rows, fields] = await connection.execute(query, [
        data.name,
        data.category_id,
        data.id,
      ]);
      return rows;
    } catch (error) {
      throw new Error("Không cập nhật được công nghệ");
    }
  },
  deleteTechnology: async (connection, id) => {
    try {
      const query = `DELETE FROM technologies WHERE id = ?`;
      const [rows, fields] = await connection.execute(query, [id]);
      return rows;
    } catch (error) {
      throw new Error("Không xóa được công nghệ");
    }
  },

};


export default TechnologyModel;