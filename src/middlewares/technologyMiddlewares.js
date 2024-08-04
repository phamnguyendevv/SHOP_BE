import UserModel from "../models/userModel.js";
import validate from "../utils/validate.js";
import USERS_MESSAGES from "../constants/messages.js";
import { checkSchema } from "express-validator";
import CategoryModel from "../models/categoryModel.js";
import TechnologyModel from "../models/technologyModel.js";
import Connection from "../db/configMysql.js";
const connection = await Connection.getConnection();

let technologyMiddlewares = {
  // add category validator
  addTechnologyValidator: validate(
    checkSchema(
      {
        category_id: {
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
              return true;
            },
          },
        },
        name: {
          trim: true,
          custom: {
            options: async (value, { req }) => {
              const technology = await TechnologyModel.getTechnologyByField(
                "name",
                value
              );
              if (technology.length > 0) {
                throw new Error("Công nghệ đã tồn tại");
              }
              return true;
            },
          },
        },
      },
      ["body"]
    )
  ),
  updateTechnologyValidator: validate(
    checkSchema(
      {
        id: {
          trim: true,
          custom: {
            options: async (value, { req }) => {
              const technology = await TechnologyModel.getTechnologyByField(
                "id",
                value
              );
              if (!technology) {
                throw new Error("Công nghệ không tồn tại");
              }
              return true;
            },
          },
        },
        category_id: {
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
                throw new Error("Danh mục không tồn tại ");
              }
              return true;
            },
          },
        },
        name: {
          trim: true,
          custom: {
            options: async (value, { req }) => {
              const technology = await TechnologyModel.getTechnologyByField(
                "name",
                value
              );
              if (technology.length > 0) {
                throw new Error("Công nghệ đã tồn tại");
              }
              return true;
            },
          },
        },
      },
      ["body"]
    )
  ),
    deleteTechnologyValidator: validate(
    checkSchema(
      {
        id: {
          trim: true,
              custom: {
              
                  options: async (value, { req }) => {
              const technology = await TechnologyModel.getTechnologyByField(
                "id",
                value
                  );
              if (!technology) {
                throw new Error("Công nghệ không tồn tại");
              }
              return true;
            },
          },
        },
      },
    )),

};

export default technologyMiddlewares;
