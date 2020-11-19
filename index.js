const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const { joinUser, disconnectUser, getUser, getUsers } = require("./users");

const PORT = process.env.PORT || 4000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on("connect", (socket) => {
  console.log("New connection!");

  socket.on("join", ({ name }, callback) => {
    console.log(name);
    const { error, user } = joinUser({ id: socket.id, name });

    if (error) {
      return callback(error);
    }

    socket.join("global");

    socket.emit("message", { user: "server", text: `${user.name} welcome!` });
    socket.broadcast
      .to("global")
      .emit("message", { user: "server", text: `${user.name} has joined` });

    io.to("global").emit("users", { users: getUsers() });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    if (user) {
      io.to("global").emit("message", { user: user.name, text: message });
    }

    callback();
  });

  socket.on("disconnect", () => {
    const user = disconnectUser(socket.id);
    if (user) {
      io.to("global").emit("message", {
        user: "server",
        text: `${user.name} has left`,
      });
      io.to("global").emit("users", { users: getUsers() });
      console.log("Disconnect!");
    }
  });
});

server.listen(PORT, () => {
  console.log("Server on port", PORT);
});
