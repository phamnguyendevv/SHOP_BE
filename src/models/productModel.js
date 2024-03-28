

let ProductModel = {

    // add new product 
    addProduct: async (connection, product) => {
        try {
            const result = await connection.execute('INSERT INTO `products` (name, price, category_id) VALUES (?, ?, ?)', [product.name, product.price, product.category_id]);
            return result;
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Error in addProduct:', error);
            throw error;
        }
    },

    

}


export default ProductModel;