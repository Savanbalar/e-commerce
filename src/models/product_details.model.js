const mongoose = require('mongoose');

const productDetailsSchema = mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    
    product :{
      type :mongoose.Schema.Types.ObjectId,
      ref :'Product'
    }
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model('ProductDetails', productDetailsSchema);

module.exports = Product;
