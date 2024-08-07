import UserModel from "../models/userModel.js";
import validate from "../utils/validate.js"; // Đảm bảo đường dẫn đúng
import USERS_MESSAGES from "../constants/messages.js";
import { checkSchema } from "express-validator";
import Connection from "../db/configMysql.js";
const connection = await Connection.getConnection();

import passwordhandler from "../utils/password.js";
import ErrorWithStatus from "../utils/error.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import DiscountModel from "../models/DiscountModel.js";

let discountMiddlewares = {
  //add discount validator
  addDiscountValidator: validate(
    checkSchema(
      {
        user_id: {
          trim: true,
          isNumeric: {
            errorMessage: "User id must be a number",
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
        name: {
          trim: true,
          isLength: {
            options: { min: 2 },
            errorMessage: "Tên giảm giá phải có ít nhất 2 ký tự",
          },
        },
      },
      ["body"]
    )
  ),
  // update discount validator
  updateDiscountValidator: validate(
    checkSchema(
      {
        id: {
          trim: true,
          isNumeric: {
            errorMessage: "Discount id must be a number",
          },
          custom: {
            options: async (value, { req }) => {
              const discount = await DiscountModel.getDiscountByField(
                "id",
                value
              );
              if (!discount) {
                throw new Error("Không tìm thấy mã giảm giá");
              }
              return true;
            },
          },
        },
        user_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã giảm giá phải là số",
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
        name: {
          trim: true,
          isLength: {
            options: { min: 2 },
            errorMessage: "Tên giảm giá phải có ít nhất 2 ký tự",
          },
        },
      },
      ["body"]
    )
  ),
};

export default discountMiddlewares;
