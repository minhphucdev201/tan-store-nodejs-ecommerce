const ordersModel = require("../models/orders.model");

exports.getAll = async (filter) => {
  try {
    if (filter.hasOwnProperty("_sort")) {
      const Product = await ordersModel.find(filter).sort({
        [filter.column]: filter.type,
      });
      return Product;
    }
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
