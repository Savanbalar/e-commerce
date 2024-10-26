const httpStatus = require("http-status");
const { Order, ProductDetails, Product, OrderDetails, addCart } = require("../models");
const { saveFile, removeFile } = require("../utils/helper");
const { updateProduct } = require("../validations/product.validation");


const orderCreate = async (req, res) => {
  try {
    // const body = req.body;

    const { Order_detail, ...body } = req.body;

    for (let i = 0; i < Order_detail.length; i++) {
      const stockHandle = await Product.findOne({ _id: Order_detail[i].product_id, stock: { $gte: Order_detail[i].quantity } });

      if (!stockHandle) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "This product is out-off stock" })
      }
    }

    body.user_id = req.authUser._id;

    const order = await Order.create(body);
    console.log(order,"order");
    

    Order_detail.forEach(async (item, index) => {

      await addCart.findByIdAndUpdate(item.cart_id, { isActive: false });

      console.log(item.product_id,"item.product_id");
      await Product.findByIdAndUpdate(item.product_id, { $inc: { stock: -item.quantity } })
      

      const productDetail = await ProductDetails.findOne({ product: item.product_id }).sort({ price: -1 });

      item.price = productDetail.price;
      item.totalPrice = productDetail.price * item.quantity;

      const productDetail_quantity = await ProductDetails.findOne({ product: item.product_id, quantity: { $gte: item.quantity } }).sort({ createdAt: -1 });

      await ProductDetails.findByIdAndUpdate(productDetail_quantity._id, { $inc: { quantity: - item.quantity } });

      item.product_details_id = productDetail_quantity._id;
      item.order_id = order._id;


      await OrderDetails.create(item);

      await Order.findByIdAndUpdate(order._id, { $inc: { amount: item.totalPrice } });

      // return res.status(httpStatus.CREATED).send({ order_detail });

    });

    return res.status(httpStatus.CREATED).send({ order });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
};


