const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    idCatalogBlog: { type: mongoose.Schema.Types.ObjectId, ref: "CatalogBlog" },
    description: { type: String },
    thumbnail: { type: String },
    view: { type: Number },
    content: { type: String },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", BlogSchema);
