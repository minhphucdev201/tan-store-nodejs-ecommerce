const mongoose = require("mongoose");

const CatalogBlogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hide: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CatalogBlog", CatalogBlogSchema);
 