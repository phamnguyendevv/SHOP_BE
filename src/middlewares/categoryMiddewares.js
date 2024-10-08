import UserModel from "../models/userModel.js";
import validate from "../utils/validate.js";
import { checkSchema } from "express-validator";
import CategoryModel from "../models/categoryModel.js";

let categoryMiddlewares = {
  // add category validator
  addCategoryValidator: validate(
    checkSchema(
      {
        // user_id: {
        //     trim: true,
        //     isNumeric: {
        //         errorMessage: 'Mã người dùng phải là số',
        //     },
        //     custom: {
        //         options: async (value, { req }) => {
        //             const user = await UserModel.getUserByField("id", value);
        //             if (!user) {
        //                 throw new Error('Người dùng không tồn tại');
        //             }
        //             return true;
        //         },
        //     },
        // },
        name: {
          trim: true,
          isLength: {
            options: { min: 2 },
            errorMessage: "Tên danh mục phải có ít nhất 2 ký tự",
          },
          custom: {
            options: async (value, { req }) => {
              const category = await CategoryModel.getCategoryByField(
                "name",
                value);
              if (category.length > 0) {
                throw new Error("Danh mục đã tồn tại");
              }
              return true;
            },
          },
        },
        image: {
          trim: true,
        },
      },
      ["body"]
    )
  ),
  //update category validator
  updateCategoryValidator: validate(
    checkSchema(
      {
        user_id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã người dùng phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const user = await UserModel.getUserByField("id", value);
              if (!user) {
                throw new Error("Người dùng không tồn tạii");
              }
              return true;
            },
          },
        },

        id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã danh mục phải là số",
          },
          custom: {
            options: async (value, { req }) => {
              const category = await CategoryModel.getCategoryByField(
                "id",
                value
              );

              if (!category) {
                throw new Error("Danh mục không tồn tại");
              }
              req.category = category;
              return true;
            },
          },
        },
      },
      ["body"]
    )
  ),

  //delete category validator
  deleteCategoryValidator: validate(
    checkSchema(
      {
        id: {
          trim: true,
          isNumeric: {
            errorMessage: "Mã danh mục phải là số",
          },

          custom: {
            options: async (value, { req }) => {
              const category = await CategoryModel.getCategoryByField(
                "id",
                value
              );
              if (!category) {
                throw new Error("Category not found");
              }

              req.category = category;
              return true;
            },
          },
        },
      },
      ["query"]
    )
  ),
};

export default categoryMiddlewares;
