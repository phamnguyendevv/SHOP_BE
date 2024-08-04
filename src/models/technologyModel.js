import Connection from "../db/configMysql.js";


let TechnologyModel = {
  getTechnologyByField: async (field, value) => {
      const query = `SELECT * FROM \`technologies\` WHERE ${field} = ?`;
    const rows = await Connection.execute(query, [value]);
      return rows;
   
  },
  addTechnology: async (data) => {
    try {
      const query = `INSERT INTO technologies (name, category_id) VALUES (?, ?)`;
      const rows = await Connection.execute(query, [
        data.name,
        data.category_id,
      ]);
      const query2 = `SELECT * FROM technologies WHERE id = ?`;
      const rows2 = await Connection.execute(query2, [
        rows.insertId,
      ]);
      return rows2[0];
    } catch (error) {
      throw new Error("Không thêm được công nghệ mới");
    }
  },
  updateTechnology: async (data) => {
    try {
      const query = `UPDATE technologies SET name = ?, category_id = ? WHERE id = ?`;
      const rows = await Connection.execute(query, [
        data.name,
        data.category_id,
        data.id,
      ]);
      return rows;
    } catch (error) {
      throw new Error("Không cập nhật được công nghệ");
    }
  },
  deleteTechnology: async (id) => {
    try {
      const query = `DELETE FROM technologies WHERE id = ?`;
    const rows = await Connection.execute(query, [id]);
      return rows;
    } catch (error) {
      throw new Error("Không xóa được công nghệ");
    }
  },

};


export default TechnologyModel;