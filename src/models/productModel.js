

let ProductModel = {


    // find data by id
    findProductById: async (connection, id) => {
        try {
            const [rows] = await connection.execute('SELECT * FROM `product` WHERE id = ?', [id]);
            return rows;
        } catch (error) {
            // Xử lý lỗi ở đây
            throw new Error('Không tìm thấy sản phẩm với id này');
        }
    },
    // find data by slug
    findProductBySlug: async (connection, fullSlug) => {
        try {

            const [rows] = await connection.execute('SELECT * FROM `product` WHERE slug = ?', [fullSlug]);
            return rows;
        } catch (error) {
            // Xử lý lỗi ở đây
            throw new Error('Không tìm thấy sản phẩm với slug này');
        }
    },

    // add new data 
    addProduct: async (connection, data) => {
        try {
            const query = `INSERT INTO product 
                            (user_id, status_id, name, price, url_Demo, popular, category, description, sold, code_Discount, url_Download, pre_order, points, slug, technology, created_at, updated_at) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, CURDATE(), CURDATE())`;

            // Thực hiện truy vấn để chèn dữ liệu
            const [result] = await connection.query(query, [
                data.user_id,
                data.status_id || 5,
                data.name,
                data.price,
                data.url_Demo,
                data.popular || false,
                JSON.stringify(data.category),
                data.description,
                data.code_Discount || "",
                data.url_Download,
                data.pre_order || false,
                data.points || 0,
                data.slug || "",
                JSON.stringify(data.technology)
            ]);

            return result;
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Không thêm được sản phẩm: ', error);
            throw new Error('Không thêm được sản phẩm');
        }
    },
    updateProduct: async (connection, data) => {

        const query = `UPDATE product 
                        SET user_id = ?,  name = ?, price = ?, url_Demo = ?,  category = ?, description = ?, url_Download = ?, slug = ?, technology = ?, updated_at = CURDATE() 
                        WHERE id = ?`;

        // Thực hiện truy vấn để cập nhật dữ liệu
        const [result] = await connection.query(query, [
            data.user_id,
            data.name,
            data.price,
            data.url_Demo,
            JSON.stringify(data.category),
            data.description,
            data.url_Download,
            data.slug,
            JSON.stringify(data.technology),
            data.id
        ]);

        return result;
    },
    updateStatusProduct: async (connection, data) => {
        try {
            const query = `UPDATE product SET status_id = ? WHERE id = ?`;
            const [result] = await connection.query(query, [data.status_id, data.product_id]);
            return result;
        } catch (error) {
            throw new Error('Không cập nhật được trạng thái sản phẩm');
        }
    },

    deleteProduct: async (connection, body) => {
        try {
            const user = await connection.query('SELECT * FROM `product` WHERE id = ?', [body.id]);
            if (user.length === 0) {
                throw new Error('Sản phẩm không tồn tại');
            }
            const query = `DELETE FROM product WHERE id = ?`;
            const [result] = await connection.query(query, [body.id]);
            if (!result.affectedRows) {
                throw new Error('Không xóa được sản phẩm');
            }
            return result;
        } catch (error) {
            // Xử lý lỗi ở đây
            throw new Error('Không tìm thấy sản phẩm với id này');
        }
    },
    getProductByCategory: async (connection, category, page, limit) => {
        try {
            const categoryJSON = JSON.stringify(category);
            console.log(categoryJSON);
            const offset = (page - 1) * limit;

            const query = `
            SELECT * 
            FROM product 
            WHERE JSON_CONTAINS(category, ?)
            LIMIT ? OFFSET ?
          `;
            const [result] = await connection.query(query, [categoryJSON, limit, offset]);

            // Lấy tổng số sản phẩm trong danh mục
            const total_count = result.length;

            return {
                data: result,
                total_count: total_count,
                current_page: page,
                per_page: limit
            };
        } catch (error) {
            throw new Error('Không tìm thấy sản phẩm với danh mục này');
        }
    },
    getOneProduct: async (connection, data) => {
        try {
            const query = `SELECT * FROM product WHERE id = ?`;
            const [result] = await connection.query(query, [data.id]);

            if (result.length === 0) {
                throw new Error('Không tìm thấy sản phẩm với id này');
            }
            return result[0];
        } catch (error) {
            throw new Error('Không tìm thấy sản phẩm với id này');
        }
    },
    updateProductPopular: async (connection, data) => {
        const query = `UPDATE product 
                        SET popular = ?, updated_at = CURDATE() 
                        WHERE id = ?`;

        // Thực hiện truy vấn để cập nhật dữ liệu
        const [result] = await connection.query(query, [
            data.popular,
            data.id
        ]);

        return result;
    },
    getProductPopularByCategory: async (connection, category, page, limit,popular) => {
        try {
            const categoryJSON = JSON.stringify(category);
            const offset = (page - 1) * limit;

            const query = `
            SELECT * 
            FROM product 
            WHERE JSON_CONTAINS(category, ?) AND popular = 1
            LIMIT ? OFFSET ?
          `;

            const [result] = await connection.query(query, [categoryJSON, limit, offset]);
            console.log(result);
            // Lấy tổng số sản phẩm phổ biến trong danh mục
            const total_count = result.length;

            return {
                data: result,
                total_count: total_count,
                current_page: page,
                per_page: limit
            };
        } catch (error) {
            throw new Error('Không tìm thấy sản phẩm phổ biến với danh mục này');
        }
    },



}


export default ProductModel;