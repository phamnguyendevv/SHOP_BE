
import CategoryModel from '../models/categoryModel.js';
import ProductModel from '../models/productModel.js';
import crypto from 'crypto';
import getSlug from 'speakingurl'
import Connection from '../db/configMysql.js';
import e from 'express';
const connection = await Connection();

let CategoryService = {
    createSlug : async (name) => {
        const slug = getSlug(name, { lang: 'vn' });
    
        let fullSlug, existingCategory;
        do {
            const randomInt = crypto.randomBytes(4).readUInt32LE();
            fullSlug = `${slug}.cat-${randomInt}`;
            
         existingCategory = await CategoryModel.getCategoryBySlug(connection, fullSlug);
        } while (existingCategory);
    
        return fullSlug;
    },

    // add new category
    addCategory: async (payload) => {
        try {
            payload.slug_categories = await CategoryService.createSlug(payload.name)
            
            const rows = await CategoryModel.addCategory(connection, payload);
            return rows;
        } catch (err) {
            throw new Error("Không thêm được danh mục mới")
        }
    },

    //get all categories
    getAllCategories: async (category) => {
        try {
            const categories = await CategoryModel.getAllCategories(connection, category);
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
    deleteCategory: async (id) => {
        try {
            const result = await CategoryModel.deleteCategory(connection, id);
            return result;
        } catch (error) {
            // Xử lý lỗi ở đây
            throw new Error("Không xóa được danh mục")


        }
    }

}

export default CategoryService;
