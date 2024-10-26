const { types } = require('joi');
const mongoose = require('mongoose');

const addCartSchema = mongoose.Schema(
  {
    quantity : {
      type : Number,
      required : true,
      trim : true,
    },
    product :{
      type :mongoose.Schema.Types.ObjectId,
      ref :'Product'
    },
    user :{
      type :mongoose.Schema.Types.ObjectId,
      ref :'User'
    }, 
    isActive :{
      type : String,
      default : true,
    }
  },
  {
    timestamps : true,
  }
)
const addCart = mongoose.model ('addcart',addCartSchema,'addcart')
module.exports = addCart;
