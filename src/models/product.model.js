const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    stock:{
      type : Number,
    },
    price :{
      type : Number,
    },
    image :{
      type : String,
    },
    user :{
      type :mongoose.Schema.Types.ObjectId,
      ref :'User'
    },
    category_id :{
      type :mongoose.Schema.Types.ObjectId,
      ref :'Categorys'
    }
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
