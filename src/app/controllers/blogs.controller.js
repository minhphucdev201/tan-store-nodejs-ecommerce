const blogsModel = require("../models/blogs.model");
const blogsService = require("../services/blogs.service");
module.exports.getAll = async (req, res, next) => {
  try {
    const count = await blogsModel.countDocuments();
    const filter = req.query;
    const page = req.query.page || 1;
    const limit = req.query.limit || count;

    const blogs = await blogsModel
      .find(filter)
      .sort({ [req.query.column]: req.query.type })
      .skip(page > 0 ? (page - 1) * limit : 0)

      .populate("idCatalogBlog")

      .limit(limit * 1)
      .exec();
    // const ProductsSearch = await productsService.getSearchNameProduct(search);
    // console.log(ProductsSearch);
    return res.status(200).json({
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
      },
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const blog = await blogsModel.findById(id).populate("idCatalogBlog");
    return res
      .status(200)
      .json({ code: "200", message: "Find Blog successfully", data: blog });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const newBlog = await blogsModel(req.body);
    const saveBlog = await newBlog.save();
    return res
      .status(200)
      .json({ code: "200", message: "Create Blog Successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const blog = await blogsModel.findById(req.params.id);
    await blog.updateOne({ $set: req.body });
    return res
      .status(200)
      .json({ code: "200", message: "Update blog successfully", data: blog });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    await blogsModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.SearchTitle = async (req, res) => {
  try {
    const search = req.query.description;
    const BlogsSearch = await blogsService.SearchTitleBlog(search);
    return res.status(200).json(BlogsSearch);
  } catch (error) {
    return res.status(500).json(error);
  }
};
