import connection from '../db/configMysql.js';
import CategoryModel from '../models/categoryModel.js';
import ProductModel from '../models/productModel.js';
import UserModel from '../models/userModel.js';
import password from '../utils/password.js';
import crypto from 'crypto';


let CategoryService = {

   //get all categories
    getAllCategories: async () => {
        try {
            const categories = await CategoryModel.getAllCategories(connection);
            return categories[0];
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Error in getAllCategories:', error);
            throw error;
        }
    },
  
}

export default CategoryService;
