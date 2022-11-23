const express = require("express");
const router = express.Router();

const blogController = require("../app/controllers/blogs.controller");

router.get("/", blogController.getAll);
router.get("/:id", blogController.getById);
router.post("/create", blogController.create);
router.put("/:id", blogController.update);
router.delete("/del/:id", blogController.delete);

router.get("/searchTitle", blogController.SearchTitle);
module.exports = router;
