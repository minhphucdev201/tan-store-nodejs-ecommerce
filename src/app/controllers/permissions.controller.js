const permissionsService = require("../services/permissions.service");
const rolesService = require("../services/roles.service");
const permissionsModel = require("../models/permissions.model");
module.exports.getAll = async (req, res) => {
  try {
    const permissions = await permissionsService.getAll();
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: permissions });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const permissions = await permissionsService.getById(id);
    if (!permissions) {
      return res
        .status(404)
        .json({ code: "404", message: "permissions not found" });
    }
    return res
      .status(200)
      .json({ code: "200", message: "sucsses", data: permissions });
    // res.status(404).json({code:"404",message:"fail"});
  } catch (err) {
    console.log(err);
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const permissions = await permissionsService.getById(id);
    if (!permissions) {
      return res
        .status(404)
        .json({ code: "404", message: "permissions not found" });
    }
    return res
      .status(200)
      .json({ code: "200", message: "sucsses", data: permissions });
    // res.status(404).json({code:"404",message:"fail"});
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.create = async (req, res) => {
  try {
    let value = req.body;
    const add = await permissionsService.createNew(value);
    const newValue = {
      idPermissions: add._id,
      name: add.name,
    };

    if (add) {
      const listRole = await rolesService.getAll();
      await listRole.map(async (item) => {
        if (item._id == "6377541647ab3d9c7fe03e40") {
          const valueAdmin = {
            idPermissions: newValue.idPermissions,
            name: newValue.name,
            status: true,
          };
          const newDataAdmin = [...item.listPermissions, valueAdmin];
          await rolesService.addPermission(item._id, newDataAdmin);
        } else {
          const newData = [...item.listPermissions, newValue];
          await rolesService.addPermission(item._id, newData);
        }
      });
      return res.status(200).json({ code: "200", message: "sucsses" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Permission = await permissionsService.delete(id);
    if (Permission) {
      const listRole = await rolesService.getAll();
      listRole.map(async (item) => {
        const listNewPermissions = item.listPermissions;
        const newData = listNewPermissions.filter(
          (item) => item.idPermissions != id
        );
        await rolesService.addPermission(item._id, newData);
      });
      return res.status(200).json({ code: "200", message: "sucsses" });
    }
    return res.json({ code: "404", message: "Permission not foud" });
    // return res.json({code:"200",message:"sucsses"})
    // res.status(200).json({code:"200",message:"sucsses"});
  } catch (err) {
    console.log(err);
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const permission = await permissionsModel.findById(req.params.id);
    await permission.updateOne({ $set: req.body });
    return res
      .status(200)
      .json({ code: "200", message: "Success", data: permission });
  } catch (err) {
    console.log(err);
  }
};
