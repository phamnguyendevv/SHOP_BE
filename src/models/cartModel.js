import Connection from "../db/configMysql.js";

let cartModel = {
  addCart: async (cart) => {
    const rows = await Connection.execute(
      `INSERT INTO product_cart (product_id, user_id,status_id,classify_id, code , note, created_at, updated_at) VALUES (?,?,?,?,?,?,CURRENT_DATE, CURRENT_DATE)`,
      [
        cart.product_id,
        cart.user_id,
        cart.status_id || 1,
        cart.classify_id,
        cart.code,
        cart.note,
      ]
    );
    return rows;
  },

  getCartStatus: async (data) => {
    const rows = await Connection.query(
      `SELECT pc.id, pc.note, pc.created_at AS date_order, p.id AS product_id, p.name AS product_name,
                    (
                        SELECT JSON_ARRAYAGG(
                          JSON_OBJECT(
                              'classify_id', classify_id,
                              'classify_name', classify_name,
                              'price', price
                          ) 
                    )
                          FROM (
                            SELECT DISTINCT
                                c.id AS classify_id, c.name AS classify_name, c.price
                            FROM classify c
                            WHERE c.product_id = p.id
                          ) AS unique_classifies
                      ) AS classify_info,
                u.full_name AS sell_by,
                    (
                        SELECT JSON_ARRAYAGG(i.url)
                          FROM images i
                        WHERE i.product_id = p.id
                    ) AS image_urls,
                pc.status_id
        FROM product_cart pc
        JOIN product p ON pc.product_id = p.id
        JOIN user u ON p.user_id = u.id
        WHERE
            pc.user_id = ?
            AND pc.status_id = ?
        GROUP BY pc.id`,
      [data.user_id, data.status_id]
    );
    return rows;
  },
  removeProductInCart: async (cart) => {
    await Connection.execute(
      `DELETE FROM product_cart WHERE product_id = ? AND user_id = ?`,
      [cart.product_id, cart.user_id]
    );
  },
  getCartByField: async (field, values) => {
    const rows = await Connection.query(
      `SELECT * FROM product_cart WHERE ${field} = ?`,
      [values]
    );
    return rows;
  },
  getCartByFields: async (field, values) => {
    const rows = await Connection.query(
      `SELECT * FROM product_cart WHERE ${field}`,
      values
    );
    return rows;
  },

  updateCart: async (data) => {
    const fieldsToUpdate = [];
    const params = [];

    if (data.product_id !== undefined) {
      fieldsToUpdate.push("product_id = ?");
      params.push(data.product_id);
    }
    if (data.classify_id !== undefined) {
      fieldsToUpdate.push("classify_id = ?");
      params.push(data.classify_id);
    }
    if (data.user_id !== undefined) {
      fieldsToUpdate.push("user_id = ?");
      params.push(data.user_id);
    }
    if (data.status_id !== undefined) {
      fieldsToUpdate.push("status_id = ?");
      params.push(data.status_id);
    }
    if (data.note !== undefined) {
      fieldsToUpdate.push("note = ?");
      params.push(data.note);
    }

    params.push(data.cart_id);

    const fieldsToUpdateString = fieldsToUpdate.join(", ");
    const query = `UPDATE product_cart   SET ${fieldsToUpdateString}, updated_at = NOW() WHERE id = ?`;
    const result = await Connection.executeTransaction(async (connection) => {
      await connection.query(query, params);
      await connection.query(
        `UPDATE user SET balance = ? WHERE id = ?`,
        [data.last_balance, data.user_id]
      );
      return { success: true, message: "Cập nhật giỏ hàng thành công" };
    });

    return;
  },
};
export default cartModel;
