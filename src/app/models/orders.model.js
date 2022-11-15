const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    fullname: { type: String, required: true },
    address: { type: Object, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    status: { type: Boolean, default: false },
    cancel: { type: Boolean, default: false },
    reason: { type: String },
    total: { type: Number },
    dateSend: { type: Date },
    dataSuccess: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
