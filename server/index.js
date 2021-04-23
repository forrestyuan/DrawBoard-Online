const express = require("express");
const routes = require("./routes/router");
const app = express();
const IO_HANDLE = require("./handlers/index");

app.use(express.static("../frontend/dist"));
app.use("/", routes);

// Serve the files on port 3000.
const port = process.env.port || 3001;
const host = process.env.host || "127.0.0.1";
const server = app.listen(port, () => {
  console.log(`app listening at ${host}:${port}!\n`);
});

let userList = [];
var io = require("socket.io")(server);
IO_HANDLE(io, userList);
