

let ProductModel = {
    // find product by slug
    findProductBySlug: async (connection, slug) => {
        try {
            const [rows] = await connection.execute('SELECT * FROM `products` WHERE slug = ?', [slug]);
            return rows;
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Error in findProductBySlug:', error);
            throw error;
        }
    },

    // add new product 
    addProduct: async (connection, product) => {
        try {
            const query = 'INSERT INTO product (user_id, status_id, price, url_Demo, popular, category, description, sold, code_Discount, url_Download, pre_order, points, slug, technology, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, CURDATE(), CURDATE())';
          
            // Thực hiện truy vấn để chèn dữ liệu
            const [result] = await connection.query(query, [
              product.user_id,
              product.status_id || 9,
              product.price,
              product.url_Demo,
              product.popular || false, // Sửa lỗi ở đây
              JSON.stringify(product.category), // Chuyển đổi category thành chuỗi JSON
              product.description,
              product.code_Discount || "",
              product.url_Download,
              product.pre_order || false, // Sửa lỗi ở đây
              product.points || 0,
              product.slug || "",
              JSON.stringify(product.technology), // Chuyển đổi technology thành chuỗi JSON
            ]);
          
            return result;
          } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Error in addProduct:', error);
            throw error;
          }
    },



}


export default ProductModel;