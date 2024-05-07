import UserModel from '../models/userModel.js';
import validate from '../utils/validate.js'; // Đảm bảo đường dẫn đúng
import ProductModel from '../models/productModel.js';
import { checkSchema } from 'express-validator';
import Connection from '../db/configMysql.js';
const connection = await Connection();

const productDataSchema = {
    user_id: {
        in: ['body'],
        isInt: true,
        errorMessage: 'User id là số',
    },
    name_product: {
        in: ['body'],
        trim: true,
        isLength: {
            options: { min: 1 },
            errorMessage: 'Tên sản phẩm không được để trống',
        },
    },
    price: {
        in: ['body'],
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Giá sản phẩm phải là số dương',
        },
    },
    url_Demo: {
        in: ['body'],
        isURL: {
            options: { require_protocol: true },
            errorMessage: 'Định dạng URL demo không hợp lệ',
        },
    },
    category: {
        in: ['body'],
        isArray: {
            errorMessage: 'Category must be an array',
        },
        custom: {
            options: (value) => Array.isArray(value) && value.length > 0,
            errorMessage: 'Phải chọn ít nhất một danh mục',
        },
    },
    description: {
        in: ['body'],
        trim: true,
        isLength: {
            options: { min: 1 },
            errorMessage: 'Mô tả sản phẩm không được để trống',
        },
    },
    technology: {
        in: ['body'],
        isArray: {
            errorMessage: 'Technology must be an array',
        },
        custom: {
            options: (value) => Array.isArray(value) && value.length > 0,
            errorMessage: 'Phải chọn ít nhất một công nghệ',
        },
    },
};

// Define validation schema for classify data
const classifyDataSchema = {
    name_classify: {
        in: ['body', 'classifyData'],
        trim: true,
        isLength: {
            options: { min: 1 },
            errorMessage: 'Tên phân loại sản phẩm không được để trống',
        },
    },
    image_classify: {
        in: ['body', 'classifyData'],
        isURL: {
            options: { require_protocol: true },
            errorMessage: 'Định dạng URL hình ảnh không hợp lệ',
        },
    },
    url_dowload: {
        in: ['body', 'classifyData'],
        isURL: {
            options: { require_protocol: true },
            errorMessage: 'Định dạng URL tải xuống không hợp lệ',
        },
    },
};


let productMiddlewares = {
    //add product validator
    addProductValidator: validate({
        productData: {
            in: ['body'],
            custom: {
                options: (value) => {
                    return checkSchema(productDataSchema)(value);
                },
            },
        },
        classifyData: {
            in: ['body'],
            isArray: {
                errorMessage: 'Classify data must be an array',
            },
            custom: {
                options: (value) => {
                    const errors = value.map((classifyItem) => checkSchema(classifyDataSchema)(classifyItem)).filter((itemErrors) => itemErrors.length > 0);
                    return errors.length === 0;
                },
                errorMessage: 'Invalid classify data',
            },
        },
    }),

  



    //update product validator
    updateProductValidator: validate(checkSchema({
        id: {
            trim: true,
            isNumeric: {
                errorMessage: 'Product id must be a number',
            },
            custom: {
                options: async (value, { req }) => {
                    const product = await ProductModel.findProductById(connection, value);
                    if (!product) {
                        throw new Error('Product not found');
                    }
                    return true;
                },
            },
        },
        user_id: {
            trim: true,
            isNumeric: {
                errorMessage: 'User id must be a number',
            },
            custom: {
                options: async (value, { req }) => {
                    const user = await UserModel.getUserById(connection, value);
                    if (!user) {
                        throw new Error('User not found');
                    }
                    return true;
                },
            },
        }
        
    }, ['body'])),
    //delete product validator

    deleteProductValidator: validate(checkSchema({
        id: {
            trim: true,
            isNumeric: {
                errorMessage: 'Product id must be a number',
            },
            custom: {
                options: async (value, { req }) => {
                    const product = await ProductModel.findProductById(connection, value);
                    if (!product) {
                        throw new Error('Product not found');
                    }
                    return true;
                },
            },
        },
    }, ['query'])),

}


export default productMiddlewares;



