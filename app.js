// declaration of required modules
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
// const _ = require("lodash");

const saltRounds = 10;

// setting up the modules

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb://127.0.0.1:27017/userDB",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) console.log("Unable To Connect to DB", err);
    else console.log("Connected To DB Successfully");
  }
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser.save(function (err) {
      if (err) res.send(err);
      else res.render("secrets");
    });
  });
});

app.post("/login", function (req, res) {
  const userName = req.body.username;
  const password = req.body.password;
  User.findOne(
    {
      email: userName,
    },
    function (err, result) {
      if (!err) {
        bcrypt.compare(password, result.password, function (err, bcryptResult) {
          if (bcryptResult === true) {
            res.render("secrets");
          }
        });
      } else console.log("wrong password");
    }
  );
});

// app.get("/secrets", function (req, res) {
//   res.render("home")
// })

// app.get("/submit", function (req, res) {
//   res.render("home")
// })

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
