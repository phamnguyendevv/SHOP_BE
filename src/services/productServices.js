import connection from '../db/configMysql.js';
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
  
    data.slug = await ProductServices.createSlug(data.name);
    const result = await ProductModel.addProduct(connection, data);
    return result;
  },
  updateProduct: async (data) => {
    data.slug = await ProductServices.createSlug(data.name);
    const result = await ProductModel.updateProduct(connection, data);
    return result;
  },
  deleteProduct: async (product) => {
    const result = await ProductModel.deleteProduct(connection, data);
    return result;
  },
  getProductByCategory: async (data) => {
    const { category, limit, page } = data


    const result = await ProductModel.getProductByCategory(connection, category, page, limit);
    return result;
  },

  getOneProduct: async (data) => {
    
    const result = await ProductModel.getOneProduct(connection, data);
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
  }








}

export default ProductServices;


