import UserModel from "../models/userModel.js";
import validate from "../utils/validate.js"; // Đảm bảo đường dẫn đúng
import ProductModel from "../models/productModel.js";
import CategoryModel from "../models/categoryModel.js";
import { validationResult, check, body, checkSchema } from "express-validator";
import ClassifyModel from "../models/classifyModel.js";
import ImageModel from "../models/imageModel.js";
import Connection from "../db/configMysql.js";
const connection = await Connection.getConnection();

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
            const user = await UserModel.getUserByField("id", value);
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
      "productData.technologies": {
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
              const user = await ProductModel.getProductByField(
                "id",
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
              const user = await UserModel.getUserByField("id", value);
              if (!user) {
                throw new Error("Người dùng không tồn tại");
              }
              return true;
            },
          },
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
  addImageValidator: validate(
    checkSchema({
      product_id: {
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
            if (!product) {
              throw new Error("Không tìm thấy sản phẩm");
            }
            return true;
          },
        },
      },
      url: {
        in: ["body"],
      },
    })
  ),
  updateImageValidator: validate(
    checkSchema({
      id: {
        trim: true,
        isNumeric: {
          errorMessage: "Mã ảnh phải là số",
        },
        custom: {
          options: async (value, { req }) => {
            const image = await ImageModel.getImageByField(
              connection,
              "id",
              value
            );
            if (!image) {
              throw new Error("Không tìm thấy ảnh");
            }
            return true;
          },
        },
      },
      product_id: {
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
            if (!product) {
              throw new Error("Không tìm thấy sản phẩm");
            }
            return true;
          },
        },
      },
      url: {
        in: ["body"],
      },
    })
  ),
  deleteImageValidator: validate(
    checkSchema({
      id: {
        trim: true,
        isNumeric: {
          errorMessage: "Mã ảnh phải là số",
        },
        custom: {
          options: async (value, { req }) => {
            const image = await ImageModel.getImageByField(
              connection,
              "id",
              value
            );
            if (!image) {
              throw new Error("Không tìm thấy ảnh");
            }
            return true;
          },
        },
      },
    })
  ),
  getImageValidator: validate(
    checkSchema({
      id: {
        trim: true,
        isNumeric: {
          errorMessage: "Mã ảnh phải là số",
        },
        custom: {
          options: async (value, { req }) => {
            const image = await ImageModel.getImageByField(
              connection,
              "id",
              value
            );
            if (!image) {
              throw new Error("Không tìm thấy ảnh");
            }
            return true;
          },
        },
      },
    })
  ),
};

export default productMiddlewares;
