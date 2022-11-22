const express = require("express");
const router = express.Router();
const productsController = require("../app/controllers/products.controller");

router.get("/", productsController.getAll);
router.get("/:id", productsController.getByIdProduct);
router.post("/create", productsController.create);
router.put("/:id", productsController.update);
router.delete("/del/:id", productsController.delete);
// filter products
// router.get("/searchCatalog", productsController.SearchCatalog);
router.get("/searchName", productsController.SearchName);
router.get("/slug/:slug", productsController.SearchBySlug);
module.exports = router;
