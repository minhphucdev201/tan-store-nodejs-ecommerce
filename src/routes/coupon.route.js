const express = require("express");
const router = express.Router();
const couponController = require("../app/controllers/coupon.controller");

router.post("/sendmail");
router.delete("/del/:id", couponController.delete);
router.put("/:id", couponController.update);
router.post("/create", couponController.create);
router.post("/check-coupon", couponController.checkCoupon);
router.get("/:id", couponController.getById);
router.get("/", couponController.getAll);
module.exports = router;
