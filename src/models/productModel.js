

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
                            (user_id, status_id, name_product, price, url_Demo, is_popular, categories, description, sold, code_Discount, pre_order, points, slug_product, technology, created_at, updated_at) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, CURDATE(), CURDATE())`;

            // Thực hiện truy vấn để chèn dữ liệu
            const [result] = await connection.query(query, [
                productData.user_id,
                productData.status_id || 1,
                productData.name_product,
                productData.price,
                productData.url_Demo,
                productData.is_popular || false,
                JSON.stringify(productData.categories),
                productData.description,
                productData.code_Discount || "",
                productData.pre_order || false,
                productData.points || 0,
                productData.slug_product,
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

    updateProduct: async (connection, productData) => {
        const fieldsToUpdate = [];
        const params = [];

        if (productData.user_id !== undefined) {
            fieldsToUpdate.push('user_id = ?');
            params.push(productData.user_id);
        }
        if (productData.name_product !== undefined) {
            fieldsToUpdate.push('name_product = ?');
            params.push(productData.name_product);
        }
        if (productData.price !== undefined) {
            fieldsToUpdate.push('price = ?');
            params.push(productData.price);
        }
        if (productData.is_popular !== undefined) {
            fieldsToUpdate.push('is_popular = ?');
            params.push(productData.is_popular);
        }
        if (productData.url_Demo !== undefined) {
            fieldsToUpdate.push('url_Demo = ?');
            params.push(productData.url_Demo);
        }
        if (productData.categories !== undefined) {
            fieldsToUpdate.push('category = ?');
            params.push(JSON.stringify(productData.categories));
        }
        if (productData.description !== undefined) {
            fieldsToUpdate.push('description = ?');
            params.push(productData.description);
        }
        if (productData.slug_product !== undefined) {
            fieldsToUpdate.push('slug = ?');
            params.push(productData.slug_product);
        }
        if (productData.technology !== undefined) {
            fieldsToUpdate.push('technology = ?');
            params.push(JSON.stringify(productData.technology));
        }

        params.push(productData.id);

        const fieldsToUpdateString = fieldsToUpdate.join(', ');

        const query = `UPDATE product SET ${fieldsToUpdateString}, updated_at = CURDATE() WHERE id = ?`;

        const [result] = await connection.query(query, params);

        return result;
    },
    updateClassify: async (connection, classifyData) => {
        const fieldsToUpdate = [];
        const params = [];

        if (classifyData.name_classify !== undefined) {
            fieldsToUpdate.push('name_classify = ?');
            params.push(classifyData.name_classify);
        }
        if (classifyData.image_classify !== undefined) {
            fieldsToUpdate.push('image_classify = ?');
            params.push(classifyData.image_classify);
        }
        if (classifyData.url_download !== undefined) {
            fieldsToUpdate.push('url_download = ?');
            params.push(classifyData.url_download);
        }
        params.push(classifyData.id);

        const fieldsToUpdateString = fieldsToUpdate.join(', ');

        const query = `UPDATE classify SET ${fieldsToUpdateString}, updated_at = CURDATE() WHERE id = ? `;

        const [result] = await connection.query(query, params);

        return result;
    },
    getProductBySlug: async (connection, slug_product) => {

        const query = `SELECT * FROM product WHERE slug_product = ?`;
        const [result] = await connection.query(query, slug_product);
        return result[0];

    },
    getClassifyByProduct: async (connection, product_id) => {

        const query = `SELECT * FROM classify WHERE product_id = ?`;
        const [result] = await connection.query(query, product_id);
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
            const queryClassify = `DELETE FROM classify WHERE product_id = ?`;

            const [resultClassify] = await connection.query(queryClassify, [id]);

            const queryProduct = `DELETE FROM product WHERE id = ?`;

            const [resultProduct] = await connection.query(queryProduct, [id]);
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Không xóa được sản phẩm: ', error);
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