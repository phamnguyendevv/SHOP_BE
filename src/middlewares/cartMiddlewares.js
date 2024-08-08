import UserModel from "../models/userModel.js";
import validate from "../utils/validate.js"; // Đảm bảo đường dẫn đúng
import ProductModel from "../models/productModel.js";
import { checkSchema } from "express-validator";
import statusProductModel from "../models/statusProductModel.js";
import cartModel from "../models/cartModel.js";
import Connection from "../db/configMysql.js";
import ClassifyModel from "../models/classifyModel.js";
import DiscountModel from "../models/DiscountModel.js";
const connection = await Connection.getConnection();

let cartMiddlewares = {
  addCartValidator: validate(
    checkSchema(
      {
        product_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã sản phẩm phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const product = await ProductModel.getProductByField("id", value);
              const classify = await ClassifyModel.getClassifyByField(
                "product_id",
                value
              );
              if (!product) {
                throw new Error("Không tìm thấy sản phẩm");
              }
              if (classify.length === 0) {
                throw new Error("Sản phẩm chưa có loại");
              }
              req.product = product;
              return true;
            },
          },
        },
        user_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã người dùng phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const user = await UserModel.getUserByField("id", value);
              if (!user) {
                throw new Error("Không tìm thấy người dùng");
              }
              return true;
            },
          },
        },
        classify_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã loại phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const id = Number(value);
              const classifyProduct = await ClassifyModel.getClassifyByFields(
                "id = ? AND product_id = ?",
                [id, req.product.id]
              );
              if (classifyProduct.length === 0) {
                throw new Error("Sai loạn sản phẩm");
              }
              return true;
            },
          },
        },
      },
      ["body"]
    )
  ),
  updateCartValidator: validate(
    checkSchema(
      {
        cart_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã giỏ hàng phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const cart = await cartModel.getCartByField("id", value);
              if (cart.length === 0) {
                throw new Error("Không tìm thấy giỏ hàng");
              }
              req.cart = cart;
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
              const product = await cartModel.getCartByFields(
                " product_id = ? AND id = ?",
                [value, req.body.cart_id]
              );
              if (product.length === 0) {
                throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
              }
              req.product = product;
              return true;
            },
          },
        },
        user_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã người dùng phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const user = await UserModel.getUserByField("id", value);
              if (user.lenght === 0) {
                throw new Error("Không tìm thấy người dùng");
              }

              const cart = await cartModel.getCartByFields(
                "user_id = ? AND id = ?",
                [value, req.body.cart_id]
              );
              if (cart.length === 0) {
                throw new Error("Không tìm thấy giỏ hàng");
              }
              req.user = user;
              return true;
            },
          },
        },
        status_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã trạng thái phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const status = await statusProductModel.getStatusById(value);
              if (!status) {
                throw new Error("Không tìm thấy trạng thái sản phẩm");
              }
              req.status = status;
              return true;
            },
          },
        },
        classify_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã loại phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const id = Number(value);
              const classifyProduct = await ClassifyModel.getClassifyByFields(
                "id = ? AND product_id = ?",
                [id, req.product[0].id]
              );
              if (classifyProduct.length === 0) {
                throw new Error("Sai loại sản phẩm");
              }
              return true;
            },
          },
        }
       
      },
      ["body"]
    )
  ),
  removeFromCartValidator: validate(
    checkSchema(
      {
        product_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã sản phẩm phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const product = await cartModel.getCartByField("product_id", value);
              if (product.length === 0) {
                throw new Error("Sản phẩm không tồn tại trong giỏ hàng");
              }
              req.product = product;
              return true;
            },
          },
        },
        user_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã người dùng phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const user = await UserModel.getUserByField("id", value);
              if (!user) {
                throw new Error("Không tìm thấy người dùng");
              }
              const cart = await cartModel.getCartByFields(
                "user_id = ? AND product_id = ?",
                [value, req.body.product_id]
              );
              if (cart.length === 0) {
                throw new Error("Không tìm thấy giỏ hàng");
              }
              req.user = user;
              return true;
            },
          },
        },
      },
      ["body"]
    )
  ),
};

export default cartMiddlewares;
