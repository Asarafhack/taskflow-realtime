const { Server } = require("socket.io");

let io;
const boardPresence = {};

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    let currentBoard = null;
    let currentUser = null;

    socket.on("join-board", ({ boardId, userId, userName }) => {
      currentBoard = boardId;
      currentUser = { userId, userName };
      socket.join(boardId);

      if (!boardPresence[boardId]) boardPresence[boardId] = [];
      const exists = boardPresence[boardId].find((u) => u.userId === userId);
      if (!exists) boardPresence[boardId].push({ userId, userName, socketId: socket.id });

      io.to(boardId).emit("presence-update", boardPresence[boardId]);
    });

    socket.on("task-change", ({ boardId, action }) => {
      io.to(boardId).emit("refresh", { action });
    });

    socket.on("task-lock", ({ boardId, taskId, userId }) => {
      socket.to(boardId).emit("task-locked", { taskId, userId });
    });

    socket.on("task-unlock", ({ boardId, taskId }) => {
      socket.to(boardId).emit("task-unlocked", { taskId });
    });

    socket.on("disconnect", () => {
      if (currentBoard && boardPresence[currentBoard]) {
        boardPresence[currentBoard] = boardPresence[currentBoard].filter(
          (u) => u.socketId !== socket.id
        );
        io.to(currentBoard).emit("presence-update", boardPresence[currentBoard]);
      }
    });
  });
};

const getIO = () => io;

module.exports = { initSocket, getIO };
