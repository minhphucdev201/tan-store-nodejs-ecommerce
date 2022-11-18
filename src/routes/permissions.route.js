const express = require("express");
const router = express.Router();
const permissionsController = require("../app/controllers/permissions.controller");

router.get("/", permissionsController.getAll);
router.get("/:id", permissionsController.getById);
router.post("/create", permissionsController.create);
router.delete("/del/:id", permissionsController.delete);
router.put("/:id", permissionsController.update);
module.exports = router;
