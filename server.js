const dotenv = require("dotenv");
const mongoose = require("mongoose");
var debug = require("debug")("Cart:server");
var http = require("http");

process.on("uncaughtException", (err) => {
  console.log("Unhandled rejection! Shutting down server...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

var app = require("./app");

var DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL,
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connections Successfull");
  });

const port = normalizePort(process.env.PORT || 3000);
const server = app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

app.set("port", port);

server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
