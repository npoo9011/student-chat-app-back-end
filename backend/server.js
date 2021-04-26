// "uri":"mongodb+srv://shehzad_kareem_137:test1122@cluster0.lamak.mongodb.net/test?retryWrites=true&w=majority",
// heroku git:remote -a whatsapp137
const mongoose = require("mongoose");
const config = require("config");
const body = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: "*:*" });
const helperFunctions = require("./utils/helperFunction");
const { json } = require("body-parser");

io.on("connection", function (socket) {
  console.log("Connected...");
  // join chat event
  socket.on("join_chat", (data) => {
    console.log("join_chat: Room no ", data);
    socket.join(data);
    io.in(data).emit("joined", { data: data });
  });

  //chat message
  socket.on("chat_message", async (data) => {
    // console.log("data in chat_message", data);
    const message = await helperFunctions.createmessage(
      data.chatId,
      data.message,
      data.author
    );
    console.log("message: ", message);
    io.in(data.chatId).emit("chat_messages", { data: message });
  });

  // join group event
  socket.on("join_group", (data) => {
    socket.join(data);
    io.in(data).emit("joined_group", { data: data });
  });

  //group message
  socket.on("group_message", async (data) => {
    const message = await helperFunctions.createGroupsMessage(
      data.groupId,
      data.message,
      data.author
    );
    io.in(data.groupId).emit("group_messages", { data: message });
  });

  socket.on("disconnect", () => {
    console.log("disconnected...");
  });
});

mongoose
  .connect(config.get("uri"), {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(body.json());
app.use(body.urlencoded({ extended: false }));
app.use("/api/users", require("./Routes/user.routes"));
app.use("/api/group", require("./Routes/group.routes"));
app.use("/api/admin", require("./Routes/meta.routes"));

const port = process.env.PORT || 4000;
http.listen(port, () => console.log(`Listening on port ${port}...`));
