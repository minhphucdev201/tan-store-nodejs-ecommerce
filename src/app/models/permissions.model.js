const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Permission", PermissionSchema);
