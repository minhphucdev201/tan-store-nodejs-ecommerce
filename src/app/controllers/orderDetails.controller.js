const orderDetailsService = require("../services/orderDetails.service");
const OrderDetailModel = require("../models/orderDetails.model");
module.exports.NewOrderDetail = async (req, res, next) => {
  try {
    const value = req.body;
    const Order = await orderDetailsService.newOrder(value);
    res.json(Order);

    // return res.status(200).json({code:"200",message:"sucsses"});

    // res.status(404).json({code:"404",message:"fail"});
  } catch (err) {
    console.log(err);
  }
};

module.exports.GetId = async (req, res, next) => {
  try {
    const filter = req.query;
    const count = await OrderDetailModel.countDocuments();
    const Order = await orderDetailsService.getOrderByID(filter);
    return res
      .status(200)
      .json({ code: "200", message: "sucsse", count: count, data: Order });

    // res.status(404).json({code:"404",message:"fail"});
  } catch (err) {
    console.log(err);
  }
};
