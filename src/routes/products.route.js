const express = require("express");
const router = express.Router();
const productsController = require("../app/controllers/products.controller");

router.get("/", productsController.getAll);
router.get("/:id", productsController.getByIdProduct);
router.post("/create", productsController.create);
router.put("/:id", productsController.update);
router.delete("/del/:id", productsController.delete);
module.exports = router;
