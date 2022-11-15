const cataModel = require("../models/catalogs.model");

exports.getAll = async () => {
  try {
    const Cata = await cataModel.find();
    return Cata;
  } catch (err) {
    console.log(err);
  }
};

exports.createNew = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
