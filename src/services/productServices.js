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
    const { productData, classifyData } = data;
    const slug_product = await ProductServices.createSlug(productData.name_product);
    productData.slug_product = slug_product
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
    const { productData, classifyData } = data;
    const update_product = await ProductModel.updateProduct(connection, productData);
    const productId = productData.id;
    const classifyDataArray = classifyData.map((classifyData) => {
      classifyData.product_id = productId;
      return classifyData;
    }
    );
    const insertClassifyPromises = classifyDataArray.map((classifyData) => {
      return ProductModel.updateClassify(connection, classifyData);
    }
    );
    await Promise.all(insertClassifyPromises);
    return update_product;


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
  getProductBySlug: async (slug_product) => {

    const product = await ProductModel.getProductBySlug(connection, slug_product);
    const classify = await ProductModel.getClassifyByProduct(connection, product.id);
    const result = { product, classify };
    return result;
  },

  // --------------------------------------------product Popular--------------------------------------------

  updateProductPopular: async (data) => {
    const result = await ProductModel.updateProductPopular(connection, data);
    return result;
  },
  getProductPopularByCategory: async (data) => {
    const { category, limit, page, popular } = data

    const result = await ProductModel.getProductPopularByCategory(connection, category, limit, page, popular);
    return result;
  },

  getList: async (data) => {
    const { pagingParams, filterParams } = data;
    const { orderBy, keyword, pageIndex, isPaging, pageSize, priceRange } = pagingParams;
    const { categories, technology, is_popular } = filterParams;

    // Construct the SQL query
    let query = 'SELECT * FROM product WHERE ';
    let conditions = [];

    // Add conditions for filtering
    if (categories && categories.length > 0) {
      conditions.push(`JSON_CONTAINS(categories, JSON_ARRAY(${categories.map(cat => connection.escape(cat)).join(',')}))`);
    }
    if (technology && technology.length > 0) {
      conditions.push(`JSON_CONTAINS(technology, JSON_ARRAY(${technology.map(tec => connection.escape(tec)).join(',')}))`);
    }
    if (keyword) {
      conditions.push(`name_product LIKE '%${keyword}%'`);
    }
    if (priceRange) {
      conditions.push(`price >= ${priceRange.minPrice} AND price <= ${priceRange.maxPrice}`);
    }
    if (is_popular === 1) {
      conditions.push(`is_popular = 1`);
    }
    // Apply conditions
    if (conditions.length > 0) {
      query += conditions.join(' AND ');
    } else {
      // If no filters are applied, select all products
      query += '1';
    }
    // Apply ordering
    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }
    // Apply paging
    if (isPaging) {
      const offset = (pageIndex - 1) * pageSize;
      query += ` LIMIT ${pageSize} OFFSET ${offset}`;
    }
    console.log(query);
    const [rows, fields] = await connection.query(query);


    return { data: rows };
  },








}

export default ProductServices;


