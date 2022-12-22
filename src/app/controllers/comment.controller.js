const CommentService = require("../services/comment.service");
const ProductService = require("../services/products.service");
const CustomerService = require("../services/customers.service");
const commentModel = require("../models/comment.model");

module.exports.getAll = async (req, res, next) => {
  try {
    const comment = await commentModel.find();
    // .populate("customerId")
    // .populate("productId");
    return res
      .status(200)
      .json({ code: "200", message: "success", data: comment });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports.GetAllByIdProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const page = req.query.page || 1;
    const limit = req.query.limit || 50;
    const Catalogs = await commentModel
      .find({ productId: id })
      .sort({ [req.query.column]: req.query.type })
      .skip(page > 0 ? (page - 1) * limit : 0)
      .populate("customerId")

      .limit(limit * 1);
    const count = await commentModel.countDocuments();
    return res.status(200).json({
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
      },
      data: Catalogs,
    });

    // res.status(404).json({code:"404",message:"fail"});
  } catch (err) {
    console.log(err);
  }
};

module.exports.getByIdCata = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Catalogs = await CommentService.getById(id);
    if (!Catalogs) {
      return res
        .status(404)
        .json({ code: "404", message: "Catalog not found" });
    }
    return res
      .status(200)
      .json({ code: "200", message: "sucsses", data: Catalogs });
    // res.status(404).json({code:"404",message:"fail"});
  } catch (err) {
    console.log(err);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    let value = req.body;
    const checkIdProduct = await ProductService.getById(value.productId);
    const checkIdUser = await CustomerService.getById(value.customerId);

    if (checkIdProduct && checkIdUser) {
      const comment = await CommentService.createNew(value);
      return res
        .status(200)
        .json({ code: "200", message: "sucsses", data: comment });
    }
    return res.status(404).json({ code: "404", message: "Catalog not found" });
  } catch (err) {
    console.log(err);
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const DelCata = await CommentService.delete(id);
    if (!DelCata) {
      res.json({ code: "404", message: "Catalogs not foud" });
    }
    res.json({ code: "200", message: "sucsses" });
  } catch (err) {
    console.log(err);
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const { id } = req.body;
    const value = req.body;
    const checkId = await CommentService.getById(id);
    if (!checkId) {
      return res
        .status(404)
        .json({ code: "404", message: "Catalogs not found" });
    }
    const UpdateCata = await CommentService.update(id, value);
    if (!UpdateCata) {
      return res
        .status(404)
        .json({ code: "404", message: "Catalogs not found" });
    }
    res.json({ code: "200", message: "sucsses" });
  } catch (err) {
    console.log(err);
  }
};
