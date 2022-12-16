const ordersModel = require("../models/orders.model");

exports.getAll = async (filter) => {
  try {
    const Product = await ordersModel.find(filter).sort({
      [filter.column]: filter.type,
    });
    return Product;
  } catch (error) {
    console.log(error);
  }
};

exports.getById = async (id) => {
  try {
    const Order = await ordersModel.findById(id);
    if (!Order) {
      return false;
    }
    return Order;
  } catch (err) {
    return false;
  }
};

exports.newOrder = async (value) => {
  try {
    const customerId = value.customerId;
    const fullName = value.fullName;
    const phone = value.phone;
    const address = value.address;
    const email = value.email;
    const total = value.total;
    const cancel = value.cancel;
    const reason = value.reason;

    const newValue = new ordersModel({
      customerId,
      fullName,
      phone,
      address,
      email,
      total,
      cancel,
      reason,
    });
    return newValue
      .save()
      .then((res) => {
        console.log("Add order success!");
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
