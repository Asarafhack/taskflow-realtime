const router = require("express").Router();
const auth = require("../middleware/auth");
const Board = require("../models/Board");
const List = require("../models/List");

router.post("/", auth, async (req, res) => {
  try {
    const board = await Board.create({
      title: req.body.title,
      members: [req.user.id],
      color: req.body.color || "blue",
    });

    const defaultLists = ["Backlog", "To Do", "In Progress", "Done"];
    await Promise.all(
      defaultLists.map((title, i) => List.create({ title, boardId: board._id, position: i }))
    );

    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ error: "Failed to create board" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const boards = await Board.find({ members: req.user.id }).populate("members", "name email");
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate("members", "name email");
    if (!board) return res.status(404).json({ error: "Board not found" });
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch board" });
  }
});

router.post("/:id/add-member", auth, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    if (board.members.includes(user._id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    board.members.push(user._id);
    await board.save();

    const populated = await Board.findById(board._id).populate("members", "name email");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to add member" });
  }
});

module.exports = router;
