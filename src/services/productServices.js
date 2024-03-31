import connection from '../db/configMysql.js';
import ProductModel from '../models/productModel.js';
import UserModel from '../models/userModel.js';
import password from '../utils/password.js';
import crypto from 'crypto';


let ProductServices = {
    createSlug: async (title) => {
        let slug = slugify(title, {
          lower: true,
          remove: /[*+~.()'"!:@]/g,
        });
        let randomString = crypto.randomBytes(4).toString("hex");
        let fullSlug = `${randomString}-${slug}`;
    
        // Kiểm tra xem slug đã tồn tại chưa
        let existingProduct = await db.Product.findOne({
          where: { slug: fullSlug },
        });
        while (existingProduct) {
          // Nếu slug đã tồn tại, tiếp tục tạo slug mới và kiểm tra lại
          randomString = crypto.randomBytes(4).toString("hex");
          fullSlug = `${slug}-${randomString}`;
          existingProduct = await db.Product.findOne({
            where: { slug: fullSlug },
          });
        }
        return fullSlug;
      },
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


