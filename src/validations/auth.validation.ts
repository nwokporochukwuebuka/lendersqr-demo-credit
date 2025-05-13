import Joi from "joi";
import { IAuthRegister } from "../interface";
import { password } from "./custom.validation";

export const registerValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    pin: Joi.string()
      .pattern(/^\d{4}$/)
      .required()
      .messages({
        "string.pattern.base": "PIN must be 4 digits.",
        "string.empty": "PIN is required.",
      })
      .required(),
    password: Joi.string().custom(password).required(),
  }),
};

export const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
  }),
};
