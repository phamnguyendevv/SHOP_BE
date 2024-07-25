import UserModel from "../models/userModel.js";
import validate from "../utils/validate.js"; // Đảm bảo đường dẫn đúng
import ProductModel from "../models/productModel.js";
import CategoryModel from "../models/categoryModel.js";
import { validationResult, check, body, checkSchema } from "express-validator";

import Connection from "../db/configMysql.js";
const connection = await Connection();

const productDataSchema = {
  user_id: {
    in: ["body"],
    trim: true,
    isNumeric: {
      errorMessage: "Mã người dùng phải là số",
    },
    custom: {
      options: async (value, { req }) => {
        const user = await UserModel.getUserById(connection, value);
        if (!user) {
          throw new Error("Người dùng không tồn tại");
        }
        return true;
      },
    },
  },
  name_product: {
    in: ["body"],
    trim: true,
    isLength: {
      options: { min: 1 },
      errorMessage: "Tên sản phẩm không được để trống",
    },
  },
  price: {
    in: ["body"],
    isFloat: {
      options: { min: 0 },
      errorMessage: "Giá sản phẩm phải là số dương",
    },
  },
  url_Demo: {
    in: ["body"],
    isURL: {
      options: { require_protocol: true },
      errorMessage: "Định dạng URL demo không hợp lệ",
    },
  },
  categories: {
    in: ["body"],
    isArray: {
      errorMessage: "Category must be an array",
    },
    custom: {
      options: (value) => Array.isArray(value) && value.length > 0,
      errorMessage: "Phải chọn ít nhất một danh mục",
    },
  },
  description: {
    in: ["body"],
    trim: true,
    isLength: {
      options: { min: 1 },
      errorMessage: "Mô tả sản phẩm không được để trống",
    },
  },
  technology: {
    in: ["body"],
    isArray: {
      errorMessage: "Technology must be an array",
    },
    custom: {
      options: (value) => Array.isArray(value) && value.length > 0,
      errorMessage: "Phải chọn ít nhất một công nghệ",
    },
  },
};

// Define validation schema for classify data
const classifyDataSchema = {
  name_classify: {
    in: ["body", "classifyData"],
    trim: true,
    isLength: {
      options: { min: 1 },
      errorMessage: "Tên phân loại sản phẩm không được để trống",
    },
  },
  price_classify: {
    in: ["body", "classifyData"],
    isURL: {
      options: { require_protocol: true },
      errorMessage: "Định dạng URL hình ảnh không hợp lệ",
    },
  },
  url_download: {
    // Corrected field name
    in: ["body", "classifyData"],
    isURL: {
      options: { require_protocol: true },
      errorMessage: "Định dạng URL tải xuống không hợp lệ",
    },
  },
};

let productMiddlewares = {
  addProductValidator: validate(
    checkSchema({
      "productData.user_id": {
        trim: true,
        isNumeric: {
          errorMessage: "Mã người dùng phải là số",
        },
        custom: {
          options: async (value, { req }) => {
            const user = await UserModel.getUserById(connection, value);
            if (!user) {
              throw new Error("Người dùng không tồn tại");
            }
            return true;
          },
        },
      },
      "productData.name": {
        in: ["body"],
        trim: true,
        isLength: {
          options: { min: 1 },
          errorMessage: "Tên sản phẩm không được để trống",
        },
      },
      "productData.price": {
        in: ["body"],
        isFloat: {
          options: { min: 0 },
          errorMessage: "Giá sản phẩm phải là số dương",
        },
      },
      "productData.url_demo": {
        in: ["body"],
        isString: {
          errorMessage: "URL demo phải là chuỗi",
        },
      },
      "productData.description": {
        in: ["body"],
        trim: true,
        isLength: {
          options: { min: 1 },
          errorMessage: "Mô tả sản phẩm không được để trống",
        },
      },
      "productData.technology": {
        in: ["body"],
        isArray: {
          errorMessage: "Công nghệ sản phẩm phải là mảng",
        },
        custom: {
          options: (value) => Array.isArray(value) && value.length > 0,
          errorMessage: "Phải chọn ít nhất một công nghệ",
        },
      },

      "classifyData.*.name": {
        in: ["body"],
        trim: true,
        isLength: {
          options: { min: 1 },
          errorMessage: "Tên sản phẩm không được để trống",
        },
      },
      "classifyData.*.price": {
        in: ["body"],
        trim: true,
      },
      "classifyData.*.url_download": {
        in: ["body"],
        trim: true,
      },
    })
  ),
  //update product validator
  updateProductValidator: validate(
    checkSchema(
      {
        "productData.id": {
          trim: true,
          isNumeric: {
            errorMessage: "Mã sản phẩm phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const user = await ProductModel.findProductById(
                connection,
                value
              );
              if (!user) {
                throw new Error("Sản phảm không tồn tại");
              }
              return true;
            },
          },
        },
        "productData.user_id": {
          trim: true,
          isNumeric: {
            errorMessage: "Mã người dùng phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const user = await UserModel.getUserById(connection, value);
              if (!user) {
                throw new Error("Người dùng không tồn tại");
              }
              return true;
            },
          },
        },
        "productData.name": {
          trim: true,
          isString: {
            errorMessage: "Tên sản phẩm phải là chuỗi",
          },
        },
        "productData.price": {
        },
        "productData.url_demo": {
          isURL: {
            options: { require_protocol: true },
            errorMessage: "Định dạng URL demo không hợp lệ",
          },
        },
        "productData.categories": {
          isArray: {
            errorMessage: "Danh mục sản phẩm phải là mảng",
          },
          custom: {
            options: (value) => Array.isArray(value) && value.length > 0,
            errorMessage: "Phải chọn ít nhất một danh mục",
          },
        },
        "productData.description": {
        
          isLength: {
            options: { min: 1 },
            errorMessage: "Mô tả sản phẩm không được để trống",
          },
        },
        "productData.technology": {
          isArray: {
            errorMessage: "Công nghệ sản phẩm phải là mảng",
          },
          custom: {
            options: (value) => Array.isArray(value) && value.length > 0,
            errorMessage: "Phải chọn ít nhất một công nghệ",
          },
        },

        "classifyData.*.id": {
          trim: true,
          custom: {
            options: async (value, { req }) => {
              const classify = await ProductModel.findClassifyById(
                connection,
                value
              );
              if (!classify) {
                throw new Error("Không tìm thấy loại sản phẩm");
              }
              return true;
            },
          },
        },
        "classifyData.*.name": {
          isLength: {
            options: { min: 1 },
            errorMessage: "Tên sản phẩm không được để trống",
          },
        },
        "classifyData.*.price": {
          isNumeric: {
            errorMessage: "Giá sản phẩm phải là số",
          }
        },
        "classifyData.*.url_download": {
          isString: {
            errorMessage: "URL tải xuống phải là chuỗi",
          }
        },
      },
      ["body"]
    )
  ),
  //delete product validator

  deleteProductValidator: validate(
    checkSchema(
      {
        id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã sản phẩm phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const product = await ProductModel.getProductByField(
                connection,
                "id",
                value
              );
              console.log(product);
              if (!product) {
                throw new Error("Không tìm thầy sản phẩm");
              }
              return true;
            },
          },
        },
      },
      ["query"]
    )
  ),
};

export default productMiddlewares;
