const router = require("express").Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const TaskHistory = require("../models/TaskHistory");
const { getIO } = require("../socket");

router.post("/", auth, async (req, res) => {
  try {
    const count = await Task.countDocuments({ listId: req.body.listId });
    const task = await Task.create({ ...req.body, position: count });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const existing = await Task.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Task not found" });

    const changes = {};
    for (const key of Object.keys(req.body)) {
      if (JSON.stringify(existing[key]) !== JSON.stringify(req.body[key])) {
        changes[key] = { from: existing[key], to: req.body[key] };
      }
    }

    if (req.body.completed && !existing.completed) {
      req.body.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    for (const [key, val] of Object.entries(changes)) {
      await TaskHistory.create({
        taskId: task._id,
        changeType: key,
        previousValue: val.from,
        newValue: val.to,
        changedBy: req.user.id,
        changedByName: req.user.name,
      });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

router.post("/:id/assign", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { assignedTo: req.body.userId } },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to assign" });
  }
});

router.get("/search", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      title: { $regex: req.query.q || "", $options: "i" },
    }).limit(20);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

router.get("/completed", auth, async (req, res) => {
  try {
    const { date } = req.query;
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      completed: true,
      completedAt: { $gte: start, $lte: end },
    }).sort("-completedAt");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch completed tasks" });
  }
});

router.get("/history/:taskId", auth, async (req, res) => {
  try {
    const history = await TaskHistory.find({ taskId: req.params.taskId })
      .sort("-timestamp")
      .limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { listId, page = 1, limit = 20 } = req.query;
    const filter = listId ? { listId } : {};
    const tasks = await Task.find(filter)
      .sort("position")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Task.countDocuments(filter);
    res.json({ tasks, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

module.exports = router;
