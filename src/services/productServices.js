import connection from '../db/configMysql.js';
import ProductModel from '../models/productModel.js';
import UserModel from '../models/userModel.js';
import password from '../utils/password.js';
import crypto from 'crypto';


let ProductServices = {
    //addProduct 
    addProduct: async (product) => {
        try {
            const result = await ProductModel.addProduct(connection, product);
            return result;
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Error in addProduct:', error);
            throw error;
        }
    },


  
}

export default ProductServices;


