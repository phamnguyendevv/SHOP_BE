let cartModel = {

    addCart: async (connection, cart) => {
        const [rows, fields] = await connection.execute(
            `INSERT INTO product_cart (product_id, user_id,status_id, code_discount, created_at, updated_at) VALUES (?,?,?,?,CURRENT_DATE, CURRENT_DATE)`,
            [cart.product_id, cart.user_id, cart.status_id || 1, cart.code_discount]

        );
        return rows;
    },

    getCartStatus: async (connection, data) => {

        const offset = (data.page - 1) * data.limit;
        const query = `
          SELECT * FROM product_cart WHERE status_id = ? AND user_id = ?
            LIMIT ? OFFSET ?
          `;
        const [rows, fields] = await connection.query(query, [data.status_id, data.user_id, data.limit, offset]);
        console.log(rows);
        return rows;

    },

    getCartByProductId: async (connection, product_id) => {
        const [rows, fields] = await connection.execute('SELECT * FROM product_cart WHERE product_id = ?', [product_id]);
        return rows;
    },
    removeProductInCart: async (connection, cart) => {
        await connection.execute(
            `DELETE FROM product_cart WHERE product_id = ? AND user_id = ?`,
            [cart.product_id, cart.user_id]
        );
    },
    getCartById: async (connection, id) => {
        const [rows] = await connection.execute('SELECT * FROM product_cart WHERE product_id = ?', [id]);
        return rows[0];
    },

    updateStatusProduct: async (connection, data) => {
        const query = `UPDATE product_cart SET status_id = ? WHERE product_id = ? AND user_id = ?`;
        const [rows, fields] = await connection.query(query, [data.status_id, data.product_id, data.user_id]);
        return rows;

    }
}
export default cartModel;