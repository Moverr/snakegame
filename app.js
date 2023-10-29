const express = require("express");
const mysql = require("mysql");
const path = require("path");

const app = express();
app.use("/static", express.static(path.join(__dirname, "frontend")));
// Parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", __dirname + "/frontend");

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
  const data = null;
  res.render("register", { data });
});

const leaderboard = [
  { level: "1", id: 1, name: "movers", points: 12 },
  { level: "2", id: 2, name: "movers", points: 234 },
  { level: "3", id: 3, name: "movers", points: 43 },
];

const scores=(profile_id)=>{

  //todo: return scores :: 
  const query1 ="SELECT * FROM scores where profile_id = " + profile_id + " limit 100";
  db.query(query1, (err, results) => {
    if (err) {
      return [];
    }else{
      return results;
    }
  });
}


  const leadership=(level)=>{
 
    const query1 ="SELECT distinct * FROM scores where level  like '" + level + "' limit 100";
    db.query(query1, (err, results) => {
      if (err) {
        return [];
      }else{
        return results;
      }
    });
  }

    

app.post("/", function (req, res) {
  const { username } = req.body;
  if (username != null) {
    console.log(username);

    const query =
    "INSERT INTO `profiles` (`id`, `name`, `date_created`) VALUES (NULL, '" +
    username +
    "', current_timestamp());";

     
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query: " + err);
        res.status(500);
        return res.render("register", { err });
      } else {
        res.redirect('/game?username='+username);
      }
    });
  }
});

app.get("/game", function (req, res) {

  const username = req.query.username;
  if(username === undefined)
  res.redirect('/');

  console.log(username);

  const query =
  "SELECT * FROM profiles where name like '" + username + "' limit 1"; 
  console.log(query);

db.query(query, (err, results) => {
  if (err) {
    console.error("Error executing query:", err);
    res.redirect('/?error='+err);
  } else {
    if( results.length > 0){
      const data = {
        leaderboard: leaderboard,
        profile: results[0],
      };
     return  res.render("game", { data });
    }else{
   
      console.log(results);
      res.redirect('/');
    }
    
  }
});

 
});

app.post("/recordScore", function (req, res) {
  const { level,score,profile } = req.body;
  if(level != null && score != null  && profile != null ){
    const query =
    "INSERT INTO `scores` (`id`, `profile_id`, `score`, `level`, `date_created`) VALUES (NULL, (SELECT id from profiles where name like '"+profile+"' limit 1 ),"+score+","+level+", current_timestamp());";
  
    db.query(query, (err, results) => {
    });
     res.send("done");
  }
});

app.listen(port, function () {
  console.log("Example app listening on port 3000!");
});
