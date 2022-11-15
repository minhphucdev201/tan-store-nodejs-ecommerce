const CatalogService = require("../services/catalogs.service.js");
const catalogsModel = require("../models/catalogs.model");
const productsModel = require("../models/products.model.js");

module.exports.getAll = async (req, res) => {
  try {
    const Catalogs = await CatalogService.getAll();

    return res
      .status(200)
      .json({ code: "200", message: "success", data: Catalogs });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Catalogs = await catalogsModel.findById(id).populate("products");
    if (!Catalogs) {
      return res
        .status(404)
        .json({ code: "404", message: "Catalog Not Found" });
    }
    return res
      .status(200)
      .json({ code: "200", message: "success", data: Catalogs });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const newCata = new catalogsModel(req.body);
    const saveCatalog = await newCata.save();
    res.status(200).json(saveCatalog);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// UPDATE CATALOG
module.exports.update = async (req, res, next) => {
  try {
    const catalog = await catalogsModel.findById(req.params.id);
    await catalog.updateOne({ $set: req.body });
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: catalog });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// DELETE CATALOG
module.exports.delete = async (req, res, next) => {
  try {
    await productsModel.updateMany(
      { idCatalog: req.params.id },
      { idCatalog: null }
    );
    await catalogsModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: "Delete Successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
