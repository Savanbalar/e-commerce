const httpStatus = require("http-status");  
const Category = require("../models/category.model");
const logger = require("../utils/Logger");


const createCategory = async (req, res) => {
    try {
        const body = req.body;
        const categoryExist = await Category.findOne({ name: body.name });

        if (categoryExist) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: "category created successfully." })
        }

        body.user = req.authUser._id;
        const category = await Category.create(req.body);
        return res.status(httpStatus.CREATED).send({ category })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
        logger.error("Error: Something went wrong:", error);
    }
}

const getCategory = async (req, res) => {
    try {
        const data = await Category.find();
        return res.status(httpStatus.CREATED).send({ data })
        logger.info('this is dummy massge');

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}

const updateCategory = async (req, res) => {
    try {
        const id = req.params._id;
        const categoryExist = await Category.findOne({ _id: id });
        if (!categoryExist) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: "category is not found" })
        }

        const nameExsit = await Category.findOne({ _id: { $ne: id }, name: req.body.name });
        if (nameExsit) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: "category name already exist." })
        }

        const category = await Category.findOneAndUpdate({ _id: id }, req.body, { new: true })
        return res.status(httpStatus.CREATED).send({ category })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const id = req.params._id;
        const categoryExist = await Category.findOne({ _id: id });
        if (!categoryExist) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: "category is not found" })
        }
        const category = await Category.findByIdAndDelete({ _id: id })
        return res.status(httpStatus.CREATED).send({ message: "category deleted successfully" })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}
module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
}