const Joi = require('joi');
const { join } = require('path');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    stock: Joi.number().required(),
    image: Joi.string().required(),
  }),
};


const updateProduct = {
  params: Joi.object().keys({
    _id: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      stock: Joi.number(),
      image: Joi.string(),
    })
  
};

const deleteProduct = {
  params: Joi.object().keys({
    _id: Joi.string(),
  }),
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct
};
