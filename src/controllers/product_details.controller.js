const httpStatus = require('http-status');
const { ProductDetails, Product } = require('../models');

const productDetailsCreate = async (req, res) => {
  try {
    const body = req.body;

    // const productExits = await ProductDetails.findOne({ price :body.price });

    // if (productExits) {
    //   return res.status(httpStatus.BAD_REQUEST).send({ message: "Product name already exits with name" });
    // }
    // body.total = await body.price * body.quantity;

    
    const product1 = await ProductDetails.create(req.body);

    await Product.findByIdAndUpdate(req.body.product,{$inc :{stock :req.body.quantity}});
    
    return res.status(httpStatus.CREATED).send({ product1 });

  } catch (error) {
    console.log(error, "error")
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const getAllProductDetails = async (req, res) => {
  try {
    const product = await ProductDetails.find().populate(['product']);

    return res.status(httpStatus.CREATED).send({ product });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}
const updateProductDetails = async (req, res) => {
  try {
    const id = req.params._id;

    const productExits = await ProductDetails.findOne({ _id: id });

    if (!productExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Product Not Found" });
    }

    // const totalupdate = ((quantity, price) => {
    //   let total
    //   if(quantity || price){
    //    total =((quantity || productExits.quantity ) * (price || productExits.price));
    //   }
    //   return total;
    // })
    // req.body.total = totalupdate(req.body?.quantity,req.body?.price);

    if(productExits.quantity !== req.body.quantity){
      const updateQty =await req.body.quantity - productExits.quantity
      
      await Product.findByIdAndUpdate(productExits.product,{$inc :{stock :updateQty}});      
    }
    const product = await ProductDetails.findOneAndUpdate({ _id: id }, req.body, { new: true })
    return res.status(httpStatus.CREATED).send({ product });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}
const deleteProductDetails = async (req, res) => {
  try {
    const id = req.params._id;

    const productExits = await ProductDetails.findOne({ _id: id });

    if (!productExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Product Not Found" });
    }

    const updateQty = productExits.quantity
    
    await Product.findByIdAndUpdate(productExits.product,{$inc :{stock :-updateQty}});

    await ProductDetails.findByIdAndRemove({ _id: id });

    return res.status(httpStatus.CREATED).send({ message: "Product Deleted Successfully" });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}


module.exports = {
  productDetailsCreate,
  getAllProductDetails,
  updateProductDetails,
  deleteProductDetails
};
