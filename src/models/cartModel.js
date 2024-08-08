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
      `SELECT DISTINCT pc.id as cart_id ,pc.note , pc.created_at as date_order,p.id as product_id, p.name as product_name,c.id as classify_id, c.name as classify_name, c.price ,u.full_name as sell_by , i.url as image_url , pc.status_id

       FROM product_cart pc
        JOIN product p ON pc.product_id = p.id
        JOIN classify c ON pc.classify_id = c.id
        JOIN user u ON p.user_id = u.id
        JOIN images i ON p.id = i.product_id

        WHERE pc.user_id = ? AND pc.status_id = ?`,
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

  updateStatusProduct: async (data) => {
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
    console.log(query);
    console.log(params);
    const result = await Connection.query(query, params);

    return;
  },
};
export default cartModel;
