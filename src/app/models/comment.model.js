const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    title: { type: String },
    name: { type: String },
    email: { type: String },
    phone: { type: Number },
    description: { type: String },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", CommentSchema);
