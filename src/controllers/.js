const httpStatus = require('http-status');
const { Product } = require('../models');




const productCreate = async (req, res) => {
  try {
    const { name } = req.body;

    const productExits = await Product.findOne({ name });

    if (productExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Product name already exits with name" });
    }

    const product = await Product.create(req.body);

    return res.status(httpStatus.CREATED).send({ product });

  } catch (error) {
    console.log(error, "error")
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find();

    return res.status(httpStatus.CREATED).send({ product });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}
const updateProductById = async (req, res) => {
  try {
    const id = req.params._id;

    const productExits = await Product.findOne({ _id: id });

    if (!productExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Product Not Found" });
    }

    const product = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true })

    return res.status(httpStatus.CREATED).send({ product });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}
const deleteProductById = async (req, res) => {
  try {
    const id = req.params._id;

    const productExits = await Product.findOne({ _id: id });

    if (!productExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Product Not Found" });
    }

    const product = await Product.findByIdAndRemove({ _id: id })

    return res.status(httpStatus.CREATED).send({ message: "Product Deleted Successfully" });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}









module.exports = {
  productCreate,
  getAllProduct,
  updateProductById,
  deleteProductById
};
