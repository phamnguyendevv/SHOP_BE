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
};


export default TechnologyModel;