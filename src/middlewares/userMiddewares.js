import UserModel from "../models/userModel.js";
import validate from "../utils/validate.js"; // Đảm bảo đường dẫn đúng
import USERS_MESSAGES from "../constants/messages.js";
import { checkSchema } from "express-validator";
import passwordhandler from "../utils/password.js";

let userMiddlewares = {
  //register validator
  registerValidator: validate(
    checkSchema(
      {
        full_name: {
          trim: true,
          isLength: {
            options: { min: 6 },
            errorMessage:
              USERS_MESSAGES.USERNAME_MUST_BE_LONGER_THAN_6_CHARACTERS,
          },
          custom: {
            options: async (value) => {
              const user = await UserModel.getUserByField("full_name", value);
              if (user) {
                throw new Error(USERS_MESSAGES.FULL_NAME_ALREADY_EXISTS);
              }
              return true;
            },
          },
        },
        email: {
          trim: true,
          isEmail: {
            errorMessage: USERS_MESSAGES.INVALID_EMAIL,
          },
          matches: {
            options: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/],
            errorMessage: USERS_MESSAGES.INVALID_EMAIL,
          },
          custom: {
            options: async (value) => {
              const user = await UserModel.getUserByField("email", value);

              if (user) {
                throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS);
              }

              return true;
            },
          },
        },
        password: {
          trim: true,
          isLength: {
            options: { min: 8 },
            errorMessage:
              USERS_MESSAGES.PASSWORD_MUST_BE_LONGER_THAN_8_CHARACTERS,
          },
        },
      },
      ["body"]
    )
  ),

  //login validator
  loginValidator: validate(
    checkSchema(
      {
        email: {
          trim: true,
          isEmail: {
            errorMessage: USERS_MESSAGES.INVALID_EMAIL,
          },
          custom: {
            options: async (value, { req }) => {
              const user = await UserModel.getUserByField("email", value);
              if (!user) {
                throw new Error(USERS_MESSAGES.USER_NOT_FOUND);
              }
              const isBan = user.status_id === 3;
              if (isBan) {
                throw new Error(USERS_MESSAGES.ACCOUNT_IS_BANNED);
              }
              req.user = user;

              return true;
            },
          },
        },
        password: {
          trim: true,
          isLength: {
            options: { min: 3 },
            errorMessage: USERS_MESSAGES.MATCH_PASSWORD,
          },
          custom: {
            options: async (value, { req }) => {
              const user = req.user;
              const password = user.password;
              const isMatch = await passwordhandler.comparePassword(
                value,
                password
              );
              if (!isMatch) {
                throw new Error(USERS_MESSAGES.PASSWORD_NOT_MATCH);
              }
              return true;
            },
          },
        },
      },
      ["body"]
    )
  ),

  updateValidator: validate(
    checkSchema(
      {
        id: {
          custom: {
            options: async (value) => {
              const user = await UserModel.getUserByField("id", value);
              if (!user) {
                throw new Error(USERS_MESSAGES.USER_NOT_FOUND);
              }
              return true;
            },
          },
        },
      },
      ["body"]
    )
  ),

  changePassword: validate(
    checkSchema(
      {
        id: {
          trim: true,
          custom: {
            options: async (value, { req }) => {
              const user = await UserModel.getUserByField(
                "id",
                value
              );
              if (!user) {
                throw new Error(USERS_MESSAGES.USER_NOT_FOUND);
              }
              // check ban hay ko
              req.user = user;
              return true;
            },
          },
        },
        oldPassword: {
          trim: true,
          isLength: {
            options: { min: 3 },
            errorMessage: USERS_MESSAGES.MATCH_PASSWORD,
          },
          custom: {
            options: async (value, { req }) => {
              const user = req.user;
              const password = user.password;
              const isMatch = await passwordhandler.comparePassword(
                value,
                password
              );
              if (!isMatch) {
                throw new Error(USERS_MESSAGES.PASSWORD_NOT_MATCH);
              }
              return true;
            },
          },
        },
      },
      ["body"]
    )
  ),

  forgotPassword: validate(
    checkSchema(
      {
        email: {
          trim: true,
          isEmail: {
            errorMessage: USERS_MESSAGES.INVALID_EMAIL,
          },
          custom: {
            options: async (value, { req }) => {
              const user = await UserModel.getUserByField("email", value);
              if (!user) {
                throw new Error(USERS_MESSAGES.USER_NOT_FOUND);
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

export default userMiddlewares;
