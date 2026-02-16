const router = require("express").Router();
const auth = require("../middleware/auth");
const Activity = require("../models/Activity");

router.get("/", auth, async (req, res) => {
  try {
    const { boardId, userId, page = 1, limit = 30 } = req.query;
    const filter = {};
    if (boardId) filter.boardId = boardId;
    if (userId) filter.userId = userId;

    const activities = await Activity.find(filter)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const activity = await Activity.create({
      userId: req.user.id,
      userName: req.user.name,
      action: req.body.action,
      boardId: req.body.boardId,
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: "Failed to create activity" });
  }
});

module.exports = router;
