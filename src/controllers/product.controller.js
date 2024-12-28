const httpStatus = require('http-status');
const { Product } = require('../models');
const ObjectId = require('mongodb');
const { saveFile, removeFile, arrayImage } = require('../utils/helper');


const productCreate = async (req, res) => {
  try {
    const body = req.body;

    const productExits = await Product.findOne({ name: body.name });

    if (productExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Product name already exits with name" });
    }
    body.user = req.authUser._id;

    const { upload_path } = await saveFile(arrayImage(req.files.image), 'product');

    body.image = upload_path;

    const product = await Product.create(req.body);


    return res.status(httpStatus.CREATED).send({ product });


  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const getAllProduct = async (req, res) => {
  try {

    const result = await Product.aggregate([
      {
        $lookup: {
          from: "addcart",
          let: {
            // uid: req.authUser._id,
            pid: "$_id"
          },
          pipeline: [{
            $match: {
              'isActive': "true",
              $expr: {
                $and: [{
                  $eq: ['$user', req.authUser._id], $eq: ['$product', '$$pid']
                }]
              }
            }
          }],
          as: "cart_id"
        }
      },
      {
        $lookup: {
          from: "productdetails",
          let: {
            pid: "$_id"
          },
          pipeline: [{
            $match: {
              $and: [{
                $expr: {
                  $eq: ['$product', '$$pid']
                }
              }]
            },
          },
          {
            $sort: {
              'price': -1
            }
          }],
          as: "result"
        }
      },
      {
        $addFields: {
          price: { $arrayElemAt: ["$result.price", 0] }
        }
      }


    ]);

    return res.status(httpStatus.CREATED).send({ result });

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

    const nameExsit = await Product.findOne({ _id: { $ne: id }, name: req.body.name });
    if (nameExsit) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "product name already exist." });

    }
    if (req.files?.image) {
      await removeFile(productExits.image);
      const { upload_path } = await saveFile(req.files.image, "product");
      req.body.image = upload_path;
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

    await removeFile(product.image);

    return res.status(httpStatus.CREATED).send({ message: "Product Deleted Successfully" });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}


const searchProduct = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const aggregate = [
      {
        $match: {
          ...(req.query?.search && {
            $or: [
              { "name": { $regex: req.query.search } },
              { "description": { $regex: req.query.search } }
            ],
          }),

          ...(req.query?.filterBy && { category_id: new ObjectId(req.query.filterBy) })

        }
      },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user_id"
        }
      },
      {
        $unwind: {
          path: "$user_id"
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_id"
        }
      }, 
      {
        $unwind: {
          path: "$category_id"
        }
      },
      {
        $lookup: {
          from: "productdetails",
          let: {
            pid: "$_id"
          },
          pipeline: [{
            $match: {
              $expr: {
                $eq: ['$product', '$$pid']
              }
            },
          },
          {
            '$sort': {
              'price': -1
            }
          }
          ],
          as: "product_detail",
        }

      },

      {
        $addFields: {
          product_detail: { $arrayElemAt: ['$product_detail', 0] }
        }
      },
      {
        $addFields: {
          price: '$product_detail.price'
        },

      },
      {
        $skip: (page * limit) - limit
      },
      {
        $limit: limit
      }

      // {
      //   '$lookup': {
      //     'from': 'categories',
      //     'localField': 'category_id',
      //     'foreignField': '_id',
      //     'as': 'category_id'
      //   }
      // }, {
      //   '$unwind': {
      //     'path': '$category_id'
      //   }
      // }, {
      //   '$group': {
      //     '_id': '$category_id.name',
      //     'product': {
      //       '$push': '$$ROOT'
      //     }
      //   }
      // },
      // {
      //   '$addFields':{
      //     "totalProduct" :{
      //       $size : "$product"
      //     }
      //   }
      // }
    ]

    if (req.query?.priceSort) {
      aggregate.push({
        $sort: {
          price: req.query.priceSort == "low" ? 1 : -1
        }
      })
    }

    const data = await Product.aggregate([aggregate]);


    return res.status(httpStatus.CREATED).send({ data });


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
  deleteProductById,
  searchProduct
};
