const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.set("view engine", "ejs");
app.use((req,res,next) => {
    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
    next()
})
app.use(express.static("public"));
let port = process.env.PORT||3000;

app.get("/", (req, res) => res.render("index"));
const user = {};
io.on("connection", (socket) => {
  socket.on("user-connected", (data) => {
    user[socket.id] = data;

    socket.broadcast.emit("receive-message", {
      message: `${data} has joined room`,
    });
  });
  socket.on("chat-message", (message, name) => {
    socket.broadcast.emit("receive-message", {
      message: message,
      name: user[socket.id],
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnect", user[socket.id]);
    delete user[socket.id];
   
  });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
