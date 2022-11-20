const rolesModel = require("../models/roles.model");
const permissionsModel = require("../models/permissions.model");
exports.getAll = async () => {
  try {
    const Role = await rolesModel.find();
    return Role;
  } catch (err) {
    console.log(err);
  }
};

exports.getById = async (id) => {
  try {
    const Role = await rolesModel.findById(id);
    return Role;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.getByName = async (name) => {
  try {
    const user = await rolesModel.findOne({ name: name });
    if (user) {
      return user;
    }
    return false;
  } catch (err) {
    console.log(err);
  }
};

exports.createNew = async (nameRole, values) => {
  try {
    const listPermissions = values;
    const name = nameRole;

    let newRole = new rolesModel({
      listPermissions,
      name,
    });

    return newRole
      .save()
      .then(() => {
        console.log("Add user success!");
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.delete = async (id) => {
  try {
    const Role = await this.getById(id);
    if (!Role) {
      return false;
    }
    return await rolesModel
      .deleteOne({ _id: id }, (err) => {
        console.log("Delete Role success!");
      })
      .clone();
  } catch (err) {
    console.log(err);
  }
};

exports.update = async (id, values) => {
  return await rolesModel
    .findByIdAndUpdate({ _id: id }, values)
    .then(() => true)
    .catch((error) => false);
};
exports.getPermission = async (roleId) => {
  console.log(roleId);
  const permissions = await rolesModel.findOne({ _id: roleId });
  return permissions;
};

exports.addPermission = async (id, values) => {
  return await rolesModel
    .updateOne({ _id: id }, { listPermissions: values })
    .then(() => true)
    .catch((error) => false);
};
