const mongoose = require('mongoose');

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    isActive: {
      type: String,
      require: true,
      trim: true,
    },
  },
  {
    timestamps : true,
  }
)
const Role = mongoose.model ('role',roleSchema)
module.exports = Role;
