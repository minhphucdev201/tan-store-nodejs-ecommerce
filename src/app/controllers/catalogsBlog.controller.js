const cataBlogsModel = require("../models/catalogBlog.model");

module.exports.getAll = async (req, res, next) => {
  try {
    const catablogs = await cataBlogsModel.find();
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: catablogs });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const catablogs = await cataBlogsModel.findById(req.params.id);
    return res.status(200).json({
      code: "200",
      message: "Find by id successfully",
      data: catablogs,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.create = async (req, res) => {
  try {
    const newCatalogsBlog = new cataBlogsModel(req.body);
    const saveCatalogsBlog = await newCatalogsBlog.save();
    return res
      .status(200)
      .json({ code: "200", message: "Create catalog blog Success" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const catablogs = await cataBlogsModel.findById(req.params.id);
    await catablogs.updateOne({ $set: req.body });
    return res
      .status(200)
      .json({ code: "200", message: "update catalog blog successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    await cataBlogsModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ code: "200", message: "Delete catalog blog successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
