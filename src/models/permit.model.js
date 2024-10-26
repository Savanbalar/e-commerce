
const mongoose = require('mongoose');

const permitSchema = mongoose.Schema(
  {
    permitName: {
      type: String,
      require: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
)
const Permit = mongoose.model('permit', permitSchema, 'permits')
module.exports = Permit;