const orderGet = async (req, res) => {
  try {
    const orderExist = await Order.find();
    return res.status(httpStatus.CREATED).send({ orderExist });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

// const updateOrder = async (req, res) => {
//   try {
//     const id = req.params._id;

//     const { Order_detail } = req.body;

//     const orderExist = await Order.findOne({ _id: id });
//     if (!orderExist) {
//       return res.status(httpStatus.BAD_REQUEST).send({ message: "order not found" });
//     }

//     // const current = Date.now();
//     // let d = new Date(orderExist.updated_At).getTime();
//     // if (current > d) {
//     //   return res.status(httpStatus.BAD_REQUEST).send({ message: "update timeout" });
//     // }

//     Order_detail.forEach(async (item, index) => {

//       const orderDetail = await OrderDetails.findOne({ order_id: id, product_id: item.product_id });
//       if (!orderDetail) {
//         return res.status(httpStatus.BAD_REQUEST).send({ message: `Order detail for product ${item.product_id} not found` });
//       }

//       const product = await Product.findById(orderDetail.product_id);


//       if (product.stock <= 0) {
//         return res.status(httpStatus.BAD_REQUEST).send({ message: "Product is out of stock" });
//       }

//       if (orderDetail.quantity !== item.quantity) {
//         await Order.findByIdAndUpdate(orderDetail.order_id, { amount: 0 }, { new: true });

//         const updateQuantity = await orderDetail.quantity - item.quantity;

//         item.totalPrice = await item.quantity * orderDetail.price;

//         // console.log(orderDetail.product_id,"orderDetail.product_id");

//         await Product.findByIdAndUpdate(orderDetail.product_id, { $inc: { stock: updateQuantity } });

//         await ProductDetails.findByIdAndUpdate(orderDetail.product_details_id, { $inc: { quantity: updateQuantity } });


//         await Order.findByIdAndUpdate(orderDetail.order_id, { $inc: { amount: item.totalPrice } });
//       };

//       console.log(orderDetail._id, "orderDetail.");

//       await OrderDetails.findByIdAndUpdate(orderDetail._id, item, { new: true });

//     })
//     await Order.findByIdAndUpdate({ _id: id }, req.body, { new: true })

//     return res.status(httpStatus.CREATED).send({ message: "order update Successfully" });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
//   }
// }

// const updateOrder = async (req, res) => {
//   try {
//     const id = req.params._id;
//     const { Order_detail } = req.body;

//     const orderExist = await Order.findOne({ _id: id });
//     if (!orderExist) {
//       return res.status(httpStatus.BAD_REQUEST).send({ message: "Order not found" });
//     }

//     for (const item of Order_detail) {
//       const orderDetail = await OrderDetails.findOne({ order_id: id, product_id: item.product_id });
//       if (!orderDetail) {
//         return res.status(httpStatus.BAD_REQUEST).send({ message: " product not found" });
//       }

//       if (orderDetail.quantity !== item.quantity) {
//         await Order.findByIdAndUpdate(orderDetail.order_id,{ new: true });

//         const updateQuantity = orderDetail.quantity - item.quantity;

//         const product = await Product.findOne(orderDetail.product_id);

//         if (product.stock + updateQuantity < 0) {
//           return res.status(httpStatus.BAD_REQUEST).send({ message: `Product ${product.name} is out of stock` });
//         }
//         const productDetail = await ProductDetails.findOne(orderDetail.product_details_id);

//         if (productDetail.stock + updateQuantity < 0) {
//           return res.status(httpStatus.BAD_REQUEST).send({ message: `Product ${productDetail.name} is out of stock` });
//         }

//         item.totalPrice = item.quantity * orderDetail.price;

//         const newPrice =  item.totalPrice - orderDetail.totalPrice; 

//         await Product.findByIdAndUpdate(orderDetail.product_id, { $inc: { stock: updateQuantity } });

//         await ProductDetails.findByIdAndUpdate(orderDetail.product_details_id, { $inc: { quantity: updateQuantity } });

//         await Order.findByIdAndUpdate(orderDetail._id, { $inc: { amount: item.totalPrice } });
//       }

//       await OrderDetails.findByIdAndUpdate(orderDetail._id, item, { new: true });
//     }

//     await Order.findByIdAndUpdate({ _id: id }, req.body, { new: true });

//     return res.status(httpStatus.CREATED).send({ message: "Order updated successfully" });

//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
//   }
// };

const updateOrder = async (req, res) => {
  try {
    const id = req.params._id;
    const { Order_detail, ...body } = req.body;

    const orderExist = await Order.findOne({ _id: id });
    if (!orderExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Order not found" });
    }

    // if (body?.paymentImage) {
    //   await removeFile(orderExist.paymentImage);
    // }

    let totalAmountChange = 0;

    for (const item of Order_detail) {
      let orderDetail = await OrderDetails.findOne({ order_id: id, product_id: item.product_id });

      if (!orderDetail) {

        const product = await Product.findOne({ _id: item.product_id });
        if (product.stock < item.quantity) {
          return res.status(httpStatus.BAD_REQUEST).send({ message: `Product ${product?.name} is out of stock` });
        }
        // console.log(product.stock, "product.stock");
        // console.log(item.quantity, "item.quantity");


        const productDetail = await ProductDetails.findOne({ product: product._id });

        if (productDetail.quantity < item.quantity) {
          return res.status(httpStatus.BAD_REQUEST).send({ message: `Product details for ${productDetail?.name} are out of stock` });
        }
        // console.log(productDetail.quantity, "productDetail.quantity");
        // console.log(item.quantity, "item.quantity");


        const totalPrice = item.quantity * productDetail.price;

        await Product.findByIdAndUpdate({ _id: product._id }, { $inc: { stock: -item.quantity } });
        await ProductDetails.findByIdAndUpdate({ _id: productDetail._id }, { $inc: { quantity: -item.quantity } });

        totalAmountChange += totalPrice;

        orderDetail = await OrderDetails.create({
          order_id: id,
          product_id: product._id,
          product_details_id: productDetail._id,
          quantity: item.quantity,
          price: productDetail.price,
          totalPrice: totalPrice
        });
      }

      // order ma hoy product pan update no karavi tevi product delete thay javi jo
      const data = await OrderDetails.find({ order_id: id });

      console.log(data, "data");
      console.log(Order_detail, "Order_detail");

      const totalData = data.filter((item) => !Order_detail.find((x) => item.product_id == x.product_id));

      console.log(totalData, "totalData");

      if (totalData.length>0) {
        totalData.forEach(async (item) => {
          console.log(item, "item");

          await OrderDetails.findByIdAndRemove(item._id);
          console.log("helloscds");

          console.log(item.product_id, "item.product_id");

          await Product.findOneAndUpdate({ _id: item.product_id }, { $inc: { stock: item.quantity } });

          console.log(item.product_details_id, "item.product_details_id");

          await ProductDetails.findOneAndUpdate({ _id: item.product_details_id }, { $inc: { quantity: item.quantity } });

          console.log(item.totalPrice, "item.totalPrice");
          console.log(item.order_id, "item.order_id");

          await Order.findByIdAndUpdate(item.order_id , { $inc: { amount: - item.totalPrice } })

        });
      }



      if (orderDetail.quantity !== item.quantity) {
        const updateQuantity = item.quantity - orderDetail.quantity;

        const product = await Product.findOne({ _id: orderDetail.product_id });
        if (product.stock - updateQuantity < 0) {
          return res.status(httpStatus.BAD_REQUEST).send({ message: `Product ${product.name} is out of stock` });
        }

        const productDetail = await ProductDetails.findOne({ _id: orderDetail.product_details_id });
        if (productDetail.stock - updateQuantity < 0) {
          return res.status(httpStatus.BAD_REQUEST).send({ message: `Product ${productDetail.name} is out of stock` });
        }

        const newTotalPrice = item.quantity * orderDetail.price;
        const priceDifference = newTotalPrice - orderDetail.totalPrice;

        await Product.findByIdAndUpdate(product._id, { $inc: { stock: -updateQuantity } });
        await ProductDetails.findByIdAndUpdate(productDetail._id, { $inc: { quantity: -updateQuantity } });

        totalAmountChange += priceDifference;



        await OrderDetails.findByIdAndUpdate(orderDetail._id, { quantity: item.quantity, totalPrice: newTotalPrice }, { new: true });
      }
    }


    const updatedOrderAmount = orderExist.amount + totalAmountChange;

    await Order.findByIdAndUpdate({ _id: id }, { amount: updatedOrderAmount }, { new: true });

    return res.status(httpStatus.OK).send({ message: "Order updated successfully" });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
};

// const updateOrder = async (req, res) => {
//   try {
//     const id = req.params._id;
//     const { Order_detail, ...body } = req.body;

//     const orderExist = await Order.findOne({ _id: id });
//     if (!orderExist) {
//       return res.status(httpStatus.BAD_REQUEST).send({ message: "Order not found" });
//     }

//     // if (body?.paymentImage) {
//     //   await removeFile(orderExist.paymentImage);
//     // }

//     let totalAmountChange = 0;

//     for (const item of Order_detail) {
//       const orderDetail = await OrderDetails.findOne({ order_id: id, product_id: item.product_id });

//       if (!orderDetail) {
//         return res.status(httpStatus.BAD_REQUEST).send({ message: "Product not found in order" });
//       }

//       if (orderDetail.quantity !== item.quantity) {
//         const updateQuantity = item.quantity - orderDetail.quantity;

//         const product = await Product.findOne({ _id: orderDetail.product_id });

//         if (product.stock - updateQuantity < 0) {
//           return res.status(httpStatus.BAD_REQUEST).send({ message: `Product ${product.name} is out of stock` });
//         }

//         const productDetail = await ProductDetails.findOne({ _id: orderDetail.product_details_id });
//         if (productDetail.stock - updateQuantity < 0) {
//           return res.status(httpStatus.BAD_REQUEST).send({ message: `Product ${productDetail.name} is out of stock` });
//         }

//         const newTotalPrice = item.quantity * orderDetail.price;
//         console.log(newTotalPrice, "newTotalPrice");

//         const priceDifference = newTotalPrice - orderDetail.totalPrice; // Difference in price

//         await Product.findByIdAndUpdate(product._id, { $inc: { stock: -updateQuantity } });
//         await ProductDetails.findByIdAndUpdate(productDetail._id, { $inc: { quantity: -updateQuantity } });

//         totalAmountChange += priceDifference;

//         await OrderDetails.findByIdAndUpdate(orderDetail._id, { quantity: item.quantity, totalPrice: newTotalPrice }, { new: true });
//       }
//     }

//     const updatedOrderAmount = orderExist.amount + totalAmountChange;

//     await Order.findByIdAndUpdate({ _id: id }, { amount: updatedOrderAmount }, { new: true });

//     return res.status(httpStatus.OK).send({ message: "Order updated successfully" });

//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
//   }
// };



const deleteOrder = async (req, res) => {
  try {
    const id = req.params._id;
    const orderExist = await Order.findOne({ _id: id });

    if (!orderExist) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "order is not found"
      })
    }
    const current = Date.now();

    let d = new Date(orderExist.updated_At).getTime();

    if (current > d) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "update timeout" });
    }

    const orderdetail = await OrderDetails.find({ order_id: id });

    orderdetail.forEach(async (item) => {
      await Product.findByIdAndUpdate(item.product_id, { $inc: { stock: item.quantity } });

      await ProductDetails.findByIdAndUpdate(item.product_details_id, { $inc: { quantity: item.quantity } });

      await OrderDetails.findByIdAndRemove(item._id)

    });

    await Order.findByIdAndRemove({ _id: id })


    // await removeFile(orderExist.paymentImage);

    return res.status(httpStatus.CREATED).send({ message: "order deleted successfully" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

const paymentImage = async (req, res) => {
  try {
    if (!req.files?.paymentImage) {
      res.status(httpStatus.BAD_REQUEST).send({
        message: "Image Is Requried"
      })
    }
    const { upload_path } = await saveFile(req.files.paymentImage, 'product');

    return res.status(httpStatus.OK).send({ upload_path });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }

}

module.exports = {
  orderCreate,
  orderGet,
  updateOrder,
  deleteOrder,
  paymentImage,
};
