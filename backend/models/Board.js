const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  color: { type: String, default: "blue" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Board", boardSchema);
