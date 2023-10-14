var express = require("express");
const path = require("path");

var app = express();
app.use('/static', express.static(path.join(__dirname, 'frontend')))

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '/frontend/login.html'));
});



app.get("/game", function (req, res) {
    res.sendFile(path.join(__dirname, '/frontend/game.html'));
});
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
