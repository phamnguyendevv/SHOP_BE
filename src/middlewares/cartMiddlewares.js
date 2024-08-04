import UserModel from "../models/userModel.js";
import validate from "../utils/validate.js"; // Đảm bảo đường dẫn đúng
import ProductModel from "../models/productModel.js";
import { checkSchema } from "express-validator";
import statusProductModel from "../models/statusProductModel.js";
import cartModel from "../models/cartModel.js";
import Connection from "../db/configMysql.js";
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
              const product = await ProductModel.getProductByField(
                connection,
                "id",
                value
              );
              if (!product) {
                throw new Error("Không tìm thấy sản phẩm");
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
              req.user = user;
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
        product_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã sản phẩm phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const product = await cartModel.getCartByProductId(
                connection,
                value
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
              if (!user) {
                throw new Error("Không tìm thấy người dùng");
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
              const status = await statusProductModel.getStatusById(
                connection,
                value
              );
              if (!status) {
                throw new Error("Không tìm thấy trạng thái sản phẩm");
              }
              req.status = status;
              return true;
            },
          },
        },
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
              const product = await cartModel.getCartByProductId(
                connection,
                value
              );
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
