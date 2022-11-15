const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    listPermissions: [
      {
        idPermissions: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Permission",
        },
        name: { type: String },
        status: { type: Boolean, default: false },
      },
    ],
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Role", RoleSchema);
