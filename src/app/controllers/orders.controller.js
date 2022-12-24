const ordersService = require("../services/orders.service");
const customersService = require("../services/customers.service");
const productsService = require("../services/products.service.js");
const orderDetailsService = require("../services/orderDetails.service");
const ordersModel = require("../models/orders.model");
module.exports.getAll = async (req, res, next) => {
  try {
    const count = await ordersModel.countDocuments();
    const filter = req.query;
    const page = req.query.page || 1;
    const limit = req.query.limit || count;

    const Order = await ordersModel
      .find(filter)
      .sort({ [req.query.column]: req.query.type })
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit * 1);
    return res.status(200).json({
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
      },
      data: Order,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// get by id order
module.exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const Order = await ordersService.getById(id);
    return res
      .status(200)
      .json({ code: "200", message: "sucsse", data: Order });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports.NewOrder = async (req, res, next) => {
  try {
    const value = req.body;
    const customerId = value.customerId;
    const checkCustomer = await customersService.getById(customerId);
    console.log("customer id:", checkCustomer);
    if (!checkCustomer) {
      const Order = await ordersService.newOrder(value);
      if (Order) {
        const orderId = Order._id;
        await value.orderDetail?.map(async (item) => {
          // const check = await productsService.getById(item.productId);
          // if (check) {
          const newValue = {
            productId: item.productId,
            orderId,
            customerId,
            quantity: item.quantity,
            price: item.price,
          };
          const order = await orderDetailsService.newOrder(newValue);
          console.log(order);
          return res
            .status(200)
            .json({ code: "200", message: "sucsses", data: order });
          // }
        });
      }
      return res
        .status(200)
        .json({ code: "200", message: "sucsses", data: Order });
    } else {
      const Order = await ordersService.newOrder(value);
      if (Order) {
        const orderId = Order._id;
        await value.orderDetail?.map(async (item) => {
          console.log("vv");
          // const check = await productsService.getById(item.productId);
          // if (check) {
          const newValue = {
            productId: item.productId,
            orderId,
            customerId,
            quantity: item.quantity,
            price: item.price,
          };
          const total = newValue.quantity * newValue.price;
          const order = await orderDetailsService.newOrder(newValue);
          // console.log(order, total);
          return res
            .status(200)
            .json({ code: "200", message: "sucsses", data: order });
          // }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
