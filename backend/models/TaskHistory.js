const mongoose = require("mongoose");

const taskHistorySchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  changeType: { type: String, required: true },
  previousValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changedByName: { type: String },
  timestamp: { type: Date, default: Date.now },
});

taskHistorySchema.index({ taskId: 1, timestamp: -1 });

module.exports = mongoose.model("TaskHistory", taskHistorySchema);
