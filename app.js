require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

//user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.route("/login")
.get(function(req, res){
  res.render("login");
})

.post(function(req, res){
  User.findOne({email: req.body.username}, function(err, user){
    if(err){
      console.log(err);
    } else {
      if(user) {
        bcrypt.compare(req.body.password, user.password, function(err, result){
          if(result){
            res.render("secrets");
          }
        });
      }
    }
  })
});

app.route("/register")
.get(function(req, res){
  res.render("register");
})

.post(function(req, res){
  //create new user

  //encrypt password
  bcrypt.hash(req.body.password, saltRounds, function(err, hash){
    let newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err){
      if(err){
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});



app.listen(3000, function(){
  console.log("Server started on port 3000");
});
