const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String, required: true },
  action: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
  createdAt: { type: Date, default: Date.now },
});

activitySchema.index({ boardId: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);
