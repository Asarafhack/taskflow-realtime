const router = require("express").Router();
const auth = require("../middleware/auth");
const List = require("../models/List");

router.post("/", auth, async (req, res) => {
  try {
    const count = await List.countDocuments({ boardId: req.body.boardId });
    const list = await List.create({
      title: req.body.title,
      boardId: req.body.boardId,
      position: count,
    });
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to create list" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const lists = await List.find({ boardId: req.query.boardId }).sort("position");
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lists" });
  }
});

module.exports = router;
