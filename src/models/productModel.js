

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
            const [rows] = await connection.execute('SELECT * FROM `product` WHERE slug_product = ?', [fullSlug]);
            return rows;
       
    },

    // add new data 
    addProduct: async (connection, productData) => {
        try {
            const query = `INSERT INTO product 
                            (user_id, status_id, name_product, price, url_Demo, popular_product, category, description, sold, code_Discount, pre_order, points, slug_product, technology, created_at, updated_at) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, CURDATE(), CURDATE())`;

            // Thực hiện truy vấn để chèn dữ liệu
            const [result] = await connection.query(query, [
                productData.user_id,
                productData.status_id || 1,
                productData.name_product,
                productData.price,
                productData.url_Demo,
                productData.popular_product || false,
                JSON.stringify(productData.category),
                productData.description,
                productData.code_Discount || "",
                productData.pre_order || false,
                productData.points || 0,
                productData.slug_product || "",
                JSON.stringify(productData.technology)
            ]);

            return result;
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Không thêm được sản phẩm: ', error);
            throw new Error('Không thêm được sản phẩm');
        }
    },
    addClassify: async (connection, classifyData) => {
        const query = `INSERT INTO classify (product_id, name_classify,image_classify,url_dowload,created_at, updated_at) VALUES (?, ?,?,?, CURDATE(), CURDATE())`;
        const [result] = await connection.query(query, [classifyData.product_id, classifyData.name_classify, classifyData.image_classify, classifyData.url_dowload]);
        return result;
    },

    updateProduct: async (connection, data) => {
        const fieldsToUpdate = [];
        const params = [];

        if (data.user_id !== undefined) {
            fieldsToUpdate.push('user_id = ?');
            params.push(data.user_id);
        }
        if (data.name !== undefined) {
            fieldsToUpdate.push('name = ?');
            params.push(data.name);
        }
        if (data.price !== undefined) {
            fieldsToUpdate.push('price = ?');
            params.push(data.price);
        }
        if (data.url_Demo !== undefined) {
            fieldsToUpdate.push('url_Demo = ?');
            params.push(data.url_Demo);
        }
        if (data.category !== undefined) {
            fieldsToUpdate.push('category = ?');
            params.push(JSON.stringify(data.category));
        }
        if (data.description !== undefined) {
            fieldsToUpdate.push('description = ?');
            params.push(data.description);
        }
        if (data.url_Download !== undefined) {
            fieldsToUpdate.push('url_Download = ?');
            params.push(data.url_Download);
        }
        if (data.slug !== undefined) {
            fieldsToUpdate.push('slug = ?');
            params.push(data.slug);
        }
        if (data.technology !== undefined) {
            fieldsToUpdate.push('technology = ?');
            params.push(JSON.stringify(data.technology));
        }

        if (fieldsToUpdate.length === 0) {
            throw new Error('Không có trường nào được cập nhật');
        }

        params.push(data.id);

        const fieldsToUpdateString = fieldsToUpdate.join(', ');

        const query = `UPDATE product SET ${fieldsToUpdateString}, updated_at = CURDATE() WHERE id = ?`;

        const [result] = await connection.query(query, params);

        if (result.affectedRows === 0) {
            throw new Error('Không cập nhật được sản phẩm');
        }

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

    deleteProduct: async (connection, id) => {
        try {
            const query = `DELETE FROM product WHERE id = ?`;
            const [result] = await connection.query(query, [id]);
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

    getProductBySlug: async (connection, slug) => {
        try {
            const query = `SELECT * FROM product WHERE slug = ?`;
            const [result] = await connection.query(query, slug);
            if (result.length === 0) {
                throw new Error('Không tìm thấy sản phẩm với slug này');


            }
            return result[0];
        } catch (error) {
            throw new Error('Không tìm thấy sản phẩm với slug này');
        }
    },

    getOneProduct: async (connection, data) => {
        try {
            const query = `SELECT * FROM product WHERE id = ?`;
            const [result] = await connection.query(query, data.id);
            console.log(result);
            if (result.length === 0) {
                throw new Error('Không tìm thấy sản phẩm với id này');
            }
            return result[0];
        } catch (error) {
            throw new Error('Không tìm thấy sản phẩm với id này');
        }
    },
    getProductPopularByCategory: async (connection, category, page, limit, popular) => {
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