import Connection from '../db/configMysql.js';
const connection = await Connection();

import ProductModel from '../models/productModel.js';
import getSlug from 'speakingurl';
import crypto from 'crypto';



let ProductServices = {
  createSlug: async (name) => {
    const slug = getSlug(name, { lang: 'vn' });

    let fullSlug, existingCategory;
    do {
      const randomInt = crypto.randomBytes(4).readUInt32LE();
      fullSlug = `${slug}.prod-${randomInt}`;
      existingCategory = await ProductModel.findProductBySlug(connection, fullSlug);

    } while (!existingCategory);
    return fullSlug;
  },

  //addProduct 
  addProduct: async (data) => {
    const {productData,classifyData} = data;
    const slug_product = await ProductServices.createSlug(productData.name_product);
    data.slug_product = slug_product
    const new_product = await ProductModel.addProduct(connection, productData);
    const productId = new_product.insertId;
    const classifyDataArray = classifyData.map((classifyData) => {
      classifyData.product_id = productId;
      return classifyData;
    }
    );
    const insertClassifyPromises = classifyDataArray.map((classifyData) => {
      return ProductModel.addClassify(connection, classifyData);
    }
    );
    await Promise.all(insertClassifyPromises);
    return new_product;
  },


  updateProduct: async (data) => {
    
    data.slug = await ProductServices.createSlug(data.name);

    const result = await ProductModel.updateProduct(connection, data);
    return result;
  },
  deleteProduct: async (id) => {
    const result = await ProductModel.deleteProduct(connection, id);
    return result;
  },
  getProductByCategory: async (data) => {
    const { category, limit, page } = data


    const result = await ProductModel.getProductByCategory(connection, category, page, limit);
    return result;
  },
  getProductBySlug: async (slug) => {
      
    const result = await ProductModel.getProductBySlug(connection, slug);
    return result;
  },

  // --------------------------------------------product Popular--------------------------------------------

  updateProductPopular: async (data) => {
    const result = await ProductModel.updateProductPopular(connection, data);
    return result;
  },
  getProductPopularByCategory: async (data) => {
    const { category, limit, page, popular} = data
  
    const result = await ProductModel.getProductPopularByCategory(connection, category, limit, page, popular);
    return result;
  },

  getList: async (data) => {
      const { pagingParams, filterParams } = data;
      const { orderBy, keyword, pageIndex, pageSize } = pagingParams;
      const {category } = filterParams;

      const page = (parseInt(pageIndex) || 1) - 1;
      const limit = parseInt(pageSize) || 20; // Giới hạn mặc định là 20

      // Tạo câu truy vấn SQL để tính tổng số lượng bản ghi
      let sql = `SELECT COUNT(*) AS total FROM product`;
      ì
      if (user_id && user_id.length > 0) {
          sql += ` WHERE id IN (${user_id.join(',')})`;
      }

      if (keyword) {
          if (user_id && user_id.length > 0) {
              sql += ` AND fullname LIKE '%${keyword}%'`;
          } else {
              sql += ` WHERE fullname LIKE '%${keyword}%'`;
          }
      }
      const [totalRows] = await connection.query(sql);
      const total = totalRows[0].total;

      const totalPages = Math.ceil(total / pageSize);

      // Tạo câu truy vấn SQL để lấy dữ liệu phân trang
      let query = `SELECT * FROM user`;

      if (user_id && user_id.length > 0) {
          query += ` WHERE id IN (${user_id.join(',')})`;
      }

      if (keyword) {
          if (user_id && user_id.length > 0) {
              query += ` AND fullname LIKE '%${keyword}%'`;
          } else {
              query += ` WHERE fullname LIKE '%${keyword}%'`;
          }
      }

      if (orderBy) {
          query += ` ORDER BY ${orderBy}`;
      }

      query += ` LIMIT ${limit} OFFSET ${page * limit}`;

      // Thực hiện truy vấn SQL để lấy dữ liệu phân trang
      const [rows, fields] = await connection.query(query);

      const meta = {
          total: total,
          totalPage: totalPages
      };

      return { data: rows, meta: meta };
  },








}

export default ProductServices;


