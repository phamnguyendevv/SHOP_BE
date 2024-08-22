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
      `SELECT pc.id,p.id AS product_id, p.name AS product_name, u.full_name AS sell_by,
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
                    (
                        SELECT JSON_ARRAYAGG(i.url)
                          FROM images i
                        WHERE i.product_id = p.id
                    ) AS image_urls,
                pc.status_id, pc.note, pc.created_at AS date_order
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
    const requiredFields = ["cart_id", "user_id"];
    const optionalFields = [
      "product_id",
      "classify_id",
      "status_id",
      "note",
      "ref_balance",
    ];

    if (
      !requiredFields.every((field) => data[field]) ||
      !optionalFields.some((field) => data[field] !== undefined)
    ) {
      throw new Error("Invalid input data");
    }
    console.log(optionalFields);
    console.log(requiredFields);

    const updateCartFields = {
      product_id: "product_id = ?",
      classify_id: "classify_id = ?",
      status_id: "status_id = ?",
      note: "note = ?",
    };

    const updateFields = Object.entries(updateCartFields)
      .filter(([key]) => data[key] !== undefined)
      .map(([, value]) => value);

    const updateParams = Object.keys(updateCartFields)
      .filter((key) => data[key] !== undefined)
      .map((key) => data[key]);

    updateParams.push(data.cart_id);

    const updateCartQuery = `
      UPDATE product_cart
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE id = ?
    `;

    const updateUserQueries = [];
    const updateUserParams = [];

    if (data.ref_balance !== undefined) {
      updateUserQueries.push("UPDATE user SET balance = ? WHERE id = ?");
      updateUserParams.push([data.ref_balance, data.ref_user_id]);
    }

    updateUserQueries.push("UPDATE user SET balance = ? WHERE id = ?");
    updateUserParams.push([data.last_balance, data.user_id]);

    console.log(updateUserQueries); 
    console.log(updateUserParams);
    try {
      await Connection.executeTransaction(async (connection) => {
        await connection.query(updateCartQuery, updateParams);
        for (let i = 0; i < updateUserQueries.length; i++) {
          await connection.query(updateUserQueries[i], updateUserParams[i]);
        }
      });

      return { message: "Cập nhật giỏ hàng thành công", status: 200 };
    } catch (error) {
      console.error("Error updating cart:", error);
      throw new Error("Lỗi khi cập nhật giỏ hàng");
    }
  },
};
export default cartModel;
