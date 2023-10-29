const express = require("express");
const mysql =require("mysql");
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
  allowPublicKeyRetrieval: true,
  ssl: false,
});

  

app.get("/", function (req, res) {
  const data = null;
  res.render("register", { data });
});

 

const scores = (profile_id) => {
  //todo: return scores ::
  const query1 =
    "SELECT * FROM scores where profile_id = " + profile_id + " limit 100";
  db.query(query1, (err, results) => {
    if (err) {
      console.log(err);
      return [];
    } else {
      console.log(err);
      return results;
    }
  });
};

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
        console.log(err.code)
        if(err.code ==="ER_DUP_ENTRY"){
          res.redirect("/game?username=" + username);
        }else{
          res.status(500);
      
          return res.render("register", { err });
        }
      
      } else {
        res.redirect("/game?username=" + username);
      }
    });
  }
});

app.get("/game", function (req, res) {
  const username = req.query.username;
  if (username === undefined) res.redirect("/");

  console.log(username);

  const query =
    "SELECT * FROM profiles where name like '" + username + "' limit 1";
  console.log(query);

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.redirect("/?error=" + err);
    } else {
      if (results.length > 0) {
        const _profile = results[0];

        //todo: fetch all details from the backed- 500 records, in which you can filter out and dissemiante information
        const scoresQuery =
          "SELECT a.id,b.name, a.score FROM scores a  inner join profiles b on a.profile_id = b.id where    a.score > 0 limit 100";

          console.log(scoresQuery);

        db.query(scoresQuery, (err, ScoreResults) => {
          if (err) {
            console.log(err);

            const data = {
              scores: [], 
              profile: _profile,
            };
            return res.render("game", { data });
          } else {

            console.log(ScoreResults);

            const data = {
              scores: ScoreResults, 
              profile: _profile,
            };
            return res.render("game", { data });
          }
        });
      } else {
        console.log(results);
        res.redirect("/");
      }
    }
  });
});

app.post("/recordscore", function (req, res) {
  console.log("pass me ");
  res.send("reached");

  const { level, score, profile } = req.body;
  if (level != undefined && score != undefined && profile != undefined) {
    const query =
      "INSERT INTO `scores` (`id`, `profile_id`, `score`, `level`, `date_created`) VALUES (NULL, (SELECT id from profiles where name like '" +
      profile +
      "' limit 1 )," +
      score +
      "," +
      level +
      ", current_timestamp());";

    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log(results);
      }
    });
    res.send("worked");
  } else {
    res.status(400).send("did not work");
  }
});

app.listen(port, function () {
  console.log("Example app listening on port 3000!");
});
