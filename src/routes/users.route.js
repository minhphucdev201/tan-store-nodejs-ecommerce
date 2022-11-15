const express = require("express");
const router = express.Router();
const usersController = require("../app/controllers/user.controller");

router.post("/register", usersController.Register);
router.post("/login", usersController.Login);
router.get("/", usersController.getAll);
router.delete("/del/:id", usersController.deleteUser);
module.exports = router;
