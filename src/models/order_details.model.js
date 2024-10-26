const { ref, types } = require("joi");
const mongoose = require("mongoose");
const { trim } = require("validator");

const orderDetailsSchema = mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: {
    type: Number,
    require: true,
    trim: true
  },

  price: {
    type: Number,
    trim: true
  },
  totalPrice: {
    type: Number,
    trim: true
  },


  product_details_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductDetails"
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts"
  }
}, {
  timestamps: true
});



const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema,'OrderDetaildb');

module.exports = OrderDetails;
