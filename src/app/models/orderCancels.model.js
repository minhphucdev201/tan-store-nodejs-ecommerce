const mongoose = require("mongoose");

const OrderCancelSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    dateCancel: { type: Date },
    reason: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderCancel", OrderCancelSchema);
