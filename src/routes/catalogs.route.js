const express = require("express");
const router = express.Router();
const catalogsController = require("../app/controllers/catalogs.controller");
router.get("/", catalogsController.getAll);
router.get("/:id", catalogsController.getById);
router.post("/create", catalogsController.create);
router.put("/:id", catalogsController.update);
router.delete("/del/:id", catalogsController.delete);

module.exports = router;
