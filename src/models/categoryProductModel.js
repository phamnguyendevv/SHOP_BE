import ErrorWithStatus from "../utils/error.js";

let categoryProductModel = {

    getCategoriesByProductId: async (connection, productId) => {
        const [rows, fields] = await connection.execute(
            "SELECT c.* FROM categories c JOIN categories_products pc ON c.id = pc.category_id WHERE pc.product_id = ?",
            [productId]
        );
        return rows;
    }
};

export default categoryProductModel;