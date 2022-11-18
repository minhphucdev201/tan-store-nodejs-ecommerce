const permissionsModel = require("../models/permissions.model");

exports.getAll = async () => {
  try {
    const Permission = await permissionsModel.find();
    return Permission;
  } catch (error) {
    console.log(error);
  }
};

exports.getById = async (id) => {
  try {
    const Permission = await permissionsModel.findById(id);
    return Permission;
  } catch (error) {
    console.log(error);
  }
};

exports.createNew = async (values) => {
  try {
    const name = values.name;
    let newPermission = new permissionsModel({
      name,
    });
    return newPermission
      .save()
      .then((data) => {
        console.log("Add success!");
        return data;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  } catch (error) {
    console.log(error);
  }
};

exports.delete = async (id) => {
  try {
    const Permission = await this.getById(id);
    if (!Permission) {
      return false;
    }
    return await permissionsModel
      .deleteOne({ _id: id }, (err) => {
        console.log("Delete success!");
      })
      .clone();
  } catch (err) {
    console.log(err);
  }
};

exports.update = async (id, values) => {
  return await permissionsModel
    .updateOne({ _id: id }, values)
    .then(() => true)
    .catch((error) => false);
};
