 const { types, number } = require('joi');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    fristName: {
      type: String,
      require: true,
      trim: true,
    },
    lastName: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    mobile: {
      type: String,
      require: true,
      trim: true,
    },
    hobby: {
      type: String,
      require: true,
      trim: true,
    },
    roles: {
      type: mongoose.Schema.Types.ObjectId,
       ref: 'role'
    },
    token: {
      type: String,
      default: '',
    },
    otp: {
      type: Number,
      trim: true,
      default : '',
    },
    lastlogin :{
      type : Date,
    },
    ip :{
      type : String,
    }
  },
  {
    timestamps: true,
  }
)
const user = mongoose.model('User', userSchema)
module.exports = user;

