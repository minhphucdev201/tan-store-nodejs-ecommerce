const productsService = require("../services/products.service");
const productsModel = require("../models/products.model");
const catalogsModel = require("../models/catalogs.model");
// GET ALL PRODUCT
module.exports.getAll = async (req, res, next) => {
  try {
    const Products = await productsModel.find();
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: Products });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// GET A  PRODUCT
module.exports.getByIdProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await productsModel.findById(id).populate("idCatalog");
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: product });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// ADD A PRODUCT
module.exports.create = async (req, res, next) => {
  try {
    const newProduct = new productsModel(req.body);
    const savedProduct = await newProduct.save();
    if (req.body.idCatalog) {
      const catalog = catalogsModel.findById(req.body.idCatalog);
      await catalog.updateOne({ $push: { products: savedProduct._id } });
      res
        .status(200)
        .json({ code: "200", message: "Success", data: savedProduct });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// UPDATE A PRODUCT
module.exports.update = async (req, res, next) => {
  try {
    const product = await productsModel.findById(req.params.id);
    await product.updateOne({ $set: req.body });
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: product });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// DELETE PRODUCT
module.exports.delete = async (req, res, next) => {
  try {
    await catalogsModel.updateMany(
      { products: req.params.id },
      { $pull: { products: req.params.id } }
    );
    await productsModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// search catalog
module.exports.SearchCatalog = async (req, res, next) => {
  try {
    const search = req.query.idCatalog;
    const ProductsSearch = await productsService.getSeachCatalog(search);
    return res
      .status(200)
      .json({ code: "200", message: "Successfully", data: ProductsSearch });
  } catch (error) {
    return res
      .status(500)
      .json({ code: "500", message: "Can't find name catalog" });
  }
};

//search by name product
module.exports.SearchName = async (req, res, next) => {
  try {
    const search = req.query.name;
    const ProductsSearch = await productsService.getSearchNameProduct(search);

    return res
      .status(200)
      .json({ code: "200", message: "sucsses", data: ProductsSearch });

    // res.status(404).json({code:"404",message:"fail"});
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.SearchBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const ProductsDetail = await productsService.findBySlug(slug);
    return res
      .status(200)
      .json({ code: "200", message: "successfully", data: ProductsDetail });
  } catch (error) {
    return res.status(500).json(error);
  }
};
