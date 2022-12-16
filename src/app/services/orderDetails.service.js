const orderDetailsModel = require("../models/orderDetails.model");

exports.newOrder = async (value) => {
  try {
    const productId = value.productId;
    const orderId = value.orderId;
    const customerId = value.customerId;
    const quantity = value.quantity;
    const price = value.price;

    const newValue = new orderDetailsModel({
      productId,
      orderId,
      customerId,
      quantity,
      price,
    });
    return newValue
      .save()
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  } catch (err) {
    console.log(err);
  }
};

exports.getOrderByID = async (filter) => {
  try {
    const Order = await orderDetailsModel.find(filter);
    if (!Order) {
      return false;
    }
    return Order;
  } catch (err) {
    return false;
  }
};

exports.getAll = async (filter) => {
  try {
    const Order = await orderDetailsModel.find(filter);
    return Order;
  } catch (err) {
    console.log(err);
  }
};
