

let ProductModel = {
    // find data by id
    findProductById: async (connection, id) => {
        const [rows] = await connection.execute('SELECT * FROM `product` WHERE id = ?', [id]);
       
        return rows[0]

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
                            (user_id, status_id, name_product, price, url_demo, is_popular, categories, description, sold, code_Discount, pre_order, points, slug_product, technology, created_at, updated_at) 
                            VALUES (?, ?, ?, ?, ?, 0, ?, ?, 0, ?, ?, ?, ?, ?, CURDATE(), CURDATE())`;

            // Thực hiện truy vấn để chèn dữ liệu
            const [result] = await connection.query(query, [
                productData.user_id,
                productData.status_id || 1,
                productData.name_product,
                productData.price,
                productData.url_demo,
                JSON.stringify(productData.categories),
                productData.description,
                productData.code_Discount || "",
                productData.pre_order || 0,
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

    updateProduct: async (connection, productData) => {
        const fieldsToUpdate = [];
        const params = [];

        if (productData.user_id !== undefined) {
            fieldsToUpdate.push('user_id = ?');
            params.push(productData.user_id);
        }
        if (productData.status_id !== undefined) {
            fieldsToUpdate.push('status_id = ?');
            params.push(productData.status_id);
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
        if (productData.url_demo !== undefined) {
            fieldsToUpdate.push('url_demo = ?');
            params.push(productData.url_demo);
        }
        if (productData.categories !== undefined) {
            fieldsToUpdate.push('categories = ?');
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
        if (productData.points !== undefined) {
            fieldsToUpdate.push('points = ?');
            params.push(productData.points);
        }
        if (productData.pre_order !== undefined) {
            fieldsToUpdate.push('pre_order = ?');
            params.push(productData.pre_order);
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

    getProductBySlug: async (connection, slug_product) => {
        const query = `SELECT * FROM product WHERE slug_product = ?`;
        const [result] = await connection.query(query, slug_product);
        return result[0];

    },

    updateStatusProduct: async (connection, data) => {
            const query = `UPDATE product SET status_id = ? WHERE id = ?`;
            const [rows, fields] = await connection.query(query, [data.status_id, data.product_id]);
            return rows;
      
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




    //--------------------------- classify ------------------------------

    findClassifyById: async (connection, id) => {
        const [rows, fields] = await connection.execute('SELECT * FROM `classify` WHERE id = ?', [id]);
        return rows[0];

    },

    addClassify: async (connection, classifyData) => {

        const query = `INSERT INTO classify (product_id, name_classify,price_classify,url_download,created_at, updated_at) VALUES (?, ?,?,?, CURDATE(), CURDATE())`;
        const [result] = await connection.query(query, [classifyData.product_id, classifyData.name_classify, classifyData.price_classify, classifyData.url_download]);
        return result;
    },

    updateClassify: async (connection, classifyData) => {
        console.log(classifyData);

        console.log("--------------------")
        const fieldsToUpdate = [];
        const params = [];

        if (classifyData.name_classify !== undefined) {
            fieldsToUpdate.push('name_classify = ?');
            params.push(classifyData.name_classify);
        }
        if (classifyData.price_classify !== undefined) {
            fieldsToUpdate.push('price_classify = ?');
            params.push(classifyData.price_classify);
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


    getClassifyByProduct: async (connection, product_id) => {

        const query = `SELECT * FROM classify WHERE product_id = ?`;
        const [result] = await connection.query(query, product_id);
        return result;
    },

    deleteClassify: async (connection, id) => {

        const query = `DELETE FROM classify WHERE product_id = ?`;
        const [result] = await connection.query(query, id);
        return result;
    },




}


export default ProductModel;