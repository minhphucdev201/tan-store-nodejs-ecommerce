const ordersService = require("../services/orders.service");
const customersService = require("../services/customers.service");
const productsService = require("../services/products.service.js");
const orderDetailsService = require("../services/orderDetails.service");
module.exports.getAll = async (req, res, next) => {
  try {
    const filter = req.query;
    const Order = await ordersService.getAll(filter);
    return res
      .status(200)
      .json({ code: "200", message: "Successfully", data: Order });
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
      // if (Order) {
      //   const orderId = Order._id;
      //   await value.orderDetail.map(async (item) => {
      //     const check = await productsService.getById(item.productId);
      //     if (check) {
      //       const newValue = {
      //         productId: item.productId,
      //         orderId,
      //         customerId,
      //         quantity: item.quantity,
      //         price: item.price,
      //       };
      //       const order = await orderDetailsService.newOrder(newValue);
      //       console.log(order);
      //       return res
      //         .status(200)
      //         .json({ code: "200", message: "sucsses", data: order });
      //     }
      //   });
      // }
      return res
        .status(200)
        .json({ code: "200", message: "sucsses", data: Order });
    } else {
      // const Order = await ordersService.newOrder(value);
      // if (Order) {
      //   const orderId = Order._id;
      //   await value.orderDetail.map(async (item) => {
      //     const check = await productsService.getById(item.productId);
      //     if (check) {
      //       const newValue = {
      //         productId: item.productId,
      //         orderId,
      //         customerId,
      //         quantity: item.quantity,
      //         price: item.price,
      //       };
      //       const order = await orderDetailsService.newOrder(newValue);
      //       console.log(order);
      //       return res
      //         .status(200)
      //         .json({ code: "200", message: "sucsses", data: order });
      //     }
      //   });
      // }
    }
  } catch (error) {
    console.log(error);
  }
};
