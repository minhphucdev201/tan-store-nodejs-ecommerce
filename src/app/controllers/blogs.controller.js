const blogsModel = require("../models/blogs.model");

module.exports.getAll = async (req, res, next) => {
  try {
    const blog = await blogsModel.find();
    return res
      .status(200)
      .json({ code: "200", message: "Successfully", data: blog });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const blog = await blogsModel.findById(id);
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
