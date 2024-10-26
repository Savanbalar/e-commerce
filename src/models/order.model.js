const { ref, types } = require("joi");
const mongoose = require("mongoose");
const { trim } = require("validator");

const orderSchema = mongoose.Schema({
  amount: {
    type: Number,
    trim: true
  },

  shippingAddress: {
    type: String,
    trim: true,
    require: true
  },
  city: {
    type: String,
    trim: true,
    require: true
  },
  pinCode: {
    type: Number,
    trim: true,
    require: true
  },
  phone: {
    type: Number,
    trim: true,
    require: true
  },
  orderStatus: {
    type: String,
    enum: ["cancel", "pending", "shipping", "orderComplete"]

  },
  paymentType: {
    type: String,
    enum: ["cash", "gpay"],
    require: true
  },
  orderDate: {
    type: Date,
    default: Date.now()
  },
  updated_At: {
    type: Date,
    default: Date.now() + 8 * 60 * 60 * 1000
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  paymentImage :{
    type : String,
    require: true
  }
}, {
  timestamps: true
});



const Order = mongoose.model('Order', orderSchema,'orders');

module.exports = Order;
