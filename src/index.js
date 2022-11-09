const express = require("express");
const passport = require("passport");
const path = require("path");
const Strategy = require("passport-local").Strategy;
const db = require("./config");
const cors = require("cors");

// Create a new Express application.
const app = express();
require("./passport")(passport, Strategy);
// Configure view engine to render EJS templates.
app.use(express.static(path.join(__dirname + "public")));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require("morgan")("combined"));
app.use(require("body-parser").urlencoded({ extended: true }));
app.disable("etag");
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE"
  })
);
require("./routes")(app, passport, db);

// const server = require("http").Server(app);
// const io = require("socket.io")(server);

// io.on("connection", function(socket) {
//   socket.on("disconnect", function(){})
//   //server lắng nghe dữ liệu từ client
//   socket.on("Client-sent")
// })

app.listen(3000);
