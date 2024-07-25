let ProductModel = {
  // find data by ids

  findClassifyByIds: async (connection, classifyIds) => {
    const placeholders = classifyIds.map(() => "?").join(",");
    const query = `SELECT * FROM classify WHERE id IN (${placeholders})`;

    const [rows] = await connection.execute(query, classifyIds);

    return rows;
  },

  findProductById: async (connection, id) => {
    const [rows] = await connection.execute(
      "SELECT * FROM `product` WHERE id = ?",
      [id]
    );

    return rows[0];
  },
  // find data by slug
  findProductBySlug: async (connection, fullSlug) => {
    const [rows] = await connection.execute(
      "SELECT * FROM `product` WHERE slug = ?",
      [fullSlug]
    );
    return rows;
  },

  getProductByField: async (connection, field, value) => {
    const query = `SELECT * FROM \`product\` WHERE ${field} = ?`;
    const [rows, fields] = await connection.execute(query, [value]);
    return rows[0];
  },

  // add new data
  addProduct: async (connection, productData) => {
    try {
      const query = `INSERT INTO product 
                            (user_id, status_id, name, price, url_demo, is_popular, description, sold, code_discount, pre_order, points, slug, technology, created_at, updated_at) 
                            VALUES (?, ?, ?, ?, ?, 0, ?, 0, ?, ?, ?, ?, ?, CURDATE(), CURDATE())`;

      // Thực hiện truy vấn để chèn dữ liệu
      const [result] = await connection.query(query, [
        productData.user_id,
        productData.status_id || 1,
        productData.name,
        productData.price,
        productData.url_demo,
        productData.description,
        productData.code_Discount || "",
        productData.pre_order || 0,
        productData.points || 0,
        productData.slug,
        JSON.stringify(productData.technology),
      ]);

      return result;
    } catch (error) {
      // Xử lý lỗi ở đây
      console.error("Không thêm được sản phẩm: ", error);
      throw new Error("Không thêm được sản phẩm");
    }
  },

  updateProduct: async (connection, productData) => {
    const fieldsToUpdate = [];
    const params = [];

    if (productData.user_id !== undefined) {
      fieldsToUpdate.push("user_id = ?");
      params.push(productData.user_id);
    }
    if (productData.status_id !== undefined) {
      fieldsToUpdate.push("status_id = ?");
      params.push(productData.status_id);
    }
    if (productData.name_product !== undefined) {
      fieldsToUpdate.push("name = ?");
      params.push(productData.name_product);
    }
    if (productData.price !== undefined) {
      fieldsToUpdate.push("price = ?");
      params.push(productData.price);
    }
    if (productData.is_popular !== undefined) {
      fieldsToUpdate.push("is_popular = ?");
      params.push(productData.is_popular);
    }
    if (productData.url_demo !== undefined) {
      fieldsToUpdate.push("url_demo = ?");
      params.push(productData.url_demo);
    }
    if (productData.description !== undefined) {
      fieldsToUpdate.push("description = ?");
      params.push(productData.description);
    }
    if (productData.slug !== undefined) {
      fieldsToUpdate.push("slug = ?");
      params.push(productData.slug);
    }
    if (productData.points !== undefined) {
      fieldsToUpdate.push("points = ?");
      params.push(productData.points);
    }
    if (productData.pre_order !== undefined) {
      fieldsToUpdate.push("pre_order = ?");
      params.push(productData.pre_order);
    }
    if (productData.technology !== undefined) {
      fieldsToUpdate.push("technology = ?");
      params.push(JSON.stringify(productData.technology));
    }

    params.push(productData.id);

    const fieldsToUpdateString = fieldsToUpdate.join(", ");

    const query = `UPDATE product SET ${fieldsToUpdateString}, updated_at = CURDATE() WHERE id = ?`;

    const [result] = await connection.query(query, params);

    return result;
  },

  getProductBySlug: async (connection, slug_product) => {
    const query = `SELECT * FROM product WHERE slug = ?`;
    const [result] = await connection.query(query, slug_product);
    return result[0];
  },

  updateStatusProduct: async (connection, data) => {
    const query = `UPDATE product SET status_id = ? WHERE id = ?`;
    const [rows, fields] = await connection.query(query, [
      data.status_id,
      data.product_id,
    ]);
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
      console.error("Không xóa được sản phẩm: ", error);
      throw new Error("Không tìm thấy sản phẩm với id này");
    }
  },

  //----------------------------- product category ------------------------------
  addProductCategory: async (connection, product_id, category_id) => {
    const query = `INSERT INTO categories_products (product_id, category_id) VALUES (?, ?)`;
    const [result] = await connection.query(query, [product_id, category_id]);
    return result;
  },

  //--------------------------- classify ------------------------------

  findClassifyById: async (connection, id) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `classify` WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  getClassifyByField: async (connection, field, value) => {
    const query = `SELECT * FROM \`classify\` WHERE ${field} = ?`;
    const [rows, fields] = await connection.execute(query, [value]);
    return rows;
  },

  addClassify: async (connection, productId, classifyData) => {
    const query = `INSERT INTO classify (product_id, name,price,url_download,created_at, updated_at) VALUES (?, ?,?,?, CURDATE(), CURDATE())`;
    const [result] = await connection.query(query, [
      productId,
      classifyData.name,
      classifyData.price,
      classifyData.url_download,
    ]);
    return result;
  },

  updateClassify: async (connection, productId, classifyData) => {
    const fieldsToUpdate = [];
    const params = [];

    if (classifyData.name !== undefined) {
      fieldsToUpdate.push("name = ?");
      params.push(classifyData.name);
    }
    if (productId !== undefined) {
      fieldsToUpdate.push("product_id = ?");
      params.push(productId);
    }
    if (classifyData.price !== undefined) {
      fieldsToUpdate.push("price = ?");
      params.push(classifyData.price);
    }
    if (classifyData.url_download !== undefined) {
      fieldsToUpdate.push("url_download = ?");
      params.push(classifyData.url_download);
    }
    params.push(classifyData.id);

    const fieldsToUpdateString = fieldsToUpdate.join(", ");
    const query = `UPDATE classify SET ${fieldsToUpdateString}, updated_at = NOW() WHERE id = ?`;

    const [result] = await connection.query(query, params);
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
};

export default ProductModel;
