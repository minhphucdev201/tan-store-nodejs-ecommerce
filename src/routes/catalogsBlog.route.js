const express = require("express");
const catalogsBlogController = require("../app/controllers/catalogsBlog.controller");
const router = express.Router();

router.get("/", catalogsBlogController.getAll);
router.get("/:id", catalogsBlogController.getById);
router.post("/create", catalogsBlogController.create);
router.put("/:id", catalogsBlogController.update);
router.delete("/del/:id", catalogsBlogController.delete);
module.exports = router;
