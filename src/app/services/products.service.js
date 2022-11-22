const productsModel = require("../models/products.model");

exports.getSeachCatalog = async (idCatalog) => {
  try {
    var regex = new RegExp(idCatalog, "i");
    const ProductSearch = await productsModel.find({ idCatalog: regex });
    return ProductSearch;
  } catch (error) {
    console.log(err);
  }
};

exports.getSearchNameProduct = async (name) => {
  try {
    var regex = new RegExp(name, "i");
    const ProductSearch = await productsModel.find({ name: regex });
    return ProductSearch;
  } catch (error) {
    console.log(error);
  }
};

exports.findBySlug = async (slug) => {
  try {
    const Product = await productsModel.find({ slug: slug });
    if (Product.length == 0) return [];
    return Product;
  } catch (error) {
    console.log(error);
  }
};
