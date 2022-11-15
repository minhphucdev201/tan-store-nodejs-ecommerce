const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    code: { type: String, required: true },
    percent: { type: Number, required: true },
    dateStart: { type: Date },
    dateEnd: { type: Date },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", CouponSchema);
