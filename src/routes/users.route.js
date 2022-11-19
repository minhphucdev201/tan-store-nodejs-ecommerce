const express = require("express");
const router = express.Router();
const usersController = require("../app/controllers/user.controller");
const middlewareAuth = require("../app/middleware/authentication");
router.post("/register", usersController.Register);
router.post("/login", usersController.Login);
router.post(
  "/logout",
  middlewareAuth.checkAuthencation,
  usersController.Logout
);
router.get("/", middlewareAuth.checkAuthencation, usersController.getAll);
router.delete(
  "/del/:id",
  middlewareAuth.checkAdmin,
  usersController.deleteUser
);
// REFRESH
router.post("/refresh", usersController.refreshToken);
router.post("/change-password", usersController.changePassword);
router.post("/forgot-password", usersController.forgotpassword);
module.exports = router;
