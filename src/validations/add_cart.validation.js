const Joi = require("joi");
const { join } = require("path");

const createaddCart = {
  body : Joi.object().keys({
    quantity : Joi.number().required(),
    product : Joi.string(),
    user : Joi.string(),
  })
}

const updateaddCart = {
  params : Joi.object().keys({
    _id : Joi.required(),
  }),
  body:Joi.object().keys({
    quantity : Joi.number(),
    product : Joi.string(),
    user : Joi.string(),
  })
}

const deleteaddCart = {
  params: Joi.object().keys({
    _id: Joi.string(),
  }),
};

module.exports = {
  createaddCart,
  updateaddCart,
  deleteaddCart
};
