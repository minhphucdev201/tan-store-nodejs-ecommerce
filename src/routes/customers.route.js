const express = require("express");
const router = express.Router();
const customersController = require("../app/controllers/customers.controller");
const middlewareAuth = require("../app/middleware/authentication");
// router.post("/verify-email", customersController.VerifyEmail);
router.post("/login", customersController.Login);
router.post("/register", customersController.Register);
// LOGOUT, SIGN IN CHECK ==> LOG OUT
router.post(
  "/logout",
  middlewareAuth.checkAuthencation,
  customersController.Logout
);
router.get("/:id", customersController.getCustomerById);
router.get("/", customersController.getAll);
router.post("/edit", customersController.changeInfor);
router.delete("/del/:id", customersController.deleteCustomer);
// REFRESH TOKEN
router.post("/refresh", customersController.refreshToken);
router.post("/change-password", customersController.changePassword);
router.post("/forgot-password", customersController.forgotpassword);
module.exports = router;
