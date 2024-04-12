let cartModel = {

    addCart: async (connection, cart) => {
        await connection.execute(
            `INSERT INTO product_cart (product_id, user_id,status_id, code_discount, created_at, updated_at) VALUES (?,?,?,?,?,CURRENT_DATE, CURRENT_DATE)`,
            [cart.product_id, cart.user_id, cart.status_id || 1 , cart.code_discount]
        );
    },
    getCart: async (connection, page, limit) => {
        try {
            const offset = (page - 1) * limit;
            const query = `
          SELECT * FROM product_cart 
            LIMIT ? OFFSET ?
          `;
            const [result] = await connection.query(query, [limit, offset]);
            return result;
        } catch (error) {
            console.error("Error getting cart:", error);
            throw error;
        }
    },
    getCartSuccess: async (connection, page, limit) => {
        try {
            const offset = (page - 1) * limit;
            const query = `
          SELECT * FROM product_cart WHERE status_id = 2
            LIMIT ? OFFSET ?
          `;
            const [result] = await connection.query(query, [limit, offset]);
        } catch (error) {
            console.error("Error getting cart:", error);
            throw error;
        }
    },
    getCartPending: async (connection, page, limit) => {
        try {
            const offset = (page - 1) * limit;
            const query = `
          SELECT * FROM product_cart WHERE status_id = 3
            LIMIT ? OFFSET ?
          `;
            const [result] = await connection.query(query, [limit, offset]);
        } catch (error) {
            console.error("Error getting cart:", error);
            throw error;
        }
    },



    getCartByProductId: async (connection, product_id) => {
        const [rows] = await connection.execute('SELECT * FROM product_cart WHERE product_id = ?', [product_id]);
        console.log(rows);
        return rows[0];
    },
    updateQuanityCart: async (connection, cart) => {

        await connection.execute(
            `UPDATE product_cart SET quantity = ? WHERE product_id = ?`,
            [cart.newQuanity, cart.product_id]
        );
    },
    deleteCart: async (connection, cart) => {
        await connection.execute(
            `DELETE FROM product_cart WHERE product_id = ? AND user_id = ?`,
            [cart.product_id, cart.user_id]
        );
    },
    getCartById: async (connection, id) => {
        const [rows] = await connection.execute('SELECT * FROM product_cart WHERE product_id = ?', [id]);
        return rows[0];
    },
    updateQuanityCart: async (connection, cart) => {

        await connection.execute(
            `UPDATE product_cart SET quanity = ? WHERE id = ?`,
            [cart.newQuanity, cart.product_id]
        );
    },
    updateStatusProduct: async (connection, data) => {
        try {
            const query = `UPDATE product_cart SET status_id = ? WHERE product_id = ?`;
            const [result] = await connection.query(query, [data.status_id, data.product_id]);
            return result;
        } catch (error) {
            throw new Error('Không cập nhật được trạng thái sản phẩm');
        }
    }
}
export default cartModel;