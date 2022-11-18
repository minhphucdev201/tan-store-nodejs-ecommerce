// TẠO SCHEMA PRODUCT TRONG MONGODB
const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idCatalog: { type: mongoose.Schema.Types.ObjectId, ref: "Catalog" },
    thumbnail: [
      {
        imageUrl: { type: String },
      },
    ],
    description: { type: String, required: true },
    shortDescription: { type: String },
    originalPrice: { type: Number, required: true },
    salePrice: { type: Number },
    promotionPercent: { type: Number },
    isPromotion: { type: Boolean, default: false },
    isFreeShip: { type: Boolean, default: false },
    productNew: { type: Boolean, default: false },
    productSale: { type: Boolean, default: false },
    productTopSeller: { type: Boolean, default: false },
    view: { type: Number },
    quantitySale: { type: Number },
    status: { type: Boolean, default: false },
    slug: { type: String, slug: "name", unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
