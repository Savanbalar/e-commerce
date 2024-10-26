const Joi = require('joi');

const createProductDetails = {
  body: Joi.object().keys({
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    total: Joi.number().required(),
  }),
};

const updateProductdetails = {
  params: Joi.object().keys({
    _id: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      price: Joi.number(),
      quantity: Joi.number(),
      total: Joi.number(),
    })
    .min(1),
};

const deleteProductDetails = {
  params: Joi.object().keys({
    _id: Joi.string(),
  }),
};

module.exports = {
  createProductDetails,
  updateProductdetails,
  deleteProductDetails
};
