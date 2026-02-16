require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

initSocket(server);

app.use("/auth", require("./routes/auth"));
app.use("/boards", require("./routes/boards"));
app.use("/lists", require("./routes/lists"));
app.use("/tasks", require("./routes/tasks"));
app.use("/activity", require("./routes/activity"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server };
