const express = require("express");
const router = express.Router();
const rolesController = require("../app/controllers/roles.controller");
router.get("/", rolesController.getAll);
router.post("/create", rolesController.create);
router.put("/:id", rolesController.update);
router.delete("/del/:id", rolesController.delete);
module.exports = router;
