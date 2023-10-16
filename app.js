const express = require("express");
const mysql = require("mysql");
const path = require("path");

const app = express();
app.use("/static", express.static(path.join(__dirname, "frontend")));
// Parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine', 'ejs');
app.set('views', __dirname + '/frontend'); 



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

const leaderboard = [
  {level:"level 1",id:1,name:"movers",points:2322},
  {level:"level 1",id:1,name:"movers",points:2322},
  {level:"level 1",id:1,name:"movers",points:2322}
]
  
 

app.post("/", function (req, res) {
  const { username } = req.body;
  if(username != null){
    console.log(username);
    // save this to the database and move pass it in the name 
    // res.send("Login successful!");
    const query = "INSERT INTO `profiles` (`id`, `name`, `date_created`) VALUES (NULL, '"+username+"', current_timestamp());";
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err); 
      }

      const data = leaderboard;
      res.send(path.join(__dirname, "/frontend/game.html",{data}));
    });
  
   
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
