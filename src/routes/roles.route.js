const express = require("express");
const router = express.Router();
const rolesController = require("../app/controllers/roles.controller");
const middlewareAuth = require("../app/middleware/authentication");
router.get("/", rolesController.getAll);
router.get("/:id", rolesController.getById);
router.post("/create", rolesController.create);
router.put("/:id", rolesController.update);
router.delete(
  "/del/:id",
  middlewareAuth.checkAuthencation,
  rolesController.delete
);
module.exports = router;
