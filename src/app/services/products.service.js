const productsModel = require("../models/products.model");

exports.getAll = async (filter) => {
  try {
    if (filter.hasOwnProperty("_sort")) {
      const products = await productsModel
        .find(filter)
        .sort({ [filter.column]: filter.type });

      return products;
    }

    const Product = await productsModel.find(filter);
    return Product;
  } catch (err) {
    console.log(err);
  }
};

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
    const regex = new RegExp(name, "i");
    if (regex) {
      console.log("regex ==>", regex);
    }
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

exports.getByIdCata = async (idCata) => {
  try {
    const products = await productsModel.find({ idCatalog: idCata });
    if (products) {
      return products;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

exports.getById = async (id) => {
  try {
    const Product = await productsModel.findById(id);
    if (Product) {
      return Product;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};
