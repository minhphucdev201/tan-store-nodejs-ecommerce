const express = require("express");
const router = express.Router();
const usersController = require("../app/controllers/user.controller");
const middlewareAuth = require("../app/middleware/authentication");
router.post("/register", usersController.Register);
router.post("/login", usersController.Login);
router.post(
  "/logout",
  // middlewareAuth.checkAuthencation,
  usersController.Logout
);
router.get("/", usersController.getAll);
router.delete(
  "/del/:id",

  usersController.deleteUser
);
// REFRESH
router.post("/refresh", usersController.refreshToken);
router.post("/change-password", usersController.changePassword);
router.post("/forgot-password", usersController.forgotpassword);
router.post("/new-password", usersController.resetPassword);
router.post("/update", usersController.updateUser);
module.exports = router;
