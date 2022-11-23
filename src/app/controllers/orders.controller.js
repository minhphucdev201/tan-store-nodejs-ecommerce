const ordersService = require("../services/orders.service");

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
  } catch (error) {}
};
