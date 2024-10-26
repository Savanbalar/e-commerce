const Joi = require('joi');

const createUser = {
  body: Joi.object().keys({
    fristName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    mobile: Joi.string().required(),
    hobby: Joi.string().required(),
    roles : Joi.string()
  }),
};



const updateUser = {
  params: Joi.object().keys({
    _id: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      fristName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string(),
      password: Joi.string(),
      mobile: Joi.string(),
      hobby: Joi.string(),
    roles : Joi.string()

    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    _id: Joi.string(),
  }),
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
};
