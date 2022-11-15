const mongoose = require("mongoose");

const CatalogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hide: {
      type: Boolean,
      default: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Catalog", CatalogSchema);
