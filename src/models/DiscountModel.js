import Connection from "../db/configMysql.js";

let DiscountModel = {
  addDiscount: async (data) => {
    const query =
      "INSERT INTO discount (user_id, name, code, percent, type, date_start, date_end, created_at, updated_at) VALUES (?, ?,?,? , ?, ?, ?, CURDATE(), CURDATE())";
    const result = await Connection.query(query, [
      data.user_id,
      data.name,
      data.code,
      data.percent,
      data.type,
      data.date_start,
      data.date_end,
    ]);
    return result;
  },
  updateDiscount: async (data) => {
    try {
      const fieldsToUpdate = [];
      const params = [];

      if (data.user_id) {
        fieldsToUpdate.push("user_id = ?");
        params.push(data.user_id);
      }
      if (data.code) {
        fieldsToUpdate.push("code = ?");
        params.push(data.code);
      }
      if (data.percent) {
        fieldsToUpdate.push("percent = ?");
        params.push(data.percent);
      }
      if (data.date_start) {
        fieldsToUpdate.push("date_start = ?");
        params.push(data.date_start);
      }
      if (data.date_end) {
        fieldsToUpdate.push("date_end = ?");
        params.push(data.date_end);
      }
      if (data.name) {
        fieldsToUpdate.push("name = ?");
        params.push(data.name);
      }
      if (data.type) {
        fieldsToUpdate.push("type = ?");
        params.push(data.type);
      }
      params.push(data.id);
      const query = `UPDATE discount SET ${fieldsToUpdate.join(
        ", "
      )} WHERE id = ?`;
      const result = await Connection.query(query, params);

      return result;
    } catch (error) {
      console.log(error);
    }
  },
    deleteDiscount: async (id) => {
    const result = await Connection.query(
      "DELETE FROM discount WHERE id = ?",
      id
    );
    return result;
  },
  getDiscountByCode: async (connection, data) => {
    const result = await connection.query(
      "SELECT * FROM discount WHERE discount_code = ? ",
      data.discount_code
    );
    if (result[0].length === 0) {
      throw new Error("Không tìm thấy mã giảm giá");
    }
    console.log(result[0]);
    return result[0];
  },
  getDiscountByField: async (field, value) => {
    const result = await Connection.query(
      `SELECT * FROM discount WHERE ${field} = ?`,
      [value]
    );
  },
};

export default DiscountModel;
