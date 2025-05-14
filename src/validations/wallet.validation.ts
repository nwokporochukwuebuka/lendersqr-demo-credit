import Joi from "joi";

export const fundWalletValidation = {
  body: Joi.object().keys({
    amount: Joi.number().min(1).required(),
  }),
};

export const withdrawFundsValidation = {
  body: Joi.object().keys({
    pin: Joi.string().required().length(4),
    amount: Joi.number().required().min(1),
  }),
};
export const transferFundsValidation = {
  body: Joi.object().keys({
    pin: Joi.string().required().length(4),
    amount: Joi.number().required().min(1),
    receiverWalletId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};
