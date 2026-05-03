const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}));

app.get("/", (req, res) => {
  res.send("AlgoRealm backend is running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const players = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_world", (player) => {
    players[socket.id] = {
      id: socket.id,
      name: player.name || "Player",
      x: player.x || 100,
      y: player.y || 100,
      direction: "down"
    };

    socket.emit("world_players", players);
    socket.broadcast.emit("player_joined", players[socket.id]);

    console.log(`${players[socket.id].name} joined world`);
  });

  socket.on("player_move", (data) => {
    if (!players[socket.id]) return;

    players[socket.id] = {
      ...players[socket.id],
      x: data.x,
      y: data.y,
      direction: data.direction
    };

    socket.broadcast.emit("player_moved", players[socket.id]);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    delete players[socket.id];
    socket.broadcast.emit("player_left", socket.id);
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});