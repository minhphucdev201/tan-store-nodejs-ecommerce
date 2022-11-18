const rolesService = require("../services/roles.service");
const permissionsService = require("../services/permissions.service");
const rolesModel = require("../models/roles.model");
module.exports.getAll = async (req, res) => {
  try {
    const Role = await rolesService.getAll();

    return res
      .status(200)
      .json({ code: "200", message: "sucsses", data: Role });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// get by id
module.exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const role = await rolesService.getById(id);
    if (!role) {
      return res
        .status(404)
        .json({ code: "404", message: "permissions not found" });
    }
    return res
      .status(200)
      .json({ code: "200", message: "sucsses", data: role });
    // res.status(404).json({code:"404",message:"fail"});
  } catch (err) {
    console.log(err);
  }
};

module.exports.create = async (req, res) => {
  try {
    const name = req.body.name;
    const checkName = await rolesService.getByName(name);
    if (checkName) {
      return res.status(404).json({ code: "404", message: "Tên đã tồn tại" });
    }
    const ListPermission = [];
    const List = await permissionsService.getAll();
    List.map((item) =>
      ListPermission.push({ idPermissions: item.id, name: item.name })
    );
    const Add = await rolesService.createNew(req.body.name, ListPermission);
    if (Add) {
      return res
        .status(200)
        .json({ code: "200", message: "Add user success!" });
    }
    return res.status(404).json({ code: "404", message: "Add user fail!" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const role = await rolesModel.findById(req.params.id);
    await role.updateOne({ $set: req.body });
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: role });
  } catch (error) {
    console.log(error);
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id == "6377ce2a7f382b8462593c28") {
      return res
        .status(501)
        .json({ code: "501", message: "không thể xóa role admin" });
    }
    const DelRole = await rolesService.delete(id);
    if (!DelRole) {
      return res.json({ code: "404", message: "Role not foud" });
    }
    return res.json({ code: "200", message: "sucsses" });
    // res.status(200).json({code:"200",message:"sucsses"});
  } catch (err) {
    console.log(err);
  }
};
