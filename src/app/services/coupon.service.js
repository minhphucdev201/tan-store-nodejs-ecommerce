const couponModel = require("../models/coupon.model");

exports.getAll = async (filter) => {
  try {
    const coupon = await couponModel.find(filter);
    return coupon;
  } catch (error) {
    console.log(error);
  }
};

exports.getById = async (id) => {
  try {
    const Coupon = await couponModel.findById(id);
    if (!Coupon) {
      return false;
    }
    return Coupon;
  } catch (err) {
    return false;
  }
};

exports.createNew = async (values) => {
  try {
    const customerId = values.customerId;
    const code = values.code;
    const percent = values.percent;
    const dateStart = values.dateStart;
    const dateEnd = values.dateEnd;
    const status = values.status;
    let newCoupon = new couponModel({
      customerId,
      code,
      percent,
      dateStart,
      dateEnd,
      status,
    });
    return newCoupon.save((err) => {
      if (err) {
        console.log(err);
        console.log("Add Coupon fail!");
      } else {
        console.log("Add Coupon Successfully");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.delete = async (id) => {
  try {
    const Coupon = await this.getById(id);
    if (!Coupon) {
      return false;
    }
    return await couponModel
      .deleteOne({ _id: id }, (err) => {
        console.log("Delete success!");
      })
      .clone();
  } catch (err) {
    console.log(err);
  }
};
