const express = require("express");
const router = express.Router();
const productsController = require("../app/controllers/products.controller");

// filter products
router.get("/searchName", productsController.SearchName);
router.get("/slug/:slug", productsController.SearchBySlug);
router.get("/idCata/:id", productsController.getByIdCata);
router.get("/:id", productsController.getByIdProduct);
router.post("/create", productsController.create);
router.put("/:id", productsController.update);
router.delete("/del/:id", productsController.delete);
router.use("/", productsController.getAll);
// router.get("/searchCatalog", productsController.SearchCatalog);
module.exports = router;
