const httpStatus = require("http-status");
const { addCart } = require("../models");
// const addCart = require("../models/add_cart.model");


const createaddCart = async (req, res) => {
    
        const body = req.body;

        console.log( body.product," body.product");
        
        const cartExist = await addCart.findOne({ product: body.product });
        console.log(cartExist,"cartExist");
        
        if (cartExist) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: "cart created successfully." })
        }
        body.user = req.authUser._id;
        const addcart = await addCart.create(req.body);
        return res.status(httpStatus.CREATED).send({ addcart })
}

const getaddCart = async (req, res) => {
    try {
        const addcart = await addCart.find({user : req.authUser._id});
        return res.status(httpStatus.CREATED).send({ addcart })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}

const updateaddCart = async (req, res) => {
    try {
        const id = req.params._id;

        const cartExist = await addCart.findOne({ _id: id });
        if (!cartExist) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: "cart is not found" })
        }
        const addcart = await addCart.findOneAndUpdate({ _id: id }, req.body, { new: true })
        return res.status(httpStatus.CREATED).send({ addcart })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}

const deleteaddCart = async (req, res) => {
    try {
        const id = req.params._id;
        const cartExist = await addCart.findOne({ _id: id });
        if (!cartExist) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: "cart is not found" })
        }
        const addcart = await addCart.findByIdAndDelete({ _id: id })
        return res.status(httpStatus.CREATED).send({ message :"cart deleted successfully" })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}
module.exports = {
    createaddCart,
    getaddCart,
    updateaddCart,
    deleteaddCart
}