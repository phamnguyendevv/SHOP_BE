import connection from '../db/configMysql.js';
import CategoryModel from '../models/categoryModel.js';
import ProductModel from '../models/productModel.js';
import UserModel from '../models/userModel.js';
import password from '../utils/password.js';
import crypto from 'crypto';
import ErrorWithStatus from '../utils/error.js';
import { Console } from 'console';
import { CONNREFUSED } from 'dns';

let CategoryService = {


    // add new category
    addCategory: async (category) => {
        try {
            // Thực hiện truy vấn INSERT
            const rows = await CategoryModel.addCategory(connection, category);
          } catch (err) {
            throw new Error("Không thêm được danh mục mới")
          }
    },

   //get all categories
    getAllCategories: async (category) => {
        try {
            const categories = await CategoryModel.getAllCategories(connection,category);
            return categories[0];
        } catch (error) {
            throw new Error("Không lấy được danh mục")
        }
    },

    //update category
    updateCategory: async (category) => {
        try {

            const result = await CategoryModel.updateCategory(connection, category);
        } catch (error) {
            throw new Error("Không cập nhật được danh mục")
        }

    },


    //deleteCategory
    deleteCategory: async (body) => {
        console.log(body)
        try {
            const result = await CategoryModel.deleteCategory(connection, body);
            return result;
        } catch (error) {
            // Xử lý lỗi ở đây
            throw new Error("Không xóa được danh mục")
        
           
        }
    }
  
}

export default CategoryService;
