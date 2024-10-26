const Joi = require('joi');

const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    isActive : Joi.string().required(),
  }),
};


const updateRole = {
  params: Joi.object().keys({
    _id: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      isActive : Joi.string(),
    })
    .min(1),
};

const deleteRole = {
  params: Joi.object().keys({
    _id: Joi.string(),
  }),
};

module.exports = {
  createRole,
  updateRole,
  deleteRole
};
