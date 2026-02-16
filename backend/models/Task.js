const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  colorTag: { type: String, enum: ["blue", "green", "yellow", "red", "purple", "orange"] },
  position: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

taskSchema.index({ listId: 1 });
taskSchema.index({ completed: 1, completedAt: -1 });

module.exports = mongoose.model("Task", taskSchema);
