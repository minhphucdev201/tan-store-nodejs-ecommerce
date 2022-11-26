const couponService = require("../services/coupon.service");
const couponModel = require("../models/coupon.model");
module.exports.getAll = async (req, res, next) => {
  try {
    const filter = req.query;
    const Coupon = await couponService.getAll(filter);

    return res
      .status(200)
      .json({ code: "200", message: "sucsses", data: Coupon });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const CouponCode = await couponService.getById(id);
    if (!CouponCode) {
      return res.status(404).json({ code: "404", message: "Coupon not found" });
    }
    return res
      .status(200)
      .json({ code: "200", message: "sucsses", data: CouponCode });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    let value = req.body;
    const filter = {
      code: value.code,
    };
    const checkNameCoupon = await couponService.getAll(filter);
    if (checkNameCoupon.length > 0) {
      return res.json({ code: 404, message: "Mã giảm giá Đã Tồn Tại" });
    }
    await couponService.createNew(value);
    res.status(200).json({ code: "200", message: "sucsses" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const coupon = await couponModel.findById(req.params.id);
    await coupon.updateOne({ $set: req.body });
    return res
      .status(200)
      .json({ code: "200", message: "Update Coupon  successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Coupon = await couponService.delete(id);
    if (!Coupon) {
      res.json({ code: "404", message: "Catalogs not foud" });
    }
    res.json({ code: "200", message: "sucsses" });
    // res.status(200).json({code:"200",message:"sucsses"});
  } catch (err) {
    console.log(err);
  }
};

module.exports.checkCoupon = async (req, res, next) => {
  try {
    const filter = {
      code: req.body.code,
    };
    const Coupon = await couponService.getAll(filter);
    if (Coupon[0]) {
      return res
        .status(200)
        .json({ code: "200", message: "sucsses", data: Coupon });
    } else {
      return res.status(404).json({ code: "404", message: "code not found" });
    }

    // res.status(404).json({code:"404",message:"fail"});
  } catch (err) {
    console.log(err);
  }
};
