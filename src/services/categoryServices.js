
import CategoryModel from '../models/categoryModel.js';
import ProductModel from '../models/productModel.js';
import crypto from 'crypto';
import getSlug from 'speakingurl'
import Connection from '../db/configMysql.js';
const connection = await Connection();

let CategoryService = {
    createSlug: async (name) => {
        const slug = getSlug(name, { lang: 'vn' });
        let fullSlug, existingCategory;
        do {
            const randomInt = crypto.randomBytes(4).readUInt32LE();
            fullSlug = `${slug}-${randomInt}`;
         existingCategory = await CategoryModel.getCategoryByField(
             connection,
             'slug',
           fullSlug
         );
        } while (existingCategory); 
        return fullSlug;

    },


    

    // add new category
    addCategory: async (data) => {
 
        try {
            data.slug = await CategoryService.createSlug(data.name);
            const rows = await CategoryModel.addCategory(connection, data);
            console.log("rows", rows);
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
    getCategoryList: async (data) => {
        try {
            const { pagingParams, filterParams } = data;
            const { keyword, pageIndex, isPaging, pageSize } = pagingParams;
            const { is_popular } = filterParams;
            // Construct the SQL query
            let query = `SELECT p.* FROM categories p `;
            let conditions = [];
            let joins = [];
            if (keyword) {
                conditions.push(`p.name LIKE '%${keyword}%'`);
            }
            if (is_popular === 1) {
                conditions.push(`p.is_popular = 1`);
            }

            // Combine joins and conditions
            if (joins.length > 0) {
                query += joins.join(" ");
            }
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }

            // Apply paging
            if (isPaging) {
                const offset = (pageIndex - 1) * pageSize;
                query += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }

            const totalCountQuery =
                `SELECT COUNT(DISTINCT p.id) as totalCount FROM categories p ` +
                (joins.length > 0 ? joins.join(" ") : "") +
                (conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "");

            const [totalCountRows, totalCountFields] = await connection.query(
                totalCountQuery
            );
            const totalCount = totalCountRows[0].totalCount;

            // Calculate total pages
            const totalPage = Math.ceil(totalCount / pageSize);

            // Execute main query to get data
            const [rows, fields] = await connection.query(query);

            return { data: rows, meta: { total: totalCount, totalPage: totalPage } };
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
