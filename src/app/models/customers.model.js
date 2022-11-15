const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number },
    address: { type: String },
    avatar: {
      type: String,
      default: "https://www.pngarts.com/files/6/User-Avatar-in-Suit-PNG.png",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", CustomerSchema);
