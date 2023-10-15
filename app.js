const express = require("express");
const mysql = require("mysql");
const path = require("path");

const app = express();
app.use("/static", express.static(path.join(__dirname, "frontend")));
// Parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 3000;
// MySQL database configuration
const db = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "admin",
  password: "admin",
  database: "snakegame",
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/frontend/register.html"));
});

app.post("/", function (req, res) {
  const { username } = req.body;
  if(username != null){
    console.log(username);
    // res.send("Login successful!");
    res.sendFile(path.join(__dirname, "/frontend/game.html"));
  }else{
    res.sendFile(path.join(__dirname, "/frontend/register.html"));
  }

});

app.get("/game", function (req, res) {
  res.sendFile(path.join(__dirname, "/frontend/game.html"));
});

app.get("/recordgame", function (req, res) {
  res.sendFile(path.join(__dirname, "/frontend/game.html"));
});

app.listen(port, function () {
  console.log("Example app listening on port 3000!");
});
