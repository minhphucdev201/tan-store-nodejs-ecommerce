const mongoose = require("mongoose");

const OrderDetailSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    quantity: { type: Number },
    price: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderDetail", OrderDetailSchema);
