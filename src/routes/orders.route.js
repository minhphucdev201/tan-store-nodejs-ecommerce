const express = require("express");
const router = express.Router();
const ordersController = require("../app/controllers/orders.controller");

router.post("/create");
router.get("/", ordersController.getAll);
router.get("/:id", ordersController.getById);
module.exports = router;
