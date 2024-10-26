const httpStatus = require("http-status");
const { OrderDetails } = require("../models");
const { pipeline } = require("nodemailer/lib/xoauth2");

const productSelling = async (req, res) => {
  try {
    const date = new Date();

    const previousYearDate = new Date(date);
    previousYearDate.setFullYear(date.getFullYear() - 1);
    console.log(previousYearDate,"previousYearDate");
    
    console.log(date.getFullYear(),"date.getFullYear()");
    
    const result = await OrderDetails.aggregate([
      {
        $lookup: {
          from: "products",
          let: {
            pid: "$product_id"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$pid']
                }
              }
            }
          ],
          as: 'product'
        }
      },
      {
        $unwind: {
          path: "$product"
        }
      },
      {
        $match: {
          createdAt: {
            $gte: previousYearDate,
            $lte: date
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          month: {
            $push: {
              productName: '$product.name',
              total_selling_month: { $sum: "$quantity" }
            }
          },
        }
      },
      {
        $sort: {
          '_id': 1
        }
      },
      {
        $project :{
          'month.productName' : 1,
          'month.total_selling_month' :1,
          '_id.month':{
            $switch :{
              branches :[
                {
                  case:{$eq :['$_id.month',1 ]},then :"January"
                },
                {
                  case:{$eq :['$_id.month',2 ]},then :"February"
                },
                {
                  case:{$eq :['$_id.month',3 ]},then :"March"
                },
                {
                  case:{$eq :['$_id.month',4 ]},then :"April"
                },
                {
                  case:{$eq :['$_id.month',5 ]},then :"May"
                },
                {
                  case:{$eq :['$_id.month',6 ]},then :"June"
                },
                {
                  case:{$eq :['$_id.month',7 ]},then :"July"
                },
                {
                  case:{$eq :['$_id.month',8 ]},then :"August"
                },
                {
                  case:{$eq :['$_id.month',9 ]},then :"September"
                },
                {
                  case:{$eq :['$_id.month',10 ]},then :"October"
                },
                {
                  case:{$eq :['$_id.month',11 ]},then :"November"
                },
                {
                  case:{$eq :['$_id.month',12 ]},then :"December"
                }
              ],
              default: 0
            }
          }
        }
      }

    ])
    const data = result.map((item) => {
      const selling = item.month.reduce((tot, cur) => {
        if (tot[cur.productName]) {
          tot[cur.productName] += cur.total_selling_month
        } else {
          tot[cur.productName] = cur.total_selling_month
        }
        return tot
      }, {})
      console.log(selling,"selling");
    
      return {
        month: item._id,
        selling
      }
    })

    return res.status(httpStatus.CREATED).send({ data });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const categoryReport = async (req, res) => {
  try {

    const date = new Date();

    const previousYearDate = new Date(date);
    previousYearDate.setFullYear(date.getFullYear() - 1);

    const result = await OrderDetails.aggregate([
      {
        $lookup: {
          from: "products",
          let: {
            pid: "$product_id"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$pid']
                }
              }
            }
          ],
          as: 'product'
        }
      }, {
        $unwind: {
          path: '$product'
        }
      },
      {
        $lookup: {
          from: 'categories',
          let: {
            cid: "$product.category_id"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$cid']
                }
              }
            }
          ],
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category'
        }
      },
      {
        $match: {
          createdAt: { $gte: previousYearDate, $lte: date }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          month: {
            $push: {
              categoryName: '$category.name',
              total_selling_month: { $sum: "$quantity" }
            }
          }
        }
      },
      {
        $sort: {
          '_id': 1
        }
      },
      {
        $project :{
          'month.categoryName' : 1,
          'month.total_selling_month' :1,
          '_id.month':{
            $switch :{
              branches :[
                {
                  case:{$eq :['$_id.month',1 ]},then :"January"
                },
                {
                  case:{$eq :['$_id.month',2 ]},then :"February"
                },
                {
                  case:{$eq :['$_id.month',3 ]},then :"March"
                },
                {
                  case:{$eq :['$_id.month',4 ]},then :"April"
                },
                {
                  case:{$eq :['$_id.month',5 ]},then :"May"
                },
                {
                  case:{$eq :['$_id.month',6 ]},then :"June"
                },
                {
                  case:{$eq :['$_id.month',7 ]},then :"July"
                },
                {
                  case:{$eq :['$_id.month',8 ]},then :"August"
                },
                {
                  case:{$eq :['$_id.month',9 ]},then :"September"
                },
                {
                  case:{$eq :['$_id.month',10 ]},then :"October"
                },
                {
                  case:{$eq :['$_id.month',11 ]},then :"November"
                },
                {
                  case:{$eq :['$_id.month',12 ]},then :"December"
                }
              ],
              default: 0

            }
          }
        }
      }
    ])

    const data = result.map((item) => {

      const selling = item.month.reduce((tot, cur) => {
        if (tot[cur.categoryName]) {
          tot[cur.categoryName] += cur.total_selling_month
        } else {
          tot[cur.categoryName] = cur.total_selling_month
        }
        return tot
      }, {})

      return {
        month: item._id,
        selling
      }
    })


    return res.status(httpStatus.CREATED).send({ data });


  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }

}

const last_3month = async (req, res) => {
  try {
    var lastDate = new Date();
    lastDate.setMonth(lastDate.getMonth() - 3);

    const result = await OrderDetails.aggregate([
      {
        $lookup: {
          from: "products",
          let: {
            pid: "$product_id"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$pid']
                }
              }
            }
          ],
          as: 'product'
        }
      },
      {
        $unwind: {
          path: "$product"
        }
      },
      {
        $match: {
          createdAt: {
            $gte: lastDate
          }
        }
      },
      {
        $group: {
          _id: { productName: '$product.name' },
          total_selling_month: { $sum: "$totalPrice" },
        }
      }

    ])
    return res.status(httpStatus.OK).send({ result });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }

}
module.exports = {
  productSelling,
  categoryReport,
  last_3month
}